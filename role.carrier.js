var roleCarrier =  {

    run: function (creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            so
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                //creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                creep.moveTo(sources[0])
            }
        }
    	else {
    		var targets = creep.room.find(Game.CONSTRUCTION_SITES);
    		if(targets.length) {
    			creep.moveTo(targets[0]);
    			creep.build(targets[0]);
    		}
    	}
    }
}

module.exports = roleCarrier;
