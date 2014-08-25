(function() {
    'use strict';

angular.module('angular-maps')

    .factory('DefaultMarkerFactory', [ function() {
        var factory = {};

        factory.createMarker = function(options) {
            return new google.maps.Marker(options);
        };

        return factory;
    }])

    .factory('RichMarkerFactory', [ function() {
        var factory = {};

        factory.createMarker = function(options) {
            return new RichMarker(options);
        };

        return factory;
    }])

    .factory('MarkerFactory', [ 'DefaultMarkerFactory', 'RichMarkerFactory', function(DefaultMarkerFactory, RichMarkerFactory) {

        var factory = {};

        factory.createMarker = function(options) {
            if(angular.isDefined(options.content)) {
                return RichMarkerFactory.createMarker(options);
            }

            return DefaultMarkerFactory.createMarker(options);
        };

        return factory;

    }]);

})();