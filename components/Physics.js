import Matter from "matter-js";
import Constants from "../constants/Constants";

const Physics = (entities, { touches, time }) => {
    let engine = entities.physics.engine;
    let bird = entities.bird.body;

    touches.filter(t => t.type === "press").forEach(t => {
        if(t.event.pageX > Constants.MAX_WIDTH/2){
            Matter.Body.applyForce( bird, bird.position, {x: 0.01, y: -0.02});
        } else {
            Matter.Body.applyForce( bird, bird.position, {x: -0.01, y: -0.02});
        }
    });

    Matter.Engine.update(engine, time.delta);

    return entities;
};

export default Physics;