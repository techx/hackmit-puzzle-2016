/* Creates grid
 * @author Claire
 * @version 1.0
 * @date 2016/07/10
 * @edit 2016/07/13
 */

var Grid = (function() {
  'use strict';

  var exports = {};
  var mappings = {};

  // config, helper functions, etc here

  // states enum
  exports.EMPTY = 0;
  exports.FULL = 1;
  exports.AGENT = 2;

  // mapping from states to CSS classes
  mappings[exports.FULL] = "fullClass";
  mappings[exports.EMPTY] = "emptyClass";
  mappings[exports.AGENT] = "agentClass";

  function isValid(x, y, m, n){
    var ok = false;
    x = parseInt(x);
    y = parseInt(y);
    m = parseInt(m);
    n = parseInt(n);

    if(x < m && x >= 0 && y < n && y >= 0){
      ok = true;
    }
    return ok;
  }

  // meat and potatoes
  function GridObject(n, m, start, end) {
    this.cols = m;
    this.rows = n;
    this.start = start;
    this.end = end;

    // set agent location
    this.agentloc = [0, 0];
    if (
      start.length == 2 &&
      !isNaN(parseInt(start[0])) && !isNaN(parseInt(start[1])) &&
      isValid(start[0], start[1], this.cols, this.rows)
    ) {
      this.agentloc = this.start;
    } else {
      // throw '3rd argument is agent\'s location in 2D [x, y]';
    }

    this.grid = new Array(this.cols);
    for (var i = 0; i < this.cols; i++){
      this.grid[i] = new Array(this.rows);
      for(var j = 0; j < this.rows; j++){
        this.grid[i][j] = exports.EMPTY;
      }
    }

    this.render();
  }

  GridObject.prototype.getState = function(x, y) {
    if(isValid(x, y, this.cols, this.rows)){
      return this.grid[x][y]; //0, 1, etc.
    }
    else{
      return {err: "not ok state"};
    }
  }

  GridObject.prototype.setState = function(x, y, state) {
    if (isValid(x, y, this.cols, this.rows) && this.getState(x, y) != state) {
      this.grid[x][y] = state;
    } else {
      return {err: "not ok state"};
    }
  };

  GridObject.prototype.render = function() {
    var content = document.getElementById("grid");
    content.innerHTML = ''; // empty
    content.classList.add("width-" + this.cols);
    content.classList.add("height-" + this.rows);
    for(var i = 0; i < this.cols; i++){
      var rowDiv = document.createElement('div');
      rowDiv.className = 'row';
      content.appendChild(rowDiv);
      for(var j = 0; j < this.rows; j++){
        var eltDiv = document.createElement('div');
        var classState = this.grid[i][j];
        classState = mappings[classState];
        if (this.agentloc !== false) {
          if (i === this.agentloc[0] && j === this.agentloc[1]) {
            classState += ' ' + mappings[exports.AGENT];
          }
        }

        if (i === this.start[0] && j === this.start[1]) {
          classState += ' start-state';
        } else if (i === this.end[0] && j === this.end[1]) {
          classState += ' end-state';
        }

        eltDiv.className = 'elt ' + classState;
        eltDiv.id = 'elt-' + i + "-" + j;
        rowDiv.appendChild(eltDiv);
      }
    }
    
    var elts = document.getElementsByClassName("elt");
    var width = 100/this.rows + "%";
    for(var k = 0; k < elts.length; k++){
      var styles = elts[k].style;
      styles.width = width;
      styles.paddingBottom = width;
    }
  }

  GridObject.prototype.clear = function(x, y) {
    if (x === undefined || y === undefined) {
      this.clearAll();
    }
      else{
      this.setState(x, y, exports.EMPTY);
    }
  }

  GridObject.prototype.clearAll = function(){
    for (var i = 0; i < this.cols; i++){
      this.grid[i] = new Array(this.rows);
      for(var j = 0; j < this.rows; j++){
        this.grid[i][j] = exports.EMPTY;
      }
    }
  }

  GridObject.prototype.getAgentLoc = function() {
    return this.agentloc;
  };

  GridObject.prototype.setAgentLoc = function(loc) {
    if (loc === false) {
      return this.agentloc = false;
    }

    if (
      loc.length == 2 &&
      !isNaN(parseInt(loc[0])) && !isNaN(parseInt(loc[1])) &&
      isValid(loc[0], loc[1], this.cols, this.rows)
    ) {
      this.agentloc = loc;
    }
  };

  GridObject.prototype.fromFrame = function(frame) {
    for(var i = 0; i < this.cols; i++) {
      for(var j = 0; j < this.rows; j++) {
        this.setState(i, j, frame[i][j]);
      }
    }
  };

  exports.Grid = GridObject;

  return exports;
})();
