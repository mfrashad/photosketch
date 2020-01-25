import Matter from "matter-js";
import Constants from "../constants/Constants";

let onTouch = false;
let lastTouch = null;

const Physics = (entities, { touches, time }) => {
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

    // if(touch != null && touch.type === 'start'){
        // if(t.event.pageX > Constants.MAX_WIDTH/2){
        //     Matter.Body.setVelocity( player, {x: 6, y: 0});
        // } else {
        //     Matter.Body.setVelocity( player, {x: -6, y: 0});
        // }
    // }

    Matter.Engine.update(engine, time.delta);

    return entities;
};

export default Physics;