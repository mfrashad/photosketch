import Matter from "matter-js";
import Constants from "../constants/Constants";

let onTouch = false;
let lastTouch = null;

const Physics = (entities, { touches, time, events }) => {
    let engine = entities.physics.engine;
    let player = entities.player.body;
    let t = touches[0];
    if(t !== undefined){
        if(t.type === "start"){
            onTouch = true;
        }
        else if( t.type === "end"){
            onTouch = false;
        }
        lastTouch = t;
    }
    if(onTouch){
        t = lastTouch
        if(t.event.pageX > Constants.MAX_WIDTH/2){
            Matter.Body.setVelocity( player, {x: 2, y: player.velocity.y});
        } else {
            Matter.Body.setVelocity( player, {x: -2, y: player.velocity.y});
        }
    }

    if (events.length){
        for(let i=0; i<events.length; i++){
            if (events[i].type === "jump" && player.velocity.y >= -0.01 && player.velocity.y <= 0.01){
                Matter.Body.setVelocity(player, {x: player.velocity.x, y: -10});
                console.log('Jump');
            }
            else if (events[i].type === "game-over"){
                onTouch = false;
            }
        }
    }

    Matter.Engine.update(engine, time.delta);

    return entities;
};

export default Physics;