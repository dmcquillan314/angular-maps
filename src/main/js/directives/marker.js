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
     *
     * The function definitions should have the following arguments:
     * <dl>
     *      <dt>marker</dt>
     *      <dd>the Marker object</dd>
     *      <dt>eventName</dt>
     *      <dd>the name of the event</dd>
     *      <dt>arguments</dt>
     *      <dd>the arguments provided by Google Maps for this event type. See the <a href="https://developers.google.com/maps/documentation/javascript/reference#Map" target="_blank">Google Map Event docs</a></dd>
     * </dl>
     *
     * @param {expression|object} [options] Custom map representing the options to be passed to marker options.  See <a href="https://developers.google.com/maps/documentation/javascript/reference#MarkerOptions" target="_blank">MarkerOptions</a>
     * @param {string|htmlString} [content=undefined] The content to be placed in the marker.  Will be parsed at the current point in the scope. (required if icon not specified)
     * @param {string|url} [icon=undefined] The image to be used as an icon (required if content not specified)
     *
     * @priority 100
     */
angular.module('angular-maps')

    .directive('marker', [ '$parse', function($parse) {

        return {
            restrict: 'E',
            require: '^map',
            priority: 100,
            link: function(scope, element, attrs, controller) {

                var _defaults = {
                    clickable: true,
                    crossOnDrag: true,
                    draggable: false,
                    opacity: 1.0,
                    visible: true
                };

                var _events = $parse(attrs.events)(scope),
                    _options = $parse(attrs.options)(scope),
                    _position = $parse(attrs.position)(scope),
                    _content = attrs.content ? $parse(attrs.content)(scope) : null,
                    _control = attrs.control ? $parse(attrs.control)(scope) : {},
                    _markerObject = null;

                var unbindEvents = function() {
                    google.maps.event.clearInstanceListeners(_markerObject);
                };

                var updateEvents = function() {
                    angular.forEach(_events, function(handlerFn, eventName) {
                        google.maps.event.addListener(eventName, function(event) {
                            handlerFn(_markerObject, eventName, event);
                        });
                    });
                };

                angular.extend(_options, _defaults);

                _options.position = new google.maps.LatLng(_position.latitude, _position.longitude);
                _options.content = _content;

                _markerObject = controller.addMarker(_options);

                _control.getMarker = function() {
                    return _markerObject;
                };

                scope.$on('$destroy', function() {
                    controller.removeMarker(_options);
                });

                scope.$watch( attrs.events, function(events) {
                    unbindEvents();
                    _events = events;
                    updateEvents();
                });

                scope.$watch( attrs.position, function(position) {
                    controller.removeMarker(_options);
                    _options.position = new google.maps.LatLng(position.latitude, position.longitude);
                    _markerObject = controller.addMarker(_options);
                });

                scope.$watch( attrs.content, function(content) {
                    controller.removeMarker(_options);
                    _options.content = content;
                    _markerObject = controller.addMarker(_options);
                });
            }
        };

    }]);
