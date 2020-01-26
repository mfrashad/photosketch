import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, Text} from 'react-native';
import Matter from "matter-js";
import { GameEngine } from "react-native-game-engine";
import Player from './Player';
import Enemy from './Enemy';
import Goal from './Goal';
import Constants from '../constants/Constants';
import Physics from './Physics';
import Wall from './Wall';
import { enumBooleanBody } from '@babel/types';


export default class Game extends Component {
    constructor(props){
        super(props);

        this.state = {
            running: true,
            winning: false,
        };

        this.gameEngine = null;

        this.entities = this.setupWorld();
    }

    setupWorld = () => {
      let engine = Matter.Engine.create({ enableSleeping: false });
      let world = engine.world;

      let player = Player( world, Constants.MAX_WIDTH / 4, Constants.MAX_HEIGHT / 2);
      let enemy = Enemy(world, Constants.MAX_WIDTH / 4 * 2, Constants.MAX_HEIGHT - 75, 40, 40)
      let goal = Goal(world, Constants.MAX_WIDTH / 4 * 3, Constants.MAX_HEIGHT - 75, 40, 40)
      let floor = Wall(world, Constants.MAX_WIDTH / 2, Constants.MAX_HEIGHT - 25, Constants.MAX_WIDTH, 50);
      let ceiling = Wall(world, Constants.MAX_WIDTH / 2, 25, Constants.MAX_WIDTH, 50);
      let lWall = Wall(world, 25, Constants.MAX_HEIGHT/2, 50, Constants.MAX_HEIGHT - 100);
      let rWall = Wall(world, Constants.MAX_WIDTH - 25, Constants.MAX_HEIGHT/2, 50, Constants.MAX_HEIGHT - 100);

      Matter.Events.on(engine, 'collisionStart', (event) => {
          let pairs = event.pairs;
          let pair = pairs[0];
          console.log(pair.bodyA.label, pair.bodyB.label);
          if(pair.bodyA.label === "player"){
            if(pair.bodyB.label === "enemy") {
              console.log("Game Over");
              this.gameEngine.dispatch({ type: "game-over"});
            } else if(pair.bodyB.label === "goal"){
              console.log("Win");
              this.gameEngine.dispatch({ type: "win"});
            }
          } 
      });

      return {
          physics: { engine: engine, world: world },
          player,
          enemy,
          goal,
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
    } else if (e.type === "win"){
      this.setState({
        running: false,
        win: true,
      });
    }
  }

  reset = () => {
    this.gameEngine.swap(this.setupWorld());
    this.setState({
      running: true,
      win: false
    });
  }

  pauseHandler = () => {
    console.log("Paused")
    this.setState(prevState => ({
      running: !prevState.running
    }))
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
        {!this.state.running && 
          <View style={styles.fullScreen}>
            <View style={styles.pauseModal}>
              <Text style={{fontSize: 35, marginBottom: 20}}>{this.state.win ? "You Win!" : "Paused"}</Text>
              <View style={styles.buttonRow}>
                {!this.state.win && <TouchableOpacity style={styles.button} onPress={this.pauseHandler}><Text style={styles.buttonText}>Resume</Text></TouchableOpacity>}
                <TouchableOpacity style={styles.button} onPress={this.reset}><Text style={styles.buttonText}>Restart</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Exit</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        }

        <TouchableOpacity style={styles.pauseButton} onPress={this.pauseHandler} ><Text style={styles.pauseText}>||</Text></TouchableOpacity>
        <TouchableOpacity style={styles.jumpButton} onPressIn={() => this.gameEngine.dispatch({ type: "jump" })} ><Text style={styles.jumpText}>^</Text></TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    pauseButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 40,
      height: 40,
      backgroundColor: '#ddd',
      zIndex: 99,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
    pauseText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    jumpButton: {
      position: 'absolute',
      bottom: Constants.JUMP_BUTTON_BOTTOM,
      right: Constants.JUMP_BUTTON_RIGHT,
      width: Constants.JUMP_BUTTON_RADIUS,
      height: Constants.JUMP_BUTTON_RADIUS,
      borderRadius: 50,
      backgroundColor: '#fff',
      opacity: 0.8,
      elevation: 5
    },
    jumpText: {
      marginTop: 5,
      textAlign: 'center',
      fontSize: 60,
    },
    fullScreen: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      opacity: 0.8,
      backgroundColor: '#aaa',
      justifyContent: 'center',
      alignItems: 'center',
    },
    pauseModal: {
      height: 200,
      width: 400,
      borderRadius: 20,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff'
    },
    buttonRow:{
      flexDirection: 'row',
    },
    button: {
      borderColor: '#000000',
      borderWidth: 1,
      padding: 10,
      margin: 10,
      borderRadius: 10,
    },
    buttonText: {
      textAlign: 'center',
      fontSize: 20,
    },
    gameContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
});