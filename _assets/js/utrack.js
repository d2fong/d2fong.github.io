'use strict';

/*
Put any interaction code here
 */

window.addEventListener('load', function() {
  // You should wire up all of your event handling code here, as well as any
  // code that initiates calls to manipulate the DOM (as opposed to responding
  // to events)

  // Instantiate a TabView and a TabModel, then bind them together.
  var activity_model = new ActivityCollectionModel();
  var tabView = new TabView(new TabModel());
  var activityCollectionView = new ActivityCollectionView(activity_model);
  var graphView = new GraphView(new GraphModel(), activity_model);

});

