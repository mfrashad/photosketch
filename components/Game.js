import React, { Component } from 'react';
import { StyleSheet, View, StatusBar} from 'react-native';
import Matter from "matter-js";
import { GameEngine } from "react-native-game-engine";
import Player from './Player';
import Enemy from './Enemy';
import Constants from '../constants/Constants';
import Physics from './Physics';
import Wall from './Wall';


export default class Game extends Component {
    constructor(props){
        super(props);

        this.state = {
            running: true
        };

        this.gameEngine = null;

        this.entities = this.setupWorld();
    }

    setupWorld = () => {
      let engine = Matter.Engine.create({ enableSleeping: false });
      let world = engine.world;

      let player = Player( world, Constants.MAX_WIDTH / 4, Constants.MAX_HEIGHT / 2);
      let enemy = Enemy(world, Constants.MAX_WIDTH / 4 * 3, Constants.MAX_HEIGHT - 75, 40, 40)
      let floor = Wall(world, Constants.MAX_WIDTH / 2, Constants.MAX_HEIGHT - 25, Constants.MAX_WIDTH, 50);
      let ceiling = Wall(world, Constants.MAX_WIDTH / 2, 25, Constants.MAX_WIDTH, 50);
      let lWall = Wall(world, 25, Constants.MAX_HEIGHT/2, 50, Constants.MAX_HEIGHT - 100);
      let rWall = Wall(world, Constants.MAX_WIDTH - 25, Constants.MAX_HEIGHT/2, 50, Constants.MAX_HEIGHT - 100);

      Matter.Events.on(engine, 'collisionStart', (event) => {
          let pairs = event.pairs;
          let pair = pairs[0];
          console.log(pair.bodyA.label, pair.bodyB.label);
          if(pair.bodyA.label === "player" && pair.bodyB.label === "enemy"){
            console.log("Game Over");
            this.gameEngine.dispatch({ type: "game-over"});
          }
      });

      return {
          physics: { engine: engine, world: world },
          player,
          enemy,
          floor,
          ceiling,
          lWall,
          rWall,
      }
  }

  onEvent = (e) => {
    if (e.type === "game-over"){
      //Alert.alert("Game Over");
      this.setState({
          running: false
      });
      this.reset();
    }
  }

  reset = () => {
    this.gameEngine.swap(this.setupWorld());
    this.setState({
      running: true
    });
  }


    render() {
        return (
            <View style={styles.container}>
                <GameEngine
                    ref={(ref) => { this.gameEngine = ref; }}
                    style={styles.gameContainer}
                    running={this.state.running}
                    onEvent={this.onEvent}
                    systems={[Physics]}
                    entities={this.entities}>
                    <StatusBar hidden={true} />
                </GameEngine>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    gameContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
});