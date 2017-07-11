var controllerRoom =  {
 /** @param {Creep} creep **/
    run: function (creep) {
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.carry.energy < creep.carryCapacity && !creep.memory.isBuilding) {
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
      }
      else {
        creep.memory.isBuilding = true;
        const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        if(target) {
            if(creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
        if(creep.carry.energy === 0)
            creep.memory.isBuilding = false;
      }
    }
}

module.exports = controllerRoom
