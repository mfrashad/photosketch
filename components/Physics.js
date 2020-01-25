import Matter from "matter-js";
import Constants from "../constants/Constants";

const Physics = (entities, { touches, time }) => {
    let engine = entities.physics.engine;
    let player = entities.player.body;

    touches.filter(t => t.type === "press").forEach(t => {
        if(t.event.pageX > Constants.MAX_WIDTH/2){
            Matter.Body.applyForce( player, player.position, {x: 0.2, y: -0.3});
        } else {
            Matter.Body.applyForce( player, player.position, {x: -0.2, y: -0.3});
        }
    });

    Matter.Engine.update(engine, time.delta);

    return entities;
};

export default Physics;