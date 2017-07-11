var roleBuilder =  {
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
        var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        if(target) {
            if(creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
          target = Game.spawns.CommiSpawn
          creep.moveTo(target)
        }
        if(creep.carry.energy === 0)
            creep.memory.isBuilding = false;
      }
    }
}

module.exports = roleBuilder
