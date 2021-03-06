import React, { Component } from "react";
import { View } from "react-native";
import Matter from "matter-js";
import Constants from '../constants/Constants';

const COLLISION_CATEGORY = Constants.COLLISION_CATEGORY;

export class Renderer extends Component {
    render() {
        const width = this.props.size.width;
        const height = this.props.size.height;
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y - height / 2;

        return (
            <View
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: width,
                    height: height,
                    backgroundColor: this.props.color
                }} />
    );
  }
}

export default (world, x, y , width, height) => {
  let body = Matter.Bodies.rectangle(x, y, width, height, {
    label: "wall",
    isStatic: true,
    density: 1,
    friction: 1,
    frictionStatic: 5,
    restitution: 0,
    collisionFilter: {
      category: COLLISION_CATEGORY.WALL,
      mask: COLLISION_CATEGORY.PLAYER
    }
  });
  Matter.World.add(world, [body]);
  return {
    id: `wall${x}${y}`,
    body,
    size: { width, height },
    color: '#2980b9',
    renderer: <Renderer />
  };
}