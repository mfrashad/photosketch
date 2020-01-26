import Matter from "matter-js";
import Constants from "../constants/Constants";

const Physics = (entities, { touches, time, events }) => {
    let engine = entities.physics.engine;
    let player = entities.player.body;
    let allowJump = player.velocity.y >= -0.05 && player.velocity.y <= 0.05;

    if(!engine.onTouch) engine.onTouch = [];
    if(!engine.lastTouch) engine.lastTouch = [];

    touches.forEach((t, i) => {
        
        if(t !== undefined){
            if(t.type === "start"){
                engine.onTouch[i] = true;
            }
            else if( t.type === "end"){
                engine.onTouch[i] = false;
            }
            engine.lastTouch[i] = t;
        }
        
    })

    engine.onTouch.forEach((t, i) => {
        if(engine.onTouch[i]){
            if(engine.lastTouch[i].event.pageY > Constants.MAX_HEIGHT - (Constants.JUMP_BUTTON_BOTTOM + Constants.JUMP_BUTTON_RADIUS)){
                if(allowJump) events.push({ type: "jump" });
            } else if(engine.lastTouch[i].event.pageX > Constants.MAX_WIDTH/2){
                Matter.Body.setVelocity( player, {x: 2.5, y: player.velocity.y});
            } else {
                Matter.Body.setVelocity( player, {x: -2.5, y: player.velocity.y});
            }
        }
    })

    if (events.length){
        for(let i=0; i<events.length; i++){
            if (events[i].type === "jump" && allowJump){
                Matter.Body.setVelocity(player, {x: player.velocity.x, y: -10});
                console.log('Jump');
            }
            else if (events[i].type === "game-over"){
                console.log("Reset everything")
                engine.onTouch = false;
                engine.lastTouch = null;
            }
        }
    }

    Matter.Engine.update(engine, time.delta);

    return entities;
};

export default Physics;