import * as Helper from '../helper'

export const ENERGY_THRESHOLD = 100;

export const COLORS = {
  black_1: '#424242',
  gray_1: '#262d37',
  gray_2: '#606b79',
  gray_4: '#B7C3CD',
  gray_5: '#CED5DD',
  green_1: '#1d533c',
  green_2: '#227743',
  green_3: '#2d9c59',
  red_4: '#D82D33',
  red_5: '#E16264',
  purple_3: '#c45ffd',
}

export const TILE_KEY = {
  'GROUND': {
    background: COLORS.black_1,
    foreground: COLORS.gray_2,
    character: '.',
    passable: true,
  },
  'WALL': {
    background: COLORS.black_1,
    foreground: COLORS.gray_2,
    character: '#',
    passable: false,
  },
  'WATER': {
    animation: [
      { background: '#424242', foreground: '#9dc3d3', character: '░', passable: false,},
      { background: '#424242', foreground: '#9dc3d3', character: '░', passable: false,},
      { background: '#424242', foreground: '#9dc3d3', character: '░', passable: false,},
      { background: '#424242', foreground: '#9dc3d3', character: '░', passable: false,},
      { background: '#424242', foreground: '#9dc3d3', character: '░', passable: false,},
      { background: '#424242', foreground: '#9dc3d3', character: '░', passable: false,},
      { background: '#424242', foreground: '#9dc3d3', character: '░', passable: false,},
      { background: '#424242', foreground: '#9dc3d3', character: '░', passable: false,},
      { background: '#424242', foreground: '#9dc3d3', character: '░', passable: false,},
      { background: '#424242', foreground: '#9dc3d3', character: '░', passable: false,},
      { background: '#424242', foreground: '#9dc3d3', character: '░', passable: false,},
      { background: '#424242', foreground: '#8aa', character: '▒', passable: false, },
      { background: '#424242', foreground: '#8aa', character: '▓', passable: false, },
    ],
    background: '#9dc3d3',
    character: '░',
    passable: false,
  },
  'WIN': {
    background: 'white',
    foreground: 'black',
    character: 'W',
    passable: true,
  }
}

export const HAND_SIGNS = {
  Power: {
    type: 'Power',
    name: 'Rin',
    description: 'Strength of mind, body, spirit',
  },
  Energy: {
    type: 'Energy',
    name: 'Pyo',
    description: 'energy direction',
  },
  Harmony: {
    type: 'Harmony',
    name: 'To',
    description: 'one- ness with the universe or self',
  },
  Healing: {
    type: 'Healing',
    name: 'Sha',
    description: 'of self and others',
  },
  Intuition: {
    type: 'Intuition',
    name: 'Kai',
    description: 'premonition of danger, feeling others intent',
  },
  Awareness: {
    type: 'Awareness',
    name: 'Jin',
    description: 'feeling thoughts of others, perhaps hiding your own',
  },
  Dimension: {
    type: 'Dimension',
    name: 'Retsu',
    description: 'control of time and space',
  },
  Creation: {
    type: 'Creation',
    name: 'Zai',
    description: 'understanding nature',
  },
  Absolute: {
    type: 'Absolute',
    name: 'Zen',
    description: 'enlightenment',
  }, 
}

export const DIRECTIONS = {
  N: [0, -1],
  NE: [1, -1],
  W: [-1, 0],
  NW: [-1, -1],
  SW: [-1, 1],
  S: [0, 1],
  SE: [1, 1],
  E: [1, 0],
  NONE: [0, 0],
}

export const getDirectionKey = (direction) => {
  let directionString = `${direction}`;
  let keys = Object.keys(DIRECTIONS);
  let result = false
  keys.forEach((key) => {
    if (`${DIRECTIONS[key]}` === directionString) {
      result = key
    }
  })
  return result
}

export const EQUIPMENT_TYPES = {
  HEAD: 'HEAD',
  TORSO: 'TORSO',
  BACK: 'BACK',
  HAND: 'HAND',
  FEET: 'FEET',
}

export const EQUIPMENT_LAYOUTS = {
  human: () => {
    return [
      {type: EQUIPMENT_TYPES.HEAD, name: 'head', item: null},
      {type: EQUIPMENT_TYPES.TORSO, name: 'torso', item: null},
      {type: EQUIPMENT_TYPES.BACK, name: 'back', item: null},
      {type: EQUIPMENT_TYPES.HAND, name: 'left_hand', item: null},
      {type: EQUIPMENT_TYPES.HAND, name: 'right_hand', item: null},
      {type: EQUIPMENT_TYPES.FEET, name: 'feet', item: null},
    ]
  }
}

export const CLONE_PATTERNS = {
  verticalLine: {
    x_offset: 1,
    y_offset: 1,
    positions: [
      { x: 0, y: 0, taken: false, },
      { x: 0, y: 1, taken: false, },
      { x: 0, y: -1, taken: false, },
    ]
  },
  smallSquare: {
    x_offset: 1,
    y_offset: 1,
    positions: [
      { x: 0, y: 0, taken: false, },
      { x: 0, y: 1, taken: false, },
      { x: 1, y: 1, taken: false, },
      { x: 1, y: 0, taken: false, },
    ]
  },
  square: {
    x_offset: 2,
    y_offset: 2,
    positions: [
      { x: 0, y: 0, taken: false, },
      { x: 0, y: 1, taken: false, },
      { x: 1, y: 1, taken: false, },
      { x: 1, y: 0, taken: false, },
      { x: 1, y: -1, taken: false, },
      { x: 0, y: -1, taken: false, },
      { x: -1, y: -1, taken: false, },
      { x: -1, y: 0, taken: false, },
      { x: -1, y: 1, taken: false, },
    ]
  },
  bigSquare: {
    x_offset: 2,
    y_offset: 2,
    positions: [
      { x: 0, y: 0, taken: false, },
      { x: 0, y: 1, taken: false, },
      { x: 1, y: 1, taken: false, },
      { x: 1, y: 0, taken: false, },
      { x: 1, y: -1, taken: false, },
      { x: 0, y: -1, taken: false, },
      { x: -1, y: -1, taken: false, },
      { x: -1, y: 0, taken: false, },
      { x: -1, y: 1, taken: false, },
      { x: 0, y: 1, taken: false, },
      { x: 2, y: 2, taken: false, },
      { x: 2, y: 0, taken: false, },
      { x: 2, y: -2, taken: false, },
      { x: 0, y: -2, taken: false, },
      { x: -2, y: -2, taken: false, },
      { x: -2, y: 0, taken: false, },
      { x: -2, y: 2, taken: false, },
    ],
  },
  circle: {
    x_offset: 0,
    y_offset: 0,
    positions: [
      ...Helper.getPointsOnCircumference(0, 0, 2),
      ...Helper.getPointsOnCircumference(0, 0, 3)
    ]
  },
}

export const PARTICLE_TEMPLATES = {
  default: {
    renderer: {
      character: '*',
      color: 'black',
      background: 'white',
    }
  },
  fail: {
    renderer: {
      character: 'x',
      color: 'black',
      background: 'red',
    }
  },
  damage: {
    renderer: {
      character: '*',
      color: 'darkred',
      background: 'red',
    }
  },
  leaf: {
    renderer: {
      character: '✤',
      color: '#36635b',
      background: '#F0D8C0',
    }
  },
}

export const PARTICLE_TYPE = {
  directional: 0,
  path: 1,
}

export const ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];