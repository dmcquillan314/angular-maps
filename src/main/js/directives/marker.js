(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name maps.directive:marker
     *
     * @description The marker directive interacts with the map directive's controller
     * to manage a set of markers for that map based on the lifecycle of the marker directive
     *
     * @priority 100
     */
angular.module('angular-maps')

    .directive('marker', [ function() {

        return {
            restrict: 'E',
            require: '^map',
            priority: 0,
            link: function(scope, element, attributes, controller) {

                var options = {
                    position: new google.maps.LatLng(40.80, -74.13),
                    draggable: true,
                    flat: true,
                    anchor: RichMarkerPosition.MIDDLE,
                    content: 'test'
                };

                controller.addMarker(marker);

                scope.$on('$destroy', function() {
                    controller.removeMarker(marker);
                });
            }
        };

    }]);

})();