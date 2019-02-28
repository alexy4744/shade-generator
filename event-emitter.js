function EventEmitter() {
  this._events = {};

  this.emit = function(name) {
    const restArgs = Array.prototype.slice.call(arguments);
  };

  this.on = function(name, callback) {
    this._events[name] ? this._events[name].push(callback) : this._events[name] = [callback];
    return this;
  };

  this.off = function(name) {

  };
}