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
 
package gofr

const angularIndexTemplateHTML = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en" ng-app>
  <head profile="http://www.w3.org/2005/10/profile">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link href="content/reader.css" type="text/css" rel="stylesheet"/>
    <script src="content/ang/angular.min.js" type="text/javascript"></script>
    <script src="content/ang/feed.js" type="text/javascript"></script>
    <script src="content/ang/reader.js" type="text/javascript"></script>
    <title>Gofr</title>
  </head>
  <body>
    <div id="toast"><span></span></div>
    <div id="header">
      <h1>Gofr</h1>
      <div class="navbar">
        <a class="import-subscriptions" href="#">Import subscriptions</a>
      </div>
    </div>
    <div id="navbar">
      <div class="right-aligned">
        <button class="settings dropdown" data-ddid="settings" title="Options"></button>
        <button class="select-article up" title="Previous Article"></button><button class="select-article down" title="Next Article"></button>
      </div>
      <button class="navigate">Navigate</button>
      <button class="refresh" title="Refresh">&nbsp;</button>
      <button class="filter dropdown selectable" data-ddid="filter">All Items</button>
      <button class="mark-all-as-read">Mark all as read</button>
    </div>
    <div id="reader">
      <div class="feeds-container">
        <button class="subscribe">Subscribe</button>
        <ul id="subscriptions" ng-controller="FeedCtrl">
          <li class="subscription" ng-repeat="feed in feeds">
            <div class="subscription-item">
              <div class="subscription-icon"></div>
              <div class="subscription-title">{{feed.title}}</div>
              <div class="subscription-unread-count">({{feed.unread}})</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="entries-container">
        <div class="center-message"></div>
        <div class="entries-header"></div>
        <div id="entries"></div>
      </div>
    </div>
    <div id="floating-nav"></div>
<!--
    <div class="modal-blocker"></div>
    <div id="import-subscriptions" class="modal">
      <div class="modal-inner">
        <h1>Upload OPML file</h1>
        <form enctype="multipart/form-data" action="#" method="POST">
          <input name="opml" type="file" />
        </form>
        <div class="buttons">
          <button class="modal-cancel">Cancel</button>
          <button class="modal-ok">Upload</button>
        </div>
      </div>
    </div>
-->
  </body>
</html>
`

const indexTemplateHTML = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
  <head profile="http://www.w3.org/2005/10/profile">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link href="content/reader.css" type="text/css" rel="stylesheet"/>
    <script type="text/javascript" src="/_ah/channel/jsapi"></script>
    <script src="content/sprintf.min.js" type="text/javascript"></script>
    <script src="content/jquery-1.9.1.min.js" type="text/javascript"></script>
    <script src="content/jquery.hotkeys.js" type="text/javascript"></script>
    <script src="content/jquery.cookie.js" type="text/javascript"></script>
    <script src="content/jquery.form.min.js" type="text/javascript"></script>
    <script src="content/jquery.scrollintoview.min.js" type="text/javascript"></script>
    <script src="content/reader.js" type="text/javascript"></script>
    <title>Gofr</title>
  </head>
  <body>
    <div id="toast"><span></span></div>
    <div id="header">
      <h1>Gofr</h1>
      <div class="navbar">
        <a class="import-subscriptions" href="#">Import subscriptions</a>
      </div>
    </div>
    <div id="navbar">
      <div class="right-aligned">
        <button class="settings dropdown" data-ddid="settings" title="Options"></button>
        <button class="select-article up" title="Previous Article"></button><button class="select-article down" title="Next Article"></button>
      </div>
      <button class="navigate">Navigate</button>
      <button class="refresh" title="Refresh">&nbsp;</button>
      <button class="filter dropdown selectable" data-ddid="filter">All Items</button>
      <button class="mark-all-as-read">Mark all as read</button>
    </div>
    <div id="reader">
      <div class="feeds-container">
        <button class="subscribe">Subscribe</button>
        <ul id="subscriptions"></ul>
      </div>
      <div class="entries-container">
        <div class="center-message"></div>
        <div class="entries-header"></div>
        <div id="entries"></div>
      </div>
    </div>
    <div id="floating-nav"></div>
    <div class="modal-blocker"></div>
    <div id="import-subscriptions" class="modal">
      <div class="modal-inner">
        <h1>Upload OPML file</h1>
        <form enctype="multipart/form-data" action="#" method="POST">
          <input name="opml" type="file" />
        </form>
        <div class="buttons">
          <button class="modal-cancel">Cancel</button>
          <button class="modal-ok">Upload</button>
        </div>
      </div>
    </div>
  </body>
</html>
`
