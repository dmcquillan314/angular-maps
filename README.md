# angular-maps

Currently this implementation only contains an implementation for map markers for google maps api.

I implemented this after experimenting with the angular google maps directive set and needed 
something much more lightweight and decoupled from the google maps dependency.  Using this 
you can either load the google maps script on load of the page or asyncronously so long as it's loaded
before the view with the directive is compiled.

Here is an example of usage:
http://jsfiddle.net/dmcquillan314/btcw58zj/

There is documentation present in the implementation of each directive although I have not had a chance
to move this somewhere external.
