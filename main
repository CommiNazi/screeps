var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

Creep.prototype.distanceTo = function(x, y) {
  var a = this.pos.x - x
  var b = this.pos.y - y
  return Math.sqrt( a*a + b*b )
}

Creep.prototype.routeCreep = function (dest) {
  if(this.fatigue > 0) {
    return -1;
  }
  if(typeof dest == "undefined") {
    return -1;
  }

  var locStr = this.room.name + "." + this.pos.x + "." + this.pos.y

  var path = false;

  if(typeof Memory.routeCache !== "object") {
    Memory.routeCache = {};
  }

  if(typeof Memory.routeCache[locStr] === "undefined") {

    Memory.routeCache[locStr] = { 'dests': {}, 'established': Game.time }


  }
  if(typeof Memory.routeCache[locStr]['dests']['' + dest.id] === "undefined") {
    Memory.routeCache[locStr]['dests'][dest.id] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
    path = this.room.findPath(this.pos, dest.pos, { maxOps: 500, heuristicWeight: 2 })
    if(typeof path[0] !== "undefined") {


      Memory.routeCache[locStr]['dests']['' + dest.id][path[0].direction] += 1;

      for(var i = 0; i < path.length - 1; i++) {
        var step = path[i];
        var stepStr = this.room.name + "." + step.x + "." + step.y //creep.room.name+"."+step.x+"."+step.y
        if(typeof Memory.routeCache[stepStr] === "undefined") {
          Memory.routeCache[stepStr] = { 'dests': {}, 'established': Game.time, 'usefreq': 0.0 };
        }
        if(typeof Memory.routeCache[stepStr]['dests']['' + dest.id] === "undefined") {
          Memory.routeCache[stepStr]['dests']['' + dest.id] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
        }
        //console.log(path[i+1].direction);
        Memory.routeCache[stepStr]['dests']['' + dest.id][path[i + 1].direction] += 1;

      }
    } else {

      dir = Math.floor(Math.random() * 8);


      var error = this.move(dir);
      return error;

    }
  }

  for(var k in Memory.routeCache[locStr]['dests']) {
    if(Game.getObjectById(k) == null) { //clean out invalid routes
      delete Memory.routeCache[locStr]['dests'][k];
      //console.log("Pruned",k)
    }
  }


  var total = 0.0 //pick from the weighted list of steps
  for(var d in Memory.routeCache[locStr]['dests']['' + dest.id]) {
    total += Memory.routeCache[locStr]['dests']['' + dest.id][d];
  }
  var total = total * Math.random();

  var dir = 0;
  for(var d in Memory.routeCache[locStr]['dests']['' + dest.id]) {
    total -= Memory.routeCache[locStr]['dests']['' + dest.id][d];
    if(total < 0) {
      dir = d;
      break;
    }

  }

  if(this.pos.getRangeTo(dest) > 1 && pathisBlocked(this.pos, dir)) { //you will need your own "pathisBlocked" function!
    dir = Math.floor(Math.random() * 8);
  }


  var error = this.move(dir);
  return error;

}

function pathisBlocked(pos, dir) {
    return false;
}

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

    if(builders.length < 4) {
        var newName = Game.spawns['CommiSpawn'].createCreep([WORK,CARRY,MOVE,MOVE], undefined, {role: 'builder'});
        console.log('Spawning new Builder: ' + newName);
    } else if(upgraders.length < 4) {
        var newName = Game.spawns['CommiSpawn'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
        console.log('Spawning new Upgrader: ' + newName);
    } else if(harvesters.length < 10) {
        var newName = Game.spawns['CommiSpawn'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
        console.log('Spawning new harvester: ' + newName);
    }

    console.log('Builders: ' + builders.length, 'Upgraders: ' + upgraders.length, 'Harvesters: ' + harvesters.length);

    if(Game.spawns['CommiSpawn'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['CommiSpawn'].spawning.name];
        Game.spawns['CommiSpawn'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['CommiSpawn'].pos.x + 1,
            Game.spawns['CommiSpawn'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
