var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

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

    if(builders.length < 3) {
        var newName = Game.spawns['CommiSpawn'].createCreep([WORK,CARRY,MOVE,MOVE], undefined, {role: 'builder'});
        console.log('Spawning new Builder: ' + newName);
    } else if(upgraders.length < 5) {
      let bodyParts = [];
      if        ( Game.spawns['CommiSpawn'].room.energyAvailable >= 950 ) {
          bodyParts = [ WORK, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, MOVE ];
      } else if ( Game.spawns['CommiSpawn'].room.energyAvailable >= 800 ) {
          bodyParts = [ WORK, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, MOVE ];
      } else if ( Game.spawns['CommiSpawn'].room.energyAvailable >= 600 ) {
          bodyParts = [ WORK, WORK, WORK, WORK, WORK, CARRY, MOVE ];
      } else if ( Game.spawns['CommiSpawn'].room.energyAvailable >= 550 ) {
          bodyParts = [ WORK, WORK, WORK, WORK, CARRY, MOVE ]
      } else if ( Game.spawns['CommiSpawn'].room.energyAvailable >= 450 ) {
          bodyParts = [ WORK, WORK, WORK, CARRY, MOVE ];
      } else if ( Game.spawns['CommiSpawn'].room.energyAvailable >= 350 ) {
          bodyParts = [ WORK, WORK, CARRY, MOVE ]
      } else if ( Game.spawns['CommiSpawn'].room.energyAvailable >= 200 ) {
          bodyParts = [ WORK, CARRY, MOVE ]
      }

      if(bodyParts.length < 1) {
        console.log('Can\'t Spawn Upgrader. Energy too low.', Game.spawns['CommiSpawn'].room.energyAvailable)
      } else {
        var newName = Game.spawns['CommiSpawn'].createCreep(bodyParts, undefined, {role: 'upgrader'});
        console.log('Spawning new Upgrader: ' + newName, JSON.stringify(bodyParts));
      }

    } else if(harvesters.length < 10) {
        let bodyParts = [];
        if        ( Game.spawns['CommiSpawn'].room.energyAvailable >= 950 ) {
            bodyParts = [ WORK, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, MOVE ];
        } else if ( Game.spawns['CommiSpawn'].room.energyAvailable >= 800 ) {
            bodyParts = [ WORK, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, MOVE ];
        } else if ( Game.spawns['CommiSpawn'].room.energyAvailable >= 600 ) {
            bodyParts = [ WORK, WORK, WORK, WORK, WORK, CARRY, MOVE ];
        } else if ( Game.spawns['CommiSpawn'].room.energyAvailable >= 550 ) {
            bodyParts = [ WORK, WORK, WORK, WORK, CARRY, MOVE ]
        } else if ( Game.spawns['CommiSpawn'].room.energyAvailable >= 450 ) {
            bodyParts = [ WORK, WORK, WORK, CARRY, MOVE ];
        } else if ( Game.spawns['CommiSpawn'].room.energyAvailable >= 350 ) {
            bodyParts = [ WORK, WORK, CARRY, MOVE ]
        } else if ( Game.spawns['CommiSpawn'].room.energyAvailable >= 200 ) {
            bodyParts = [ WORK, CARRY, MOVE ]
        }

        if(bodyParts.length < 1) {
          console.log('Can\'t Spawn Harvester. Energy too low.', Game.spawns['CommiSpawn'].room.energyAvailable)
        } else {
          var newName = Game.spawns['CommiSpawn'].createCreep(bodyParts, undefined, {role: 'harvester'});
          console.log('Spawning new harvester: ' + newName, JSON.stringify(bodyParts));
        }

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
