angular.module('angular-maps')

    .controller('MapController', [ '$scope', '$parse', '$element', '$attrs', 'MarkerFactory', function($scope, $parse, $element, $attrs, MarkerFactory) {

        var controller = this,
            _events = $parse($attrs.events)($scope),
            _options = {
                zoom: $parse($attrs.zoom)($scope)
            },
            _markers = [],
            _center = $parse($attrs.center)($scope),
            _pan = $attrs.pan ? $parse($attrs.pan)($scope) : false;

        var _map = new google.maps.Map($element[0].firstChild, _options),
            _control = $attrs.control ? $parse($attrs.control)($scope) : {};

        _control.getMap = function() {
            return _map;
        };

        var unbindEvents = function() {
            google.maps.event.clearInstanceListeners(_map);
        };

        var updateEvents = function() {
            angular.forEach(_events, function(handlerFn, eventName) {
                google.maps.event.addListener(eventName, function(event) {
                    handlerFn(_map, eventName, event);
                });
            });
        };

        var _draw = function() {
                var bounds = new google.maps.LatLngBounds();

                for( var markerIndex in _markers ) {
                    var marker = _markers[markerIndex];
                    bounds.extend(marker.position);
                }

                if(_pan) {
                    _map.panToBounds(bounds);
                } else {
                    _map.fitBounds(bounds);
                }
            },
            _updateCenter = function() {
                var centerPoint = new google.maps.LatLng(
                                            parseFloat( _center.latitude, 10 ),
                                            parseFloat( _center.longitude, 10 )
                                        );

                if(_pan) {
                    _map.panTo(centerPoint);
                } else {
                    _map.setCenter(centerPoint);
                }
            };

        controller.addMarker = function(marker) {
            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });

            marker._id = guid;
            marker.map = _map;

            var markerObject = MarkerFactory.createMarker(marker);
            _markers.push(markerObject);

            _draw();

            return markerObject;
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
            _markers.splice(markerIndexFromCache, 1);
            _draw();
        };

        _updateCenter();

        $scope.$watch($attrs.center, function(center) {
            _center = center;
            _updateCenter();
        }, true);

        $scope.$watch( $attrs.events, function(events) {
            unbindEvents();
            _events = events;
            updateEvents();
        });
    }]);
