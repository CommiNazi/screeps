var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleCarrier = require('role.carrier')
var helpers = require('helpers')

module.exports.loop = function () {

  helpers.garbageCollect()

    var harvesters = _.filter(Game.creeps, creep => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, creep => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, creep => creep.memory.role == 'upgrader');
    var carriers = _.filter(Game.creeps, creep => creep.memory.role == 'carrier')
    var numConstructionSites = Game.spawns['CommiSpawn'].room.find(FIND_MY_CONSTRUCTION_SITES).length

    if (builders.length < numConstructionSites/2)  roleBuilder.spawn(Game.spawns['CommiSpawn'].id)
    else if (upgraders.length < 4)                 roleUpgrader.spawn(Game.spawns['CommiSpawn'].id)
    else if (harvesters.length < 7)                roleHarvester.spawn(Game.spawns['CommiSpawn'].id)
    else if(carriers.length < harvesters.length)   roleCarrier.spawn(Game.spawns['CommiSpawn'].id)

    console.log('Builders: ' + builders.length, 'Upgraders: ' + upgraders.length, 'Harvesters: ' + harvesters.length, 'Carriers: ' + carriers.length);

    if (Game.spawns['CommiSpawn'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['CommiSpawn'].spawning.name];
        Game.spawns['CommiSpawn'].room.visual.text('🛠️' + spawningCreep.memory.role, Game.spawns['CommiSpawn'].pos.x + 1, Game.spawns['CommiSpawn'].pos.y, { align: 'left', opacity: 0.8 });
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') roleHarvester.run(creep)
        if (creep.memory.role == 'upgrader')  roleUpgrader.run(creep)
        if (creep.memory.role == 'builder')   roleBuilder.run(creep)
        if (creep.memory.role == 'carrier')   roleCarrier.run(creep)
    }
};
