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
 
function ArticleCtrl($scope, $http) {
  // $http({
  //     url: '/subscriptions',
  //     method: 'GET', 
  //   })
  //   .success(function(data, status, headers, config) {
  //     var folderMap = {
  //       "": {
  //         title: _l("All Items"),
  //         items: [], 
  //         unread: 0, 
  //         parent: null,
  //       },
  //     };

  //     $scope.root = folderMap[""];

  //     angular.forEach(data.folders, function(folder) {
  //       if (folder.id) {
  //         folder.items = [];
  //         folder.unread = 0;
  //         folder.parent = $scope.root;

  //         $scope.root.items.push(folder);
  //         folderMap[folder.id] = folder;
  //       }
  //     });

  //     angular.forEach(data.subscriptions, function(subscription) {
  //       var folder = folderMap[subscription.parent || ""];
  //       if (folder) {
  //         folder.items.push(subscription);
  //         subscription.parent = folder;

  //         folder.unread += subscription.unread;
  //         if (folder.parent)
  //           folder.parent.unread += subscription.unread;
  //       }
  //     });
  //   })
  //   .error(function(data, status, headers, config) {
  //     // FIXME
  //     // called asynchronously if an error occurs
  //     // or server returns response with an error status.
  //   });
}
