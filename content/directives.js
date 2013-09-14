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
 
angular
  .module('components', [])
  .directive('subscription', function($compile) {
    return {
      restrict: 'E',
      scope: {
        subscription: '=',
      },
      templateUrl: 'content/partials/subscription.html',
      link: function(scope, element, attrs) {
        if (scope.subscription && angular.isArray(scope.subscription.items)) {
          element.find('li').append("<ul><subscription subscription=\"subItem\" ng-repeat=\"subItem in subscription.items | orderBy:'title'\"></subscription></ul>");
          $compile(element.contents())(scope);
        }
      },
      controller: function($scope, $element, $attrs, $location) {
        $scope.select = function(subscription) {
          $scope.$emit('subscriptionSelected', { subscription: subscription });
        };
      },
    };
  })
  .directive('article', function($compile) {
    return {
      restrict: 'E',
      scope: {
        article: '=',
      },
      templateUrl: 'content/partials/article.html',
    };
  });

angular.module('Gofr', ['components']);
