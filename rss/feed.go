/*****************************************************************************
 **
 ** Gofr
 ** https://github.com/melllvar/Gofr
 ** Copyright (C) 2013 Akop Karapetyan
 **
 ** This program is free software; you can redistribute it and/or modify
 ** it under the terms of the GNU General Public License as published by
 ** the Free Software Foundation; either version 2 of the License, or
 ** (at your option) any later version.
 **
 ** This program is distributed in the hope that it will be useful,
 ** but WITHOUT ANY WARRANTY; without even the implied warranty of
 ** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 ** GNU General Public License for more details.
 **
 ** You should have received a copy of the GNU General Public License
 ** along with this program; if not, write to the Free Software
 ** Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
 **
 ******************************************************************************
 */
 
package rss

import (
	"bytes"
	"code.google.com/p/go-charset/charset"
	_ "code.google.com/p/go-charset/data"
	"crypto/md5"
	"encoding/xml"
	"errors"
	"html"
	"io"
	"io/ioutil"
	"regexp"
	"sanitize"
	"sort"
	"time"
)

type Feed struct {
	URL string
	Title string
	Description string
	Updated time.Time
	WWWURL string
	Format string
	HourlyUpdateFrequency float32
	Entries []*Entry
	HubURL string
	Topic string
}

type Entry struct {
	GUID string
	Author string
	Title string
	WWWURL string
	Content string
	Published time.Time
	Updated time.Time
	Media []Media
}

type Media struct {
	URL string
	Type string
	Title string
}

const (
	maxSummaryLength = 400
)

type SortableTimes []time.Time 

func (s SortableTimes) Len() int {
	return len(s)
}

func (s SortableTimes) Swap(i int, j int) {
	s[i], s[j] = s[j], s[i]
}

func (s SortableTimes) Less(i int, j int) bool {
	return s[i].Before(s[j])
}

func (feed *Feed)DurationBetweenUpdates() time.Duration {
	if feed.HourlyUpdateFrequency != 0 {
		// Set explicitly
		return time.Duration(feed.HourlyUpdateFrequency) * time.Hour
	}

	// Compute frequency by analyzing entries in the feed
	pubDates := make(SortableTimes, len(feed.Entries))
	for i, entry := range feed.Entries {
		pubDates[i] = entry.LatestModification()
	}

	// Sort dates in ascending order
	sort.Sort(pubDates)

	// Compute the average difference between them
	durationBetweenUpdates := time.Duration(0)
	if len(pubDates) > 1 {
		deltaSum := 0.0
		for i, n := 1, len(pubDates); i < n; i++ {
			deltaSum += float64(pubDates[i].Sub(pubDates[i - 1]).Hours())
		}

		durationBetweenUpdates = time.Duration(deltaSum / float64(len(pubDates) - 1)) * time.Hour
	}

	// Clamp the frequency
	minFrequency := time.Duration(30) * time.Minute // 30 minutes
	maxFrequency := time.Duration(24) * time.Hour   // 1 day

	if durationBetweenUpdates > maxFrequency {
		return maxFrequency
	} else if durationBetweenUpdates < minFrequency {
		return minFrequency
	}

	return durationBetweenUpdates
}

func (entry *Entry)LatestModification() time.Time {
	if entry.Updated.After(entry.Published) {
		return entry.Updated
	}

	return entry.Published
}

func (feed Feed)Digest() []byte {
	hasher := md5.New()

	io.WriteString(hasher, feed.Title)
	io.WriteString(hasher, feed.Description)
	io.WriteString(hasher, feed.WWWURL)
	io.WriteString(hasher, feed.Format)
	io.WriteString(hasher, feed.HubURL)
	io.WriteString(hasher, feed.Topic)

	return hasher.Sum(nil)
}

func (entry *Entry)UniqueID() string {
	if entry.GUID != "" {
		return entry.GUID
	}

	if !entry.LatestModification().IsZero() {
		return entry.WWWURL + "@" + entry.LatestModification().String()
	}

	return entry.WWWURL
}

