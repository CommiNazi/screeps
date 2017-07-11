var controllerRoom =  {
  //get Room Layout from cache or create new from scratch in order of priority:
  //// room controller
  //////if enemy controlled/reserved
  ////// enemy structures
  ////// enemy creeps
  ////// enemy spawns

  //// energy sources
  //// mineral sources

  //create task array based on criteria in room
  //submit task array to global tasks array
  /*function getRoomReadout(room) {
    if(room.memory.ts !== undefined || room.memory.ts < Game.time - 100000) {
      console.log('Saving Room info to memory')
      room.memory.ts = Game.time
      room.memory.id = room.name
      room.memory.sources = room.find(FIND_SOURCES).map(e=>e.id)
      room.memory.my = room.controller.my
      room.memory.paths = []
      room.memory.hostiles = room.find(FIND_HOSTILE_CREEPS).map(e=>e.id)
      room.memory.hostileStructures = room.find(FIND_HOSTILE_STRUCTURES).map(e=>e.id)
      room.memory.spawns = room.find(FIND_MY_SPAWNS).map(e=>e.id)
      room.memory.hostileSpawns = room.find(FIND_HOSTILE_SPAWNS).map(e=>e.id)
    }
  }*/

}

module.exports = controllerRoom
