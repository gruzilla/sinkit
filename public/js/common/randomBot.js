var useAction = function(team,action) {
    switch (action) {
        case 1:
            completeScreen.game().updateBoat(team,{shield: 1});
            break;
        case 2:
            completeScreen.game().updateBoat(team,{velocity: -25 * Math.random()*4});
            break;
        case 3:
            completeScreen.game().updateBoat(team,{velocity: 25 * Math.random()*4});
            break;
        case 4:
            completeScreen.game().updateBoat(team,{fullstop: 1});
            break;
        case 5:
            completeScreen.game().updateBoat(team,{shoot: 1});
            break;
        default:
            break;
    }
};
var i = 200;  
var randomAction = function(){
    useAction("top",Math.ceil(Math.random()*5));
    useAction("bottom",Math.ceil(Math.random()*5));
    i--;  
    
    if(completeScreen.game().isRunning() && i > 0){
        setTimeout(randomAction,500);
    }
};
randomAction();