import Matter from "matter-js";
import Constants from "../constants/Constants";

const Physics = (entities, { touches, time, events }) => {
    let engine = entities.physics.engine;
    let world = entities.physics.world;
    let player = entities.player.body;
    Matter.Sleeping.set(player, false);

    Matter.Body.setVelocity( player, {x: 0, y: player.velocity.y});
    let allowJump = player.velocity.y >= -0.05 && player.velocity.y <= 0.05;

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
        if(engine.lastTouch.event.pageY > Constants.MAX_HEIGHT - (Constants.JUMP_BUTTON_BOTTOM + Constants.JUMP_BUTTON_RADIUS) && 
            engine.lastTouch.event.pageX > Constants.MAX_WIDTH - (Constants.JUMP_BUTTON_RIGHT + Constants.JUMP_BUTTON_RADIUS)){
            if(allowJump) events.push({ type: "jump" });
        } else if(engine.lastTouch.event.pageX > Constants.MAX_WIDTH/2){
            Matter.Body.setVelocity( player, {x: 4, y: player.velocity.y});
        } else {
            Matter.Body.setVelocity( player, {x: -4, y: player.velocity.y});
        }
    }


    //Multi Touch
    // if(!engine.onTouch) engine.onTouch = [];
    // if(!engine.lastTouch) engine.lastTouch = [];

    // touches.forEach((t, i) => {
        
    //     if(t !== undefined){
    //         if(t.type === "start"){
    //             engine.onTouch[i] = true;
    //         }
    //         else if( t.type === "end"){
    //             engine.onTouch[i] = false;
    //         }
    //         engine.lastTouch[i] = t;
    //     }
        
    // })

    // engine.onTouch.forEach((t, i) => {
    //     if(engine.onTouch[i]){
    //         if(engine.lastTouch[i].event.pageY > Constants.MAX_HEIGHT - (Constants.JUMP_BUTTON_BOTTOM + Constants.JUMP_BUTTON_RADIUS) && 
    //             engine.lastTouch[i].event.pageX > Constants.MAX_WIDTH - (Constants.JUMP_BUTTON_RIGHT + Constants.JUMP_BUTTON_RADIUS)){
    //             if(allowJump) events.push({ type: "jump" });
    //         } else if(engine.lastTouch[i].event.pageX > Constants.MAX_WIDTH/2){
    //             Matter.Body.setVelocity( player, {x: 4, y: player.velocity.y});
    //         } else {
    //             Matter.Body.setVelocity( player, {x: -4, y: player.velocity.y});
    //         }
    //     }
    // })

    if (events.length){
        for(let i=0; i<events.length; i++){
            if (events[i].type === "jump" && allowJump){
                Matter.Body.setVelocity(player, {x: 0, y: -5});
                console.log('Jump', player.velocity.y);
            }
            else if (events[i].type === "get-coin"){
                console.log("Get Coin");
                const coin = events[i].coin;
                delete entities[`${coin.position.x}${coin.position.y}`];
                Matter.Composite.remove(world, coin)
                
            }
        }
    }

    Matter.Engine.update(engine, time.delta);

    return entities;
};

export default Physics;