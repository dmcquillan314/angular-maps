    /**
     * @ngdoc directive
     * @name maps.directive:marker
     *
     * @description The marker directive is used to add a google.maps.Marker or RichMarker(html marker) object to an existing map.  If both the icon and content are specified it will give the
     * content priority
     *
     * @param {expression} [position] Expression to evaluate as an object representing the map center. May be in the form of an object containing latitude and longitude properties.
     *
     * Note: Evaluated on the attribute only.  This is not watched on the scope
     *
     * @param {object} [control=undefined] If this attribute is passed it will bind a few methods to the passed object
     *
     * <dl>
     *     <dt>getMarker()</dt>
     *     <dd>returns a direct reference to the map of the directive</dd>
     * </dl>
     *
     * More to possibly come....
     *
     * @param {expression|object} [events] Custom events to apply to the map. This is an associative array, where keys are event names and values are handler functions.
     * @param {expression|object} [options] Custom map representing the options to be passed to marker options.  See <a href="https://developers.google.com/maps/documentation/javascript/reference#MarkerOptions" target="_blank">MarkerOptions</a>
     * @param {string|htmlString} [content=undefined] The content to be placed in the marker.  Will be parsed at the current point in the scope. (required if icon not specified)
     * @param {string|url} [icon=undefined] The image to be used as an icon (required if content not specified)
     *
     * @priority 100
     */
angular.module('angular-maps')

    .directive('marker', [ function() {

        return {
            restrict: 'E',
            require: '^map',
            priority: 100,
            link: function(scope, element, attrs, controller) {

                var options = {
                    position: new google.maps.LatLng(40.80, -74.13),
                    draggable: true,
                    flat: true,
                    anchor: RichMarkerPosition.MIDDLE,
                    content: 'test'
                };

                controller.addMarker(options);

                scope.$on('$destroy', function() {
                    controller.removeMarker(options);
                });
            }
        };

    }]);
