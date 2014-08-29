angular.module('angular-maps')

    .controller('MapController', [ '$scope', '$element', '$attrs', 'MarkerFactory', function($scope, $element, $attrs, MarkerFactory) {

        console.log($attrs);

        var controller = this,
            _options = {
                zoom: 7,
                center: google.maps.LatLng(40, -74)
            },
            _markers = [];

        var _map = new google.maps.Map($element[0].firstChild, _options);

        controller.addMarker = function(marker) {
            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });

            marker._id = guid;
            marker.map = _map;

            _markers.push(MarkerFactory.createMarker(marker));
        };

        controller.removeMarker = function(marker) {

            var markerGuid = marker._id,
                markerFromCache = null,
                markerIndexFromCache = null;

            for( var i = 0; i < _markers.length; i++ ) {
                if( _markers[i]._id === markerGuid ) {
                    markerFromCache = _markers[i];
                    markerIndexFromCache = i;
                    break;
                }
            }

            markerFromCache.setMap(null);
            _markers.splice(markerIndexFromCache);
        };

    }]);
