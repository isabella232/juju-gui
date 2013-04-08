'use strict';

describe('EventTracker Extension', function() {
  var event, TestClass, testInstance, Y;

  before(function(done) {
    Y = YUI(GlobalConfig).use(['event-tracker', 'event-dom'],
        function(Y) {
          event = Y.Event;
          TestClass = Y.Base.create(
              'testclass',
              Y.Base,
              [event.EventTracker]);
          done();
        });
  });

  beforeEach(function() {
    testInstance = new TestClass();
  });

  afterEach(function() {
    if (testInstance) {
      testInstance.destroy();
    }
  });

  it('exists', function() {
    assert.isFunction(event.EventTracker);
  });

  it('event tracker wires into an object properly', function() {
    testInstance._events.should.eql([]);
    assert(typeof(testInstance.evt) === 'function');
  });

  it('event tracker should handle cleanup', function() {
    var body = Y.one('body');

    // start out with no listeners.
    assert(event.getListeners(body) === null);

    // add an event to track/detach.
    var evt = body.on('click', function(ev) {
      // do nothing
    });
    testInstance.evt(evt);
    event.getListeners(body).length.should.equal(1);

    // destroying the instance should restore us back to no listeners.
    testInstance.destroy();
    assert(event.getListeners(body) === null);
  });
});
