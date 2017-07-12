var roleUpgrader = {
    spawn: function(spawnId) {
      let bodyParts = []
      let spawn = Game.getObjectById(spawnId)
      let energy = spawn.room.energyAvailable
      if (energy >= 950) {
          bodyParts = [WORK, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, MOVE];
      } else if (energy >= 800) {
          bodyParts = [WORK, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, MOVE];
      } else if (energy >= 600) {
          bodyParts = [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE];
      } else if (energy >= 550) {
          bodyParts = [WORK, WORK, WORK, WORK, CARRY, MOVE];
      } else if (energy >= 450) {
          bodyParts = [WORK, WORK, WORK, CARRY, MOVE];
      } else if (energy >= 350) {
          bodyParts = [WORK, WORK, CARRY, MOVE];
      } else if (energy >= 200) {
          bodyParts = [WORK, CARRY, MOVE];
      }

      if (bodyParts.length < 1) {
          console.log('Can\'t Spawn Upgrader. Energy too low.', energy);
      } else {
          var newName = Game.spawns['CommiSpawn'].createCreep(bodyParts, undefined, { role: 'upgrader' });
          console.log('Spawning new Upgrader: ' + newName, JSON.stringify(bodyParts));
      }
    },
    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        } else {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
};

module.exports = roleUpgrader
