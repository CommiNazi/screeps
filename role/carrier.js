var roleCarrier = {
    spawn: function(spawnId) {
      let spawn = Game.getObjectById(spawnId)
      let energy = spawn.room.energyAvailable
      let bodyParts = [];
      if (energy>= 950) {
          bodyParts = [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
      } else if (energy >= 800) {
          bodyParts = [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
      } else if (energy >= 600) {
          bodyParts = [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, CARRY];
      } else if (energy >= 550) {
          bodyParts = [CARRY, MOVE, CARRY, MOVE, CARRY, CARRY];
      } else if (energy >= 450) {
          bodyParts = [MOVE, CARRY, MOVE, CARRY];
      } else if (energy >= 200) {
          bodyParts = [MOVE, CARRY, CARRY];
      }

      if (bodyParts.length < 1) {
          console.log('Can\'t Spawn Carrier. Energy too low.', energy);
      } else {
          var newName = spawn.createCreep(bodyParts, undefined, { role: 'carrier' });
          console.log('Spawning new Carrier: ' + newName, JSON.stringify(bodyParts));
      }
    },
    run: function (creep) {
      if(creep.spawning) return
      if(creep.carry.energy == 0) creep.memory.giveTo = ''
      if(creep.memory.pickupFrom == '' && creep.memory.giveTo == '') {
        if(creep.carry.energy > 0) {
          creep.memory.giveTo = getGiveToTarget(creep)
        } else {
          creep.memory.pickup = getPickupTarget(creep)
        }
      }
      if(creep.memory.pickupFrom != '') {
        let target = Game.getObjectById(creep.memory.pickupFrom)
        if(!target) {
          creep.memory.pickupFrom = ''
          target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: c => {
              return (c.memory.role == 'builder' || c.memory.role == 'upgrader') && c.carryCapacity > c.carry.energy
            }
          })
          if(target) {
            creep.memory.giveTo = target.id
            creep.memory.target = target.name + ", " + target.memory.role
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(target)
            }
          } else {
            console.log('Carrier', creep.name, 'No Target Builder')
          }

        } else if (target.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
            creep.memory.target = target.name
        } else {
          creep.memory.pickupFrom = ''
        }
      } else if(creep.memory.giveTo != '') {
        let target = Game.getObjectById(creep.memory.giveTo)
        if(!target) {
          creep.memory.giveTo = ''
          target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: c => {
              return (c.memory.role == 'builder' || c.memory.role == 'upgrader') && c.carryCapacity > c.carry.energy
            }
          })
          if(target) {
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(target)
            }
          } else {
            console.log('Carrier', creep.name, 'No Target Builder')
          }
        } else if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        } else {
          creep.memory.pickupFrom = ''
        }
      } else {
        if (creep.carry.energy == 0) {
            target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
              filter: c => {
                return c.memory.role == 'harvester' && c.carry.energy > 0
              }
            })
            if(target) {
              creep.memory.target = target.name + ", " + target.memory.role
              creep.memory.pickupFrom = target.id
              creep.moveTo(target);
            } else {
              console.log('Carrier', creep.name, 'No Target Harvester')
            }
        } else {
          target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
              filter: structure => {
                  return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
              }
          })
          if(!target) {
            target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
              filter: c => {
                return (c.memory.role == 'builder' || c.memory.role == 'upgrader') && c.carryCapacity < c.carry.energy
              }
            })
          }

          if (target) {
            console.log('Carrier with no listed target is now targeting', JSON.stringify(target.name), 'to drop off', creep.carry.energy)
            creep.memory.giveTo = target.id
            creep.memory.target = target.name
              if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(target);
              }
          } else {
            target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
              filter: c => {
                return c.memory.role == 'harvester' && c.carry.energy < c.carryCapacity/2
              }
            })
            if(target) {
              creep.memory.target = target.name + ", " + target.memory.role
              creep.memory.pickupFrom = target.id
              creep.moveTo(target);
            } else {
              console.log('Carrier', creep.name, 'Could not find a target')
            }
          }
        }
      }
    }
}

module.exports = roleCarrier;


function getPickupTarget(creep) {
  var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
    filter: c => {
      return c.memory.role == 'harvester' && c.carry.energy > 0
    }
  })
  if(target) {
    creep.memory.target = target.name + ", " + target.memory.role
    return target.id
  } else {
    console.log('Carrier', creep.name, 'No Target Harvester')
    return ''
  }
}

function getGiveToTarget(creep) {

  var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
    filter: c => {
      return (c.memory.role == 'builder' || c.memory.role == 'upgrader') && c.carryCapacity > c.carry.energy
    }
  })
  if(!target) {
    target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
      filter: structure => {
          return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
      }
    })
    if(!target) {
      console.log('Carrier', creep.name, 'No Target for Drop-off')
      return ''
    }
  } else {
    return target.id
  }
}
