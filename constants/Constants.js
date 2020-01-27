import { Dimensions } from 'react-native';
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

export default Constants = {
    MAX_WIDTH: Math.max(width, height),
    MAX_HEIGHT: Math.min(width, height),
    JUMP_BUTTON_RADIUS: 75,
    JUMP_BUTTON_RIGHT: 30,
    JUMP_BUTTON_BOTTOM: 30,
    COLLISION_CATEGORY: {
      PLAYER: 1,
      WALL: 2,
      COIN: 4,
      GOAL: 8,
      ENEMY: 16,
    },
}