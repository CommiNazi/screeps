var roleHarvester = {
    spawn: function (spawnId) {
      let bodyParts = [];
      let spawn = Game.getObjectById(spawnId)
      let energy = spawn.room.energyAvailable
      if (energy >= 950) {
          bodyParts = [WORK, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, MOVE];
      } else if (energy >= 800) {
          bodyParts = [WORK, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, MOVE];
      } else if (energy >= 600) {
          bodyParts = [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE];
      } else if (energy >= 550) {
          bodyParts = [WORK, WORK, WORK, CARRY, CARRY, MOVE];
      } else if (energy >= 450) {
          bodyParts = [WORK, WORK, WORK, CARRY, CARRY, MOVE];
      } else if (energy >= 350) {
          bodyParts = [WORK, WORK, CARRY, CARRY, MOVE];
      } else if (energy >= 200) {
        bodyParts = [WORK, CARRY, MOVE]
      }

      if (bodyParts.length < 1) {
          console.log('Can\'t Spawn Harvester. Energy too low.', energy);
      } else {
          var newName = Game.spawns['CommiSpawn'].createCreep(bodyParts, undefined, { role: 'harvester' });
          console.log('Spawning new harvester: ' + newName, JSON.stringify(bodyParts));
      }
    },
    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.carry.energy < creep.carryCapacity && creep.memory.busy === false) {
            var target = creep.pos.findClosestByRange(FIND_SOURCES)

            if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            creep.memory.busy = true;
            var targetCreep = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: c => {
                    return c.memory.role == 'carrier' && c.memory.pickupFrom == creep.id;
                }
            });
            if (!targetCreep) {
                var targetStructure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: structure => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                    }
                });
                var target = targetStructure;
            } else {
                var target = creep.pos.getRangeTo(targetCreep) > creep.pos.getRangeTo(targetStructure) ? targetStructure : targetCreep;
            }
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            if (creep.carry.energy === 0) creep.memory.busy = false;
        }
    }
};

module.exports = roleHarvester;