func (entry Entry)Digest() []byte {
	hasher := md5.New()

	// Why not just hash all of the content each time?
	// Contents in entries of feeds like 'reddit' constantly 
	// change, because the comment count in the article
	// changes. So we avoid hashing by content as much as possible
	if !entry.Updated.IsZero() {
		// Use "Updated" as the hashing value if available
		io.WriteString(hasher, entry.Updated.String())
	} else if !entry.Published.IsZero() {
		// "Updated" is not available, but "Published" is
		io.WriteString(hasher, entry.Published.String())
	} else {
		// No publish or update information available
		// Hash the content of the entry
		io.WriteString(hasher, entry.Author)
		io.WriteString(hasher, entry.Title)
		io.WriteString(hasher, entry.WWWURL)
		io.WriteString(hasher, entry.Content)

		for _, media := range entry.Media {
			io.WriteString(hasher, media.URL)
		}
	}

	return hasher.Sum(nil)
}

type FeedMarshaler interface {
	Marshal() (Feed, error)
}

type GenericFeed struct {
	XMLName xml.Name
}

func UnmarshalStream(url string, reader io.Reader) (*Feed, error) {
	// Read the stream into memory (we'll need to parse it twice)
	var contentReader *bytes.Reader
	if buffer, err := ioutil.ReadAll(reader); err == nil {
		contentReader = bytes.NewReader(buffer)
	} else {
		return nil, err
	}

	genericFeed := GenericFeed{}

	decoder := xml.NewDecoder(contentReader)
	decoder.CharsetReader = charset.NewReader

	if err := decoder.Decode(&genericFeed); err != nil {
		 return nil, err
	}

	var xmlFeed FeedMarshaler

	if genericFeed.XMLName.Space == "http://www.w3.org/1999/02/22-rdf-syntax-ns#" && genericFeed.XMLName.Local == "RDF" {
		xmlFeed = &rss1Feed { }
	} else if genericFeed.XMLName.Local == "rss" {
		xmlFeed = &rss2Feed { }
	} else if genericFeed.XMLName.Space == "http://www.w3.org/2005/Atom" && genericFeed.XMLName.Local == "feed" {
		xmlFeed = &atomFeed { }
	} else {
		return nil, errors.New("Unsupported type of feed (" +
			genericFeed.XMLName.Space + ":" + genericFeed.XMLName.Local + ")")
	}

	contentReader.Seek(0, 0)

	decoder = xml.NewDecoder(contentReader)
	decoder.CharsetReader = charset.NewReader

	if err := decoder.Decode(xmlFeed); err != nil {
		return nil, err
	}
	
	feed, err := xmlFeed.Marshal()
	feed.URL = url

	if err != nil {
		return nil, err
	}

	return &feed, nil
}

func parseTime(supportedFormats []string, timeSpec string) (time.Time, error) {
	if timeSpec != "" {
		for _, format := range supportedFormats {
			if parsedTime, err := time.Parse(format, timeSpec); err == nil {
				return parsedTime.UTC(), nil
			}
		}

		return time.Time {}, errors.New("Unrecognized time format: " + timeSpec)
	}

	return time.Time {}, nil
}

func substr(s string, pos int, length int) string {
	runes := []rune(s)
	l := pos + length
	if l > len(runes) {
		l = len(runes)
	}

	return string(runes[pos:l])
}

var extraSpaceStripper *regexp.Regexp = regexp.MustCompile(`\s\s+`)

func DeHTMLize(str string) string {
	// TODO: This process should be streamlined to do
	// more things with fewer passes
	sanitized := sanitize.StripTags(str)
	unescaped := html.UnescapeString(sanitized)

	return extraSpaceStripper.ReplaceAllString(unescaped, "")
}

func (entry Entry)Summary() string {
	summary := DeHTMLize(entry.Content)
	if runes := []rune(summary); len(runes) > maxSummaryLength {
		return string(runes[:maxSummaryLength])
	} else {
		return summary
	}
}
