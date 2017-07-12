/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('helpers');
 * mod.thing == 'a thing'; // true
 */

var distance = function(x1, y1, x2, y2) {
  var a = x1 - x2
  var b = y1 - y2
  return Math.sqrt( a*a + b*b )
}

var garbageCollect = function() {
  for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
          delete Memory.creeps[name];
          console.log('Funeral held for:', name);
      }
  }
}

module.exports.distance = distance
module.exports.garbageCollect = garbageCollect
