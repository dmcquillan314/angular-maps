angular.module('angular-maps')

/**
 * @ngdoc directive
 * @name maps.directive:map
 *
 * @element ANY
 *
 * @description
 * A directive for embedding google maps into an app
 *
 * @param {expression} [center] Expression to evaluate as an object representing the map center. May be in the form of an object containing latitude and longitude properties.
 * @param {string|boolean} [pan=false] This attribute is a flag indicate how the map's centering should behave. This tells the map to use map.panTo instead of map.setCenter. (Animate to center via pan or not.)
 *
 * Note: Evaluated on the attribute only.  This is not watched on the scope
 *
 * @param {object} [control=undefined] If this attribute is passed it will bind a few methods to the passed object
 *
 * <dl>
 *     <dt>getMap()</dt>
 *     <dd>returns a direct reference to the map of the directive</dd>
 * </dl>
 *
 * More to possibly come....
 *
 * @param {expression|number} [zoom] expression to evaluate as the maps zoom level (1-20)
 *
 * @param {string|boolean} [draggable=true] marks the map as draggable
 * @param {expression|object} [options={}] options to pass to the initialization of the map to be copied to the initial set of map options
 * @param {expression|object} [events={}] Custom events to apply to the map. This is an associative array, where keys are event names and values are handler functions.
 *
 * The handler function takes three parameters:
 * <dl>
 *      <dt>map</dt>
 *      <dd>the GoogleMap object</dd>
 *      <dt>eventName</dt>
 *      <dd>the name of the event</dd>
 *      <dt>arguments</dt>
 *      <dd>the arguments provided by Google Maps for this event type. See the <a href="https://developers.google.com/maps/documentation/javascript/reference#Map" target="_blank">Google Map Event docs</a></dd>
 * </dl>
 */
    .directive('map', [ '$parse', function($parse) {
        return {
            restrict: 'AE',
            transclude: true,
            priority: 100,
            template: '<div class="angular-google-map"><div class="angular-google-map-container"></div><div ng-transclude style="display: none"></div></div>',
            replace: true,
            controller: 'MapController'
        };
    }]);
