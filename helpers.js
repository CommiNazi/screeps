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
module.exports.distance = distance
