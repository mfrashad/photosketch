import { Dimensions } from 'react-native';

export default Constants = {
    MAX_WIDTH: Dimensions.get("screen").width,
    MAX_HEIGHT: Dimensions.get("screen").height,
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