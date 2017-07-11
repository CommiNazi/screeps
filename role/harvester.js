var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity && creep.memory.busy === false) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0])
            }
        }
        else {
          creep.memory.busy = true
            var targetCreep = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
              filter: (c) => {
                return c.memory.role == 'carrier' && c.memory.carryTarget == creep.id
              }
            })
            if(!targetCreep) {
              var targetStructure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                      filter: (structure) => {
                          return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                              structure.energy < structure.energyCapacity;
                      }
              })
              var target = targetStructure
            } else {
              var target = creep.pos.getRangeTo(targetCreep) > creep.pos.getRangeTo(targetStructure) ? targetStructure : targetCreep
            }
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }
            }
            if(creep.carry.energy === 0)
                creep.memory.busy = false
        }
	}
};

module.exports = roleHarvester
