const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_PLAYER_VALUE = 20;

//MODE ATTACKS
const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';

//LOG_EVENTS_SHOW
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';



let battleLog = [];
let LastLogEntry;



function getMaxLifeValue(){

    const enteredNumber = prompt('Maximum life for you and monster.', '100');
    
    const parsedValue = parseInt(enteredNumber);
    if(isNaN(parsedValue) || parsedValue <= 0 ){
       throw { message : 'Invalid user input, not a number!'};
    }
    return parsedValue;

}

let chosenMaxLife;
try{
    chosenMaxLife = getMaxLifeValue();
} catch (error){
    console.log(error);
    // chosenMaxLife = 100;
    // alert('You enetered something wrong');

    throw console.error();
    
 
    
}



let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonesLife = true;




adjustHealthBars(chosenMaxLife);


function writeToLog(ev, val, mosterHealth, playerHealth){
    let logEntry = {
        event: ev,
        value: val,
        finalMosterHealth: mosterHealth,
        finalPlayerHealth: playerHealth

    };

    //////////Switch Statement //////////////
    ////////////////////////////////////////
    switch (ev) {
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'MONSTER'; 
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.target = 'MONSTER'; 
            break;
        case LOG_EVENT_MONSTER_ATTACK:
             logEntry.target = 'PLAYER'; 
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry.target = 'PLAYER';
            break;
            case LOG_EVENT_GAME_OVER:
            break;
            default:
                logEntry = {};

    }

    // if(ev === LOG_EVENT_PLAYER_ATTACK){
    //     logEntry.target = 'MONSTER'; 
        
    // } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK){
    //     logEntry = {
    //         event: ev,
    //         value: val,
    //         target: 'MONSTER',
    //         finalMosterHealth: mosterHealth,
    //         finalPlayerHealth: playerHealth
    //     };
        

    // } else if (ev === LOG_EVENT_MONSTER_ATTACK){
    //     logEntry = {
    //         event: ev,
    //         value: val,
    //         target: 'PLAYER',
    //         finalMosterHealth: mosterHealth,
    //         finalPlayerHealth: playerHealth
    //     };
       

    // } else if (ev === LOG_EVENT_PLAYER_HEAL){
    //     logEntry = {
    //         event: ev,
    //         value: val,
    //         target: 'PLAYER',
    //         finalMosterHealth: mosterHealth,
    //         finalPlayerHealth: playerHealth
    //     };
        

    // } else if (ev === LOG_EVENT_GAME_OVER){
    //     logEntry = {
    //         event: ev,
    //         value: val,
    //         finalMosterHealth: mosterHealth,
    //         finalPlayerHealth: playerHealth
    //     };
    // }
    battleLog.push(logEntry);

}

function reset(){
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);

}


function endRound(){
    const initalPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth);

   if(currentPlayerHealth <= 0 && hasBonesLife){
       hasBonesLife = false;
       removeBonusLife();
       currentPlayerHealth = initalPlayerHealth;
       setPlayerHealth(initalPlayerHealth);
       alert('You would be dead but the bonus life saved you!');
    //    increasePlayerHealth(HEAL_PLAYER_VALUE)
    //    currentPlayerHealth += HEAL_PLAYER_VALUE;
   }
 
 
    if(currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('You Won!');
        writeToLog( LOG_EVENT_GAME_OVER,
             'PLAYER WON',
             currentMonsterHealth, 
             currentPlayerHealth
             );

        // reset();
    } else if(currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('You Lost');
        writeToLog(
            LOG_EVENT_GAME_OVER,
             'MONSTER WON',
             currentMonsterHealth, 
             currentPlayerHealth
             );
        // reset();
    } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0){
        alert('You have Draw');
        writeToLog(
            LOG_EVENT_GAME_OVER,
             'DRAW ',
             currentMonsterHealth, 
             currentPlayerHealth
             );
        
    }


    if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0){
        reset();
    }

}

function attackMonster(mode){

    // Other alternative for conditioning *** Ternary Expression ***
    // Example 
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logEvent =
    mode === MODE_ATTACK
    ? LOG_EVENT_PLAYER_ATTACK
    : LOG_EVENT_PLAYER_STRONG_ATTACK;
    // let maxDamage;
    // let logEvent;
    // if(mode == MODE_ATTACK){
    //     maxDamage = ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_ATTACK;

    // }else if (mode == MODE_STRONG_ATTACK){
    //     maxDamage = STRONG_ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    // }
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(
        logEvent,
         damage,
         currentMonsterHealth, 
         currentPlayerHealth
         );
    endRound(); 
 
   

}
function attackHandler(){
    attackMonster(MODE_ATTACK);
  

}

function strontAttackHandler(){
   attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler(){
    let healValue;
    if(currentPlayerHealth >= chosenMaxLife - HEAL_PLAYER_VALUE){
        alert("You can't heal more than you max initial health");
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = HEAL_PLAYER_VALUE;
    }


increasePlayerHealth(healValue)
currentPlayerHealth += healValue;
writeToLog(
     LOG_EVENT_PLAYER_HEAL,
     healValue,
     currentMonsterHealth, 
     currentPlayerHealth
     );
endRound();
  
    
}

function printLogHandler(){
    
    //For Loop 
    // for(let i = 0; i < battleLog.length; i++ ){
    //     console.log(battleLog[i]); 
       

    // }
    // for(let j = 10; j > 0; j--){
    //     console.log(j);

    // }

    ///// FOR OF LOOP
    // let i = 0;
    // for (const logEntry of battleLog){
    //     console.log(logEntry);
    //     console.log(i);
    //     i++;
    // }

    /// FOR IN LOOPS and how to use a loop inside a loop
//    let i = 0;
//     for (const logEntry of battleLog){
//         console.log(`#${i}`);
//         for(const key in logEntry){
//             console.log(`${key}  ====> ${logEntry[key]}`)
//         }
//         i++;
//     }


////WHILE LOOPS 
//// While Loop RandomNumbers
// let randomNumber = [];
// let finish = false;
// while(!finish){
//     const rndowNum = Math.random();
//     randomNumber.push(rndowNum);
//     if (rndowNum > 0.5){
//         finish = true;
//         console.log(randomNumber);
//     }

// }
// let j = 0;
// while(j < 3){
//     console.log(j);
//     j++
// }

//DO WHILE LOOP
// let j = 0;

// do{
//     console.log(j);
//     j++
// }while(j < 3);

    // console.log(battleLog); 


////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
    // let i = 0;
    // for (const logEntry of battleLog){
    //     if(!LastLogEntry && LastLogEntry !==0  || LastLogEntry < i){
    //      console.log(`#${i}`);
    //      for(const key in logEntry){
    //         console.log(`${key}  ====> ${logEntry[key]}`)
    //     }
    //     LastLogEntry = i;
    //     break;
    //  }
    //     i++;
        
    // }
 ///////////////////////////////////////////////////////////////////////
 //////////////////////////////////////////////////////////////////////
 
 for (i = 0; i < 5; i++){
     if(i === 3){
         break;
     }
     console.log(i);
 }


 console.log('--------------------------------------------');

 for (j = 0; j < 5; j++){
    
    if(j === 2){
        continue;
    }
    console.log(j);
}
  

}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strontAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler)