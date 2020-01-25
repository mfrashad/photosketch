import React, { Component } from "react";
import { View } from "react-native";
import Matter from "matter-js";

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
    friction: 1,
    restitution: 0,
  });
  Matter.World.add(world, [body]);
  return {
    body,
    size: { width, height },
    color: 'green',
    renderer: <Renderer />
  };
}