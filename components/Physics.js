import Matter from "matter-js";
import Constants from "../constants/Constants";

const Physics = (entities, { touches, time, events }) => {
    let engine = entities.physics.engine;
    let player = entities.player.body;
    let t = touches[0];
    if(t !== undefined){
        if(t.type === "start"){
            engine.onTouch = true;
        }
        else if( t.type === "end"){
            engine.onTouch = false;
        }
        engine.lastTouch = t;
    }
    if(engine.onTouch){
        if(engine.lastTouch.event.pageX > Constants.MAX_WIDTH/2){
            Matter.Body.setVelocity( player, {x: 2.5, y: player.velocity.y});
        } else {
            Matter.Body.setVelocity( player, {x: -2.5, y: player.velocity.y});
        }
    }

    if (events.length){
        for(let i=0; i<events.length; i++){
            if (events[i].type === "jump" && player.velocity.y >= -0.1 && player.velocity.y <= 0.1){
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