/**
 * AngularGM - Google Maps Directives for AngularJS
 * @version v1.0.0 - 2015-01-14
 * @link https://github.com/dmcquillan314/angular-maps
 * @author Dan McQuillan <dmcquillan314@gmail.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
angular.module('angular-maps', []);

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
                    _modelFn = attrs.model ? $parse(attrs.model) : undefined,
                    _markerObject = null;

                var unbindEvents = function() {
                    google.maps.event.clearInstanceListeners(_markerObject);
                };

                var updateEvents = function() {
                    angular.forEach(_events, function(handlerFn, eventName) {
                        google.maps.event.addListener(_markerObject, eventName, function(event) {

                            if(_modelFn) {
                                _markerObject.model = _modelFn(scope) || undefined;
                            }

                            handlerFn(_markerObject, eventName, event);
                        });
                    });
                };

                angular.extend(_options, _defaults);

                _options.position = new google.maps.LatLng(_position.latitude, _position.longitude);
                _options.content = _content;

                _markerObject = controller.addMarker(_options, true);
                updateEvents();

                _control.getMarker = function() {
                    return _markerObject;
                };

                scope.$on('$destroy', function() {
                    controller.removeMarker(_options, true);
                });

                scope.$watch( attrs.events, function(events) {
                    unbindEvents();
                    _events = events;
                    updateEvents();
                });

                scope.$watch( attrs.position, function(position) {
                    unbindEvents();
                    controller.removeMarker(_options, true);
                    _options.position = new google.maps.LatLng(position.latitude, position.longitude);
                    _markerObject = controller.addMarker(_options, true);
                    updateEvents();
                });

                scope.$watch( attrs.content, function(content) {
                    unbindEvents();
                    controller.removeMarker(_options, false);
                    _options.content = content;
                    _markerObject = controller.addMarker(_options, false);
                    updateEvents();
                });
            }
        };

    }]);

angular.module('angular-maps')

    .factory('DefaultMarkerFactory', [ function() {
        var factory = {};

        factory.createMarker = function(options) {
            return new google.maps.Marker(options);
        };

        return factory;
    }])

    .factory('RichMarkerFactory', [ '$window', function($window) {
        var factory = {};

        var initDependency = function() {
            /**
             * @license
             * Copyright 2013 Google Inc. All Rights Reserved.
             *
             * Licensed under the Apache License, Version 2.0 (the "License");
             * you may not use this file except in compliance with the License.
             * You may obtain a copy of the License at
             *
             *     http://www.apache.org/licenses/LICENSE-2.0
             *
             * Unless required by applicable law or agreed to in writing, software
             * distributed under the License is distributed on an "AS IS" BASIS,
             * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
             * See the License for the specific language governing permissions and
             * limitations under the License.
             */

            /**
             * A RichMarker that allows any HTML/DOM to be added to a map and be draggable.
             *
             * @param {Object.<string, *>=} opt_options Optional properties to set.
             * @extends {google.maps.OverlayView}
             * @constructor
             */
            function RichMarker(opt_options) {
                var options = opt_options || {};

                /**
                 * @type {boolean}
                 * @private
                 */
                this.ready_ = false;

                /**
                 * @type {boolean}
                 * @private
                 */
                this.dragging_ = false;

                if (opt_options['visible'] === undefined) {
                    opt_options['visible'] = true;
                }

                if (opt_options['shadow'] === undefined) {
                    opt_options['shadow'] = '7px -3px 5px rgba(88,88,88,0.7)';
                }

                if (opt_options['anchor'] === undefined) {
                    opt_options['anchor'] = RichMarkerPosition['BOTTOM'];
                }

                this.setValues(options);
            }
            RichMarker.prototype = new google.maps.OverlayView();
            window['RichMarker'] = RichMarker;


            /**
             * Returns the current visibility state of the marker.
             *
             * @return {boolean} The visiblity of the marker.
             */
            RichMarker.prototype.getVisible = function() {
                return /** @type {boolean} */ (this.get('visible'));
            };
            RichMarker.prototype['getVisible'] = RichMarker.prototype.getVisible;


            /**
             * Sets the visiblility state of the marker.
             *
             * @param {boolean} visible The visiblilty of the marker.
             */
            RichMarker.prototype.setVisible = function(visible) {
                this.set('visible', visible);
            };
            RichMarker.prototype['setVisible'] = RichMarker.prototype.setVisible;


            /**
             *  The visible changed event.
             */
            RichMarker.prototype.visible_changed = function() {
                if (this.ready_) {
                    this.markerWrapper_.style['display'] = this.getVisible() ? '' : 'none';
                    this.draw();
                }
            };
            RichMarker.prototype['visible_changed'] = RichMarker.prototype.visible_changed;


            /**
             * Sets the marker to be flat.
             *
             * @param {boolean} flat If the marker is to be flat or not.
             */
            RichMarker.prototype.setFlat = function(flat) {
                this.set('flat', !!flat);
            };
            RichMarker.prototype['setFlat'] = RichMarker.prototype.setFlat;


            /**
             * If the makrer is flat or not.
             *
             * @return {boolean} True the marker is flat.
             */
            RichMarker.prototype.getFlat = function() {
                return /** @type {boolean} */ (this.get('flat'));
            };
            RichMarker.prototype['getFlat'] = RichMarker.prototype.getFlat;


            /**
             * Get the width of the marker.
             *
             * @return {Number} The width of the marker.
             */
            RichMarker.prototype.getWidth = function() {
                return /** @type {Number} */ (this.get('width'));
            };
            RichMarker.prototype['getWidth'] = RichMarker.prototype.getWidth;


            /**
             * Get the height of the marker.
             *
             * @return {Number} The height of the marker.
             */
            RichMarker.prototype.getHeight = function() {
                return /** @type {Number} */ (this.get('height'));
            };
            RichMarker.prototype['getHeight'] = RichMarker.prototype.getHeight;


            /**
             * Sets the marker's box shadow.
             *
             * @param {string} shadow The box shadow to set.
             */
            RichMarker.prototype.setShadow = function(shadow) {
                this.set('shadow', shadow);
                this.flat_changed();
            };
            RichMarker.prototype['setShadow'] = RichMarker.prototype.setShadow;


            /**
             * Gets the marker's box shadow.
             *
             * @return {string} The box shadow.
             */
            RichMarker.prototype.getShadow = function() {
                return /** @type {string} */ (this.get('shadow'));
            };
            RichMarker.prototype['getShadow'] = RichMarker.prototype.getShadow;


            /**
             * Flat changed event.
             */
            RichMarker.prototype.flat_changed = function() {
                if (!this.ready_) {
                    return;
                }

                this.markerWrapper_.style['boxShadow'] =
                    this.markerWrapper_.style['webkitBoxShadow'] =
                        this.markerWrapper_.style['MozBoxShadow'] =
                            this.getFlat() ? '' : this.getShadow();
            };
            RichMarker.prototype['flat_changed'] = RichMarker.prototype.flat_changed;


            /**
             * Sets the zIndex of the marker.
             *
             * @param {Number} index The index to set.
             */
            RichMarker.prototype.setZIndex = function(index) {
                this.set('zIndex', index);
            };
            RichMarker.prototype['setZIndex'] = RichMarker.prototype.setZIndex;


            /**
             * Gets the zIndex of the marker.
             *
             * @return {Number} The zIndex of the marker.
             */
            RichMarker.prototype.getZIndex = function() {
                return /** @type {Number} */ (this.get('zIndex'));
            };
            RichMarker.prototype['getZIndex'] = RichMarker.prototype.getZIndex;


            /**
             * zIndex changed event.
             */
            RichMarker.prototype.zIndex_changed = function() {
                if (this.getZIndex() && this.ready_) {
                    this.markerWrapper_.style.zIndex = this.getZIndex();
                }
            };
            RichMarker.prototype['zIndex_changed'] = RichMarker.prototype.zIndex_changed;

            /**
             * Whether the marker is draggable or not.
             *
             * @return {boolean} True if the marker is draggable.
             */
            RichMarker.prototype.getDraggable = function() {
                return /** @type {boolean} */ (this.get('draggable'));
            };
            RichMarker.prototype['getDraggable'] = RichMarker.prototype.getDraggable;


            /**
             * Sets the marker to be draggable or not.
             *
             * @param {boolean} draggable If the marker is draggable or not.
             */
            RichMarker.prototype.setDraggable = function(draggable) {
                this.set('draggable', !!draggable);
            };
            RichMarker.prototype['setDraggable'] = RichMarker.prototype.setDraggable;


            /**
             * Draggable property changed callback.
             */
            RichMarker.prototype.draggable_changed = function() {
                if (this.ready_) {
                    if (this.getDraggable()) {
                        this.addDragging_(this.markerWrapper_);
                    } else {
                        this.removeDragListeners_();
                    }
                }
            };
            RichMarker.prototype['draggable_changed'] =
                RichMarker.prototype.draggable_changed;


            /**
             * Gets the postiton of the marker.
             *
             * @return {google.maps.LatLng} The position of the marker.
             */
            RichMarker.prototype.getPosition = function() {
                return /** @type {google.maps.LatLng} */ (this.get('position'));
            };
            RichMarker.prototype['getPosition'] = RichMarker.prototype.getPosition;


            /**
             * Sets the position of the marker.
             *
             * @param {google.maps.LatLng} position The position to set.
             */
            RichMarker.prototype.setPosition = function(position) {
                this.set('position', position);
            };
            RichMarker.prototype['setPosition'] = RichMarker.prototype.setPosition;


            /**
             * Position changed event.
             */
            RichMarker.prototype.position_changed = function() {
                this.draw();
            };
            RichMarker.prototype['position_changed'] =
                RichMarker.prototype.position_changed;


            /**
             * Gets the anchor.
             *
             * @return {google.maps.Size} The position of the anchor.
             */
            RichMarker.prototype.getAnchor = function() {
                return /** @type {google.maps.Size} */ (this.get('anchor'));
            };
            RichMarker.prototype['getAnchor'] = RichMarker.prototype.getAnchor;


            /**
             * Sets the anchor.
             *
             * @param {RichMarkerPosition|google.maps.Size} anchor The anchor to set.
             */
            RichMarker.prototype.setAnchor = function(anchor) {
                this.set('anchor', anchor);
            };
            RichMarker.prototype['setAnchor'] = RichMarker.prototype.setAnchor;


            /**
             * Anchor changed event.
             */
            RichMarker.prototype.anchor_changed = function() {
                this.draw();
            };
            RichMarker.prototype['anchor_changed'] = RichMarker.prototype.anchor_changed;


            /**
             * Converts a HTML string to a document fragment.
             *
             * @param {string} htmlString The HTML string to convert.
             * @return {Node} A HTML document fragment.
             * @private
             */
            RichMarker.prototype.htmlToDocumentFragment_ = function(htmlString) {
                var tempDiv = document.createElement('DIV');
                tempDiv.innerHTML = htmlString;
                if (tempDiv.childNodes.length === 1) {
                    return /** @type {!Node} */ (tempDiv.removeChild(tempDiv.firstChild));
                } else {
                    var fragment = document.createDocumentFragment();
                    while (tempDiv.firstChild) {
                        fragment.appendChild(tempDiv.firstChild);
                    }
                    return fragment;
                }
            };


            /**
             * Removes all children from the node.
             *
             * @param {Node} node The node to remove all children from.
             * @private
             */
            RichMarker.prototype.removeChildren_ = function(node) {
                if (!node) {
                    return;
                }

                var child;
                while (child = node.firstChild) {
                    node.removeChild(child);
                }
            };


            /**
             * Sets the content of the marker.
             *
             * @param {string|Node} content The content to set.
             */
            RichMarker.prototype.setContent = function(content) {
                this.set('content', content);
            };
            RichMarker.prototype['setContent'] = RichMarker.prototype.setContent;


            /**
             * Get the content of the marker.
             *
             * @return {string|Node} The marker content.
             */
            RichMarker.prototype.getContent = function() {
                return /** @type {Node|string} */ (this.get('content'));
            };
            RichMarker.prototype['getContent'] = RichMarker.prototype.getContent;


            /**
             * Sets the marker content and adds loading events to images
             */
            RichMarker.prototype.content_changed = function() {
                if (!this.markerContent_) {
                    // Marker content area doesnt exist.
                    return;
                }

                this.removeChildren_(this.markerContent_);
                var content = this.getContent();
                if (content) {
                    if (typeof content === 'string') {
                        content = content.replace(/^\s*([\S\s]*)\b\s*$/, '$1');
                        content = this.htmlToDocumentFragment_(content);
                    }
                    this.markerContent_.appendChild(content);

                    var that = this;
                    var images = this.markerContent_.getElementsByTagName('IMG');

                    var makeMouseDownListener = function() {
                        'use strict';

                        return function(e) {
                            if (that.getDraggable()) {
                                if (e !== null && e.preventDefault) {
                                    e.preventDefault();
                                }
                                e.returnValue = false;
                            }
                        };
                    };

                    var makeLoadListener = function() {
                        'use strict';

                        return function() {
                            that.draw();
                        };
                    };

                    for (var i = 0, image; image = images[i]; i++) {
                        // By default, a browser lets a image be dragged outside of the browser,
                        // so by calling preventDefault we stop this behaviour and allow the image
                        // to be dragged around the map and now out of the browser and onto the
                        // desktop.
                        google.maps.event.addDomListener(image, 'mousedown', makeMouseDownListener());

                        // Because we don't know the size of an image till it loads, add a
                        // listener to the image load so the marker can resize and reposition
                        // itself to be the correct height.
                        google.maps.event.addDomListener(image, 'load', makeLoadListener());
                    }

                    google.maps.event.trigger(this, 'domready');
                }

                if (this.ready_) {
                    this.draw();
                }
            };
            RichMarker.prototype['content_changed'] = RichMarker.prototype.content_changed;

            /**
             * Sets the cursor.
             *
             * @param {string} whichCursor What cursor to show.
             * @private
             */
            RichMarker.prototype.setCursor_ = function(whichCursor) {
                if (!this.ready_) {
                    return;
                }

                var cursor = '';
                if (navigator.userAgent.indexOf('Gecko/') !== -1) {
                    // Moz has some nice cursors :)
                    if (whichCursor === 'dragging') {
                        cursor = '-moz-grabbing';
                    }

                    if (whichCursor === 'dragready') {
                        cursor = '-moz-grab';
                    }

                    if (whichCursor === 'draggable') {
                        cursor = 'pointer';
                    }
                } else {
                    if (whichCursor === 'dragging' || whichCursor === 'dragready') {
                        cursor = 'move';
                    }

                    if (whichCursor === 'draggable') {
                        cursor = 'pointer';
                    }
                }

                if (this.markerWrapper_.style.cursor !== cursor) {
                    this.markerWrapper_.style.cursor = cursor;
                }
            };

            /**
             * Start dragging.
             *
             * @param {Event} e The event.
             */
            RichMarker.prototype.startDrag = function(e) {
                if (!this.getDraggable()) {
                    return;
                }

                if (!this.dragging_) {
                    this.dragging_ = true;
                    var map = this.getMap();
                    this.mapDraggable_ = map.get('draggable');
                    map.set('draggable', false);

                    // Store the current mouse position
                    this.mouseX_ = e.clientX;
                    this.mouseY_ = e.clientY;

                    this.setCursor_('dragready');

                    // Stop the text from being selectable while being dragged
                    this.markerWrapper_.style['MozUserSelect'] = 'none';
                    this.markerWrapper_.style['KhtmlUserSelect'] = 'none';
                    this.markerWrapper_.style['WebkitUserSelect'] = 'none';

                    this.markerWrapper_['unselectable'] = 'on';
                    this.markerWrapper_['onselectstart'] = function() {
                        return false;
                    };

                    this.addDraggingListeners_();

                    google.maps.event.trigger(this, 'dragstart');
                }
            };


            /**
             * Stop dragging.
             */
            RichMarker.prototype.stopDrag = function() {
                if (!this.getDraggable()) {
                    return;
                }

                if (this.dragging_) {
                    this.dragging_ = false;
                    this.getMap().set('draggable', this.mapDraggable_);
                    this.mouseX_ = this.mouseY_ = this.mapDraggable_ = null;

                    // Allow the text to be selectable again
                    this.markerWrapper_.style['MozUserSelect'] = '';
                    this.markerWrapper_.style['KhtmlUserSelect'] = '';
                    this.markerWrapper_.style['WebkitUserSelect'] = '';
                    this.markerWrapper_['unselectable'] = 'off';
                    this.markerWrapper_['onselectstart'] = function() {};

                    this.removeDraggingListeners_();

                    this.setCursor_('draggable');
                    google.maps.event.trigger(this, 'dragend');

                    this.draw();
                }
            };


            /**
             * Handles the drag event.
             *
             * @param {Event} e The event.
             */
            RichMarker.prototype.drag = function(e) {
                if (!this.getDraggable() || !this.dragging_) {
                    // This object isn't draggable or we have stopped dragging
                    this.stopDrag();
                    return;
                }

                var dx = this.mouseX_ - e.clientX;
                var dy = this.mouseY_ - e.clientY;

                this.mouseX_ = e.clientX;
                this.mouseY_ = e.clientY;

                var left = parseInt(this.markerWrapper_.style['left'], 10) - dx;
                var top = parseInt(this.markerWrapper_.style['top'], 10) - dy;

                this.markerWrapper_.style['left'] = left + 'px';
                this.markerWrapper_.style['top'] = top + 'px';

                var offset = this.getOffset_();

                // Set the position property and adjust for the anchor offset
                var point = new google.maps.Point(left - offset.width, top - offset.height);
                var projection = this.getProjection();
                this.setPosition(projection.fromDivPixelToLatLng(point));

                this.setCursor_('dragging');
                google.maps.event.trigger(this, 'drag');
            };


            /**
             * Removes the drag listeners associated with the marker.
             *
             * @private
             */
            RichMarker.prototype.removeDragListeners_ = function() {
                if (this.draggableListener_) {
                    google.maps.event.removeListener(this.draggableListener_);
                    delete this.draggableListener_;
                }
                this.setCursor_('');
            };


            /**
             * Add dragability events to the marker.
             *
             * @param {Node} node The node to apply dragging to.
             * @private
             */
            RichMarker.prototype.addDragging_ = function(node) {
                if (!node) {
                    return;
                }

                var that = this;
                this.draggableListener_ =
                    google.maps.event.addDomListener(node, 'mousedown', function(e) {
                        that.startDrag(e);
                    });

                this.setCursor_('draggable');
            };


            /**
             * Add dragging listeners.
             *
             * @private
             */
            RichMarker.prototype.addDraggingListeners_ = function() {
                var that = this;
                if (this.markerWrapper_.setCapture) {
                    this.markerWrapper_.setCapture(true);
                    this.draggingListeners_ = [
                        google.maps.event.addDomListener(this.markerWrapper_, 'mousemove', function(e) {
                            that.drag(e);
                        }, true),
                        google.maps.event.addDomListener(this.markerWrapper_, 'mouseup', function() {
                            that.stopDrag();
                            that.markerWrapper_.releaseCapture();
                        }, true)
                    ];
                } else {
                    this.draggingListeners_ = [
                        google.maps.event.addDomListener(window, 'mousemove', function(e) {
                            that.drag(e);
                        }, true),
                        google.maps.event.addDomListener(window, 'mouseup', function() {
                            that.stopDrag();
                        }, true)
                    ];
                }
            };


            /**
             * Remove dragging listeners.
             *
             * @private
             */
            RichMarker.prototype.removeDraggingListeners_ = function() {
                if (this.draggingListeners_) {
                    for (var i = 0, listener; listener = this.draggingListeners_[i]; i++) {
                        google.maps.event.removeListener(listener);
                    }
                    this.draggingListeners_.length = 0;
                }
            };


            /**
             * Get the anchor offset.
             *
             * @return {google.maps.Size} The size offset.
             * @private
             */
            RichMarker.prototype.getOffset_ = function() {
                var anchor = this.getAnchor();
                if (typeof anchor === 'object') {
                    return /** @type {google.maps.Size} */ (anchor);
                }

                var offset = new google.maps.Size(0, 0);
                if (!this.markerContent_) {
                    return offset;
                }

                var width = this.markerContent_.offsetWidth;
                var height = this.markerContent_.offsetHeight;

                switch (anchor) {
                    case RichMarkerPosition['TOP_LEFT']:
                        break;
                    case RichMarkerPosition['TOP']:
                        offset.width = -width / 2;
                        break;
                    case RichMarkerPosition['TOP_RIGHT']:
                        offset.width = -width;
                        break;
                    case RichMarkerPosition['LEFT']:
                        offset.height = -height / 2;
                        break;
                    case RichMarkerPosition['MIDDLE']:
                        offset.width = -width / 2;
                        offset.height = -height / 2;
                        break;
                    case RichMarkerPosition['RIGHT']:
                        offset.width = -width;
                        offset.height = -height / 2;
                        break;
                    case RichMarkerPosition['BOTTOM_LEFT']:
                        offset.height = -height;
                        break;
                    case RichMarkerPosition['BOTTOM']:
                        offset.width = -width / 2;
                        offset.height = -height;
                        break;
                    case RichMarkerPosition['BOTTOM_RIGHT']:
                        offset.width = -width;
                        offset.height = -height;
                        break;
                }

                return offset;
            };


            /**
             * Adding the marker to a map.
             * Implementing the interface.
             */
            RichMarker.prototype.onAdd = function() {
                if (!this.markerWrapper_) {
                    this.markerWrapper_ = document.createElement('DIV');
                    this.markerWrapper_.style['position'] = 'absolute';
                }

                if (this.getZIndex()) {
                    this.markerWrapper_.style['zIndex'] = this.getZIndex();
                }

                this.markerWrapper_.style['display'] = this.getVisible() ? '' : 'none';

                if (!this.markerContent_) {
                    this.markerContent_ = document.createElement('DIV');
                    this.markerWrapper_.appendChild(this.markerContent_);

                    var that = this;
                    google.maps.event.addDomListener(this.markerContent_, 'click', function(e) {
                        google.maps.event.trigger(that, 'click');
                    });
                    google.maps.event.addDomListener(this.markerContent_, 'mouseover', function(e) {
                        google.maps.event.trigger(that, 'mouseover');
                    });
                    google.maps.event.addDomListener(this.markerContent_, 'mouseout', function(e) {
                        google.maps.event.trigger(that, 'mouseout');
                    });
                }

                this.ready_ = true;
                this.content_changed();
                this.flat_changed();
                this.draggable_changed();

                var panes = this.getPanes();
                if (panes) {
                    panes.overlayMouseTarget.appendChild(this.markerWrapper_);
                }

                google.maps.event.trigger(this, 'ready');
            };
            RichMarker.prototype['onAdd'] = RichMarker.prototype.onAdd;


            /**
             * Impelementing the interface.
             */
            RichMarker.prototype.draw = function() {
                if (!this.ready_ || this.dragging_) {
                    return;
                }

                var projection = this.getProjection();

                if (!projection) {
                    // The map projection is not ready yet so do nothing
                    return;
                }

                var latLng = /** @type {google.maps.LatLng} */ (this.get('position'));
                var pos = projection.fromLatLngToDivPixel(latLng);

                var offset = this.getOffset_();
                this.markerWrapper_.style['top'] = (pos.y + offset.height) + 'px';
                this.markerWrapper_.style['left'] = (pos.x + offset.width) + 'px';

                var height = this.markerContent_.offsetHeight;
                var width = this.markerContent_.offsetWidth;

                if (width !== this.get('width')) {
                    this.set('width', width);
                }

                if (height !== this.get('height')) {
                    this.set('height', height);
                }
            };
            RichMarker.prototype['draw'] = RichMarker.prototype.draw;


            /**
             * Removing a marker from the map.
             * Implementing the interface.
             */
            RichMarker.prototype.onRemove = function() {
                if (this.markerWrapper_ && this.markerWrapper_.parentNode) {
                    this.markerWrapper_.parentNode.removeChild(this.markerWrapper_);
                }
                this.removeDragListeners_();
            };
            RichMarker.prototype['onRemove'] = RichMarker.prototype.onRemove;


            /**
             * RichMarker Anchor positions
             * @enum {number}
             */
            var RichMarkerPosition = {
                'TOP_LEFT': 1,
                'TOP': 2,
                'TOP_RIGHT': 3,
                'LEFT': 4,
                'MIDDLE': 5,
                'RIGHT': 6,
                'BOTTOM_LEFT': 7,
                'BOTTOM': 8,
                'BOTTOM_RIGHT': 9
            };
            window['RichMarkerPosition'] = RichMarkerPosition;
        };

        factory.createMarker = function(options) {

            if(!$window.google) {
                throw new Error("MarkerFactory.createMarker: google is not defined.");
            }

            if($window.RichMarker) {
                return new window.RichMarker(options);
            }

            initDependency();

            return factory.createMarker(options);
        };

        return factory;
    }])

    .factory('MarkerFactory', [ 'DefaultMarkerFactory', 'RichMarkerFactory', function(DefaultMarkerFactory, RichMarkerFactory) {

        var factory = {};

        factory.createMarker = function(options) {
            if(angular.isDefined(options.content) && options.content !== null) {
                return RichMarkerFactory.createMarker(options);
            }

            return DefaultMarkerFactory.createMarker(options);
        };

        return factory;

    }]);

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

                for(var i = 0; i < _markers.length; i++) {
                    var marker = _markers[i];
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

        controller.addMarker = function(marker, redraw) {
            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });

            marker._id = guid;
            marker.map = _map;

            var markerObject = MarkerFactory.createMarker(marker);
            _markers.push(markerObject);

            if(redraw) {
                _draw();
            }

            return markerObject;
        };

        controller.removeMarker = function(marker, redraw) {

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

            if(redraw) {
                _draw();
            }
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
