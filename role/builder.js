var roleBuilder = {
    spawn: function (spawnId) {
      let spawn = Game.getObjectById(spawnId)
      let energy = spawn.room.energyAvailable
      let bodyParts = [];
      if (energy>= 1050) {
          bodyParts = [CARRY, MOVE, CARRY, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];
      } else if (energy >= 850) {
          bodyParts = [CARRY, MOVE, CARRY, MOVE, WORK, WORK, WORK, WORK, WORK, WORK];
      } else if (energy >= 650) {
          bodyParts = [CARRY, MOVE, CARRY, MOVE, WORK, WORK, WORK, WORK];
      } else if (energy >= 450) {
          bodyParts = [CARRY, MOVE, CARRY, WORK, WORK, WORK];
      } else if (energy >= 300) {
          bodyParts = [MOVE, WORK, WORK, CARRY];
      } else if (energy >= 200) {
          bodyParts = [MOVE, CARRY, WORK];
      }

      if (bodyParts.length < 1) {
          console.log('Can\'t Spawn Builder. Energy too low.', energy);
      } else {
          var newName = spawn.createCreep(bodyParts, undefined, { role: 'builder' });
          console.log('Spawning new Builder: ' + newName, JSON.stringify(bodyParts));
      }
    },
    /** @param {Creep} creep **/
    run: function (creep) {
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.carry.energy < creep.carryCapacity && !creep.memory.isBuilding) {
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        } else {
            creep.memory.isBuilding = true;
            var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if (target) {
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                console.log('Builder target was invalid')
            }
            if (creep.carry.energy === 0) creep.memory.isBuilding = false;
        }
    }
}

module.exports = roleBuilder;
