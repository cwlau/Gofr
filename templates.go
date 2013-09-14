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

const indexTemplateHTML = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en" ng-app="Gofr">
  <head profile="http://www.w3.org/2005/10/profile">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link href="content/reader.css" type="text/css" rel="stylesheet"/>
    <script src="content/sprintf.min.js" type="text/javascript"></script>
    <script src="content/angular.min.js" type="text/javascript"></script>
    <script src="content/directives.js" type="text/javascript"></script>
    <script src="content/ang/reader.js" type="text/javascript"></script>
    <script src="content/ang/feed.js" type="text/javascript"></script>
    <script src="content/ang/article.js" type="text/javascript"></script>
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
    <div id="reader" ng-controller="ReaderCtrl">
      <div class="feeds-container">
        <button class="subscribe">Subscribe</button>
        <ul id="subscriptions" ng-controller="FeedCtrl">
          <subscription subscription="root"></subscription>
          <subscription subscription="item" ng-repeat="item in root.items | orderBy:'title'"></subscription>
        </ul>
      </div>
      <div class="entries-container">
        <div class="center-message"></div>
        <div class="entries-header"></div>
        <div id="entries"></div>
      </div>
    </div>
    <div id="floating-nav"></div>
  </body>
</html>
`
