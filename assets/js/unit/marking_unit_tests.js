'use strict';

var expect = chai.expect;
describe('Marking Unit Tests', function() {

  describe("GraphModel", function() {

    var graphModel;


    beforeEach(function() {
      graphModel = new GraphModel();
    });


    afterEach(function() {
      graphModel = undefined;
    });

    it('should return a list of non-empty available graph names.', function() {
      var graphNames = graphModel.getAvailableGraphNames();

      expect(graphNames[0], 'graphNames[0] should be a string').to.be.a('string');
      expect(graphNames.length, 'graphNames should not be empty').to.be.above(0);
    });


    it('should add and then remove a listener correctly.', function() {
      var listener_fn = sinon.spy();
      var addListenerSpy = sinon.spy(graphModel, "addListener");
      var removeListenerSpy = sinon.spy(graphModel, "removeListener");


      // Adds a listener
      graphModel.addListener(listener_fn);

      expect(addListenerSpy.calledWith(listener_fn), 'addListener should have been called with listener_fn.').to.be.true;
      expect(addListenerSpy.calledOnce, 'addListener should have been called once.').to.be.true;
      expect(graphModel.listeners.length, 'listeners.length should be one.').to.be.equal(1);

      // Removes a listener
      graphModel.removeListener(listener_fn);

      expect(removeListenerSpy.calledWith(listener_fn), 'removeListener should have been called with listener_fn.').to.be.true;
      expect(removeListenerSpy.calledOnce, 'removeListener should have been called once.').to.be.true;
      expect(graphModel.listeners.length, 'listeners.length should be zero.').to.be.equal(0);

      graphModel.removeListener(listener_fn);
      expect(graphModel.listeners.length, 'listeners.length should still be zero.').to.be.equal(0);
    });

    it('should select a graph which is set to currently selected graph', function() {
      var selectGraphSpy = sinon.spy(graphModel, 'selectGraph');
      var graphNames = graphModel.getAvailableGraphNames();

      var graphToSelect = graphNames[0];
      expect(graphModel.getNameOfCurrentlySelectedGraph() !== graphToSelect || graphNames.length > 1, "Need to be able to choose a graph to test listeners.").to.be.true;
      if (graphToSelect === graphModel.getNameOfCurrentlySelectedGraph()) {
        graphToSelect = graphNames[1];
      }
      graphModel.selectGraph(graphToSelect);
      var currentGraphName = graphModel.getNameOfCurrentlySelectedGraph();

      expect(selectGraphSpy.calledOnce,
        'selectGraph should have been called once.').to.be.true;
      expect(selectGraphSpy.calledWith(graphToSelect),
        'selectGraph should have been called with graphToSelect.').to.be.true;
      expect(currentGraphName,
        'current graph name should be equal to what has been selected.').to.eql(graphToSelect);
    });

    it('should notify every listener when the current graph changed.', function() {
      var listener_fn_1 = sinon.spy();
      var listener_fn_2 = sinon.spy();
      graphModel.addListener(listener_fn_1);
      graphModel.addListener(listener_fn_2);
      var graphNames = graphModel.getAvailableGraphNames();

      var graphToSelect = graphNames[0];
      expect(graphModel.getNameOfCurrentlySelectedGraph() !== graphToSelect || graphNames.length > 1, "Need to be able to choose a graph to test listeners.").to.be.true;
      if (graphToSelect === graphModel.getNameOfCurrentlySelectedGraph()) {
        graphToSelect = graphNames[1];
      }

      graphModel.selectGraph(graphToSelect);

      expect(listener_fn_1.calledWith, GRAPH_SELECTED_EVENT, graphNames[1]);
      expect(listener_fn_2.calledWith, GRAPH_SELECTED_EVENT, graphNames[1]);
    });


    it('should not notify any listener when the current graph did not change.', function() {
      var listener_fn = sinon.spy();
      graphModel.addListener(listener_fn);
      var graphNames = graphModel.getAvailableGraphNames();

      var graphToSelect = graphNames[0];
      expect(graphModel.getNameOfCurrentlySelectedGraph() !== graphToSelect || graphNames.length > 1, "Need to be able to choose a graph to test listeners.").to.be.true;
      if (graphToSelect === graphModel.getNameOfCurrentlySelectedGraph()) {
        graphToSelect = graphNames[1];
      }

      graphModel.selectGraph(graphToSelect);
      graphModel.selectGraph(graphToSelect);

      expect(listener_fn.callCount).to.be.below(2);
    });
  });
});

describe('Student Unit Tests', function() {
    it('Some tests', function() {
        /*
         We're using Mocha and Chai to do unit testing.

         Mocha is what sets up the tests (the "describe" and "it" portions), while
         Chai does the assertion/expectation checking.

         Links:
         Mocha: http://mochajs.org
         Chai: http://chaijs.com

         Note: This is a bunch of tests in one it; you'll probably want to separate them
         out into separate groups to make debugging easier. It's also more satisfying
         to see a bunch of unit tests pass on the results page :)
        */

        // Here is the most basic test you could think of:
        expect(1==1, '1==1').to.be.ok;

        // You can also for equality:
        expect(1, '1 should equal 1').to.equal(1);

        // JavaScript can be tricky with equality tests
        expect(1=='1', "1 should == '1'").to.be.true;

        // Make sure you understand the differences between == and ===
        expect(1==='1', "1 shouldn't === '1'").to.be.false;

        // Use eql for deep comparisons
        expect([1] == [1], "[1] == [1] should be false because they are different objects").to.be.false;

        expect([1], "[1] eqls [1] should be true").to.eql([1]);
    });

    it('Callback demo unit test', function() {
        /*
        Suppose you have a function or object that accepts a callback function,
        which should be called at some point in time (like, for example, a model
        that will notify listeners when an event occurs). Here's how you can test
        whether the callback is ever called.
         */

        // First, we'll create a function that takes a callback, which the function will
        // later call with a single argument. In tests below, we'll use models that
        // take listeners that will be later called
        var functionThatTakesCallback = function(callbackFn) {
            return function(arg) {
                callbackFn(arg);
            };
        };

        // Now we want to test if the function will ever call the callbackFn when called.
        // To do so, we'll use Sinon's spy capability (http://sinonjs.org/)
        var spyCallbackFn = sinon.spy();

        // Now we'll create the function with the callback
        var instantiatedFn = functionThatTakesCallback(spyCallbackFn);

        // This instantiated function should take a single argument and call the callbackFn with it:
        instantiatedFn("foo");

        // Now we can check that it was called:
        expect(spyCallbackFn.called, 'Callback function should be called').to.be.ok;

        // We can check the number of times called:
        expect(spyCallbackFn.callCount, 'Number of times called').to.equal(1);

        // And we can check that it got its argument correctly:
        expect(spyCallbackFn.calledWith('foo'), 'Argument verification').to.be.true;

        // Or, equivalently, get the first argument of the first call:
        expect(spyCallbackFn.args[0][0], 'Argument verification 2').to.equal('foo');
    });
});
