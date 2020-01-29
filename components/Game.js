import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, Text, Image} from 'react-native';
import Matter from "matter-js";
import { GameEngine } from "react-native-game-engine";
import Player from './Player';
import Enemy from './Enemy';
import Coin from './Coin';
import Goal from './Goal';
import Constants from '../constants/Constants';
import Physics from './Physics';
import Wall from './Wall';

const {MAX_HEIGHT, MAX_WIDTH, IMAGE_WIDTH, IMAGE_HEIGHT} = Constants

console.log(MAX_WIDTH, MAX_HEIGHT);
const pixelRatio = (MAX_HEIGHT/IMAGE_HEIGHT);
console.log(pixelRatio);


export default class Game extends Component {
    constructor(props){
        super(props);

        this.state = {
            running: true,
            winning: false,
        };

        this.gameEngine = null;
        this.gameData = null;

        this.entities = this.setupWorld();
    }

    setupWorld = async () => {
      const gameResponse = await fetch(this.props.gameURL);
      this.gameData = await gameResponse.json();
      return this.resetWorld()
    }

    resetWorld = () => {
      let engine = Matter.Engine.create({ enableSleeping: true });
      engine.timing.timeScale = 0.5;
      let world = engine.world;
      let walls = [];
      let coins = [];
      let player = null;
      let entities = {physics: { engine: engine, world: world }};
      
      const map = this.gameData.mapdata;
      
      for(let i = 0; i < map.length; i+= 1){
        for(let j = 0; j < map[i].length; j+= 1){
          const c = parseInt(map[i][j]);
          const x = j*pixelRatio;
          const y = (i) * pixelRatio * 1.03;
          
          if(c === 1){
            const wall = Wall(world, x, y, pixelRatio * 5, pixelRatio * 5);
            // walls.push(wall);
            // entities[wall.id] = wall;
          } else if (c === 3){
            Enemy(world, x, y, pixelRatio * 5, pixelRatio * 5);
          } else if (c === 2){
            const goal = Goal(world, x, y , pixelRatio * 5, pixelRatio * 5);
            // entities[`${i}${j}`] = goal;
          }
          else if (c === 6){
            if(!player){
              player = Player( world, x + 15, y + 15);
              entities.player = player;
            }
          }
        }
      }

      if(!player){
        player = Player( world, 100, 100);
        // let goal = Goal(world, j*pixelRatio + 300, i*pixelRatio, 20, 20);
        // entities.goal = goal;
        entities.player = player;
      }

      const coinsData = this.gameData.Coin_BBs
      coinsData.forEach((c, i) => {
        const w = c[2] * pixelRatio;
        const h = c[3] * pixelRatio;
        const x = c[0] * pixelRatio + w/2;
        const y = c[1] * pixelRatio + h/2;
        const coin = Coin(world, x, y, w, h);
        entities[`${x}${y}`] = coin;
      })

      
      // let player = Player( world, MAX_WIDTH / 4, MAX_HEIGHT / 2);
      // let enemy = Enemy(world, MAX_WIDTH / 4 * 2, MAX_HEIGHT / 3, 40, 40);
      // let coin = Coin(world, MAX_WIDTH / 4 * 2, MAX_HEIGHT - 75, 40, 40)
      // let goal = Goal(world, MAX_WIDTH / 4 * 3, MAX_HEIGHT - 75, 40, 40)
      let floor = Enemy(world, MAX_WIDTH / 2, MAX_HEIGHT + 40, MAX_WIDTH * 2, 30);
      let ceiling = Wall(world, MAX_WIDTH / 2, 5, MAX_WIDTH, 10);
      let lWall = Wall(world, -30, MAX_HEIGHT/2, 10, MAX_HEIGHT - 5);
      let rWall = Wall(world, MAX_WIDTH + 30, MAX_HEIGHT/2, 10, MAX_HEIGHT - 5);

      Matter.Events.on(engine, 'collisionStart', (event) => {
          let pairs = event.pairs;
          let pair = pairs[0];
          if(pair.bodyA.label === "goal" || pair.bodyB.label === "goal"){
            console.log("Win");
            this.gameEngine.dispatch({ type: "win"});
          }
          if(pair.bodyA.label === "player"){
            if(pair.bodyB.label != "wall") console.log(pair.bodyB.label);
            if(pair.bodyB.label === "enemy") {
              console.log("Game Over");
              this.gameEngine.dispatch({ type: "game-over"});
            } else if(pair.bodyB.label === "goal"){
              console.log("Win");
              this.gameEngine.dispatch({ type: "win"});
            } else if(pair.bodyB.label === "coin"){
              this.gameEngine.dispatch({type: "get-coin", coin: pair.bodyB});
            }
          } 
      });

      return entities;
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

  exit = () => {
    this.props.navigation.navigate('Home');
  }

  reset = () => {
    this.gameEngine.swap(this.resetWorld());
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
        <Image source={{uri: this.props.imageURL}} style={styles.sketchImage} />
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
                <TouchableOpacity style={styles.button} onPress={this.exit} ><Text style={styles.buttonText}>Exit</Text></TouchableOpacity>
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
        backgroundColor: '#adadad',
    },
    sketchImage: {
      position: 'absolute',
      height: MAX_HEIGHT,
      width: IMAGE_WIDTH * pixelRatio,
      resizeMode: 'cover',
      opacity: 0.8,
      top: 0,
      left: 0,
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
      height: MAX_HEIGHT,
      left: 0,
      width: MAX_WIDTH,
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