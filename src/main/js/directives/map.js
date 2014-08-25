(function() {
    'use strict';

angular.module('angular-maps')

    .directive('map', [ function() {
        return {
            restrict: 'E',
            transclude: true,
            priority: 100,
            template: '<div>' +
                        '<div id="" style="width:100%;height:100%;"></div>' +
                        '<div ng-transclude></div>' +
                      '</div>',
            replace: true,
            controller: 'MapController'
        };
    }]);

})();