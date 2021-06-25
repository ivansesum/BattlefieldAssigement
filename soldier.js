var config = require('./config')
const _log = console.log;

const army = [];

function Soldier(name) {
    this.name = name;
    this.health = 100;
    
    this.getDamage = () => {
       
        var rndNumber = Math.floor(Math.random() * 101);
    
        if (this.getCriticalChance() >= rndNumber) 
        {
            _log('\x1b[33m%s\x1b[0m', `${this.name} got lucky with a crit!`);
            return this.health / 100 * config.criticalDamageMultiplier;
        } 
        else
            return this.health / 100;
    };

    this.getCriticalChance = () => 
    {
        return 10 - this.health / 10
    };

    this.getRechargeTime = () => 
    {
        return 1000 * this.health / 100
    };
    
}

Soldier.prototype.goToBattle = function() {
    this.timeOut = setTimeout(() => {
        this.attack(this.getDamage());
    }, this.getRechargeTime());
}

Soldier.prototype.wonBattle = function()  
{   
    clearTimeout(this.timeOut);
    _log('\x1b[32m%s\x1b[0m', `${this.name}  Won the Battle`);
}

Soldier.prototype.ResetTimeOut = function() 
{   
    clearInterval(this.timeOut);

    this.timeOut = setTimeout(() => {
        this.attack(this.getDamage());
    }, this.getRechargeTime());
}

Soldier.prototype.attack = function(dmg) {
    var numOfLivingSoldiers = army.filter(function (e) {
        return e.health > 0;
    }).length;

    if (numOfLivingSoldiers == 1) {
        this.wonBattle();
        return;
    }

    var enemySoldiers = army.filter(function (e) {
        return e.name != this.name && e.health > 0
    });
   
    var randomEnemyIndex = Math.floor(Math.random() * enemySoldiers.length);
    var enemy = enemySoldiers[randomEnemyIndex];
    
    _log( `${this.name} (${this.health.toFixed(3)}) attacked ${enemy.name} (${enemy.health.toFixed(3)}) for ${dmg.toFixed(3)} damage`);
   
     if ((enemy.health -= dmg) <= 0)
     {   
        clearTimeout(enemySoldiers[randomEnemyIndex].timeOut);
        _log('\x1b[31m%s\x1b[0m', `${enemy.name} died`);
     }

    this.ResetTimeOut();
};

function InitBattle()
{
    army.forEach(soldier => {
        soldier.goToBattle();
    });
}

function InitArmy()
{
    let soldiersNum = Math.floor(Math.random() * (6 - 2) + 2);

    for (let i = 1; i < soldiersNum + 1; i++)
    {
        army.push(new Soldier('soldier ' + i))
    }
}

InitArmy();
InitBattle();
