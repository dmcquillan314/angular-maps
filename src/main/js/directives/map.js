(function() {
    'use strict';

angular.module('angular-maps')

    .directive('map', [ function() {
        return {
            restrict: 'E',
            transclude: true,
            priority: 100,
            template: '<div class="angular-google-map"><div class="angular-google-map-container"></div><div ng-transclude style="display: none"></div></div>',
            replace: true,
            controller: 'MapController',
            link: function link(scope, element, attrs, controller) {
                console.log(scope);
                console.log(element);
                console.log(attrs);
                console.log(controller);
            }
        };
    }]);

})();