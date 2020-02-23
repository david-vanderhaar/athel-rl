import * as Entity from './entites';
import * as Constant from './constants';
import * as Helper from '../helper';

export const TYPE = {
  KUNAI: 'Kunai',
  DIRECTIONAL_KUNAI: 'Directional Kunai',
  SWORD: 'Sword',
  BARRIER: 'Barrier',
}

const createProjectileCloud = ({ 
  engine, 
  actor, 
  targetPos, 
  throwDirection,
  speed,
  structureType,
  createProjectile,
}) => {
  let structure = Constant.CLONE_PATTERNS[structureType];

  let children = structure.positions.map((slot) => {
    let position = {
      x: actor.pos.x + slot.x + (throwDirection.x * structure.x_offset),
      y: actor.pos.y + slot.y + (throwDirection.y * structure.y_offset)
    }
    
    let targetPosition = {
      x: targetPos.x + slot.x,
      y: targetPos.y + slot.y,
    }

    return createProjectile(engine, position, targetPosition);
  })

  return new Entity.DestructiveCloudProjectileV2({
    game: engine.game,
    passable: true,
    speed,
    children,
  })
}

const createProjectileSingularity = ({ 
  engine, 
  actor, 
  targetPos, 
  speed,
  structureType,
  createProjectile,
}) => {
  let structure = Constant.CLONE_PATTERNS[structureType];

  let children = structure.positions.map((slot) => {
    let position = {
      x: targetPos.x + slot.x + structure.x_offset,
      y: targetPos.y + slot.y + structure.y_offset
    }

    let targetPosition = {
      x: targetPos.x,
      y: targetPos.y,
    }

    return createProjectile(engine, position, targetPosition);

  })

  return new Entity.DestructiveCloudProjectileV2({
    game: engine.game,
    passable: true,
    speed,
    children,
  })
}

const createProjectileBurst = ({ 
  engine, 
  actor, 
  targetPos, 
  speed,
  structureType,
  createProjectile,
}) => {
  let structure = Constant.CLONE_PATTERNS[structureType];

  let children = structure.positions.map((slot) => {
    let position = {
      x: targetPos.x + structure.x_offset,
      y: targetPos.y + structure.y_offset
    }

    let targetPosition = {
      x: targetPos.x + slot.x,
      y: targetPos.y + slot.y,
    }

    return createProjectile(engine, position, targetPosition);

  })

  return new Entity.DestructiveCloudProjectileV2({
    game: engine.game,
    passable: true,
    speed,
    children,
  })
}

export const sandTomb = ({
  engine,
  actor,
  targetPos,
}) => createProjectileSingularity({
  engine,
  actor,
  targetPos,
  speed: 100,
  structureType: 'circle',
  createProjectile: sandTombPart,
})

export const sandBurst = ({
  engine,
  actor,
  targetPos,
}) => createProjectileBurst({
  engine,
  actor,
  targetPos,
  speed: 500,
  structureType: 'circle',
  createProjectile: sandTombPart,
})

export const sandWallPulse = ({
  engine,
  actor,
  targetPos,
  throwDirection,
}) => createProjectileCloud({
  engine,
  actor,
  targetPos,
  throwDirection,
  speed: 500,
  structureType: 'smallSquare',
  createProjectile: movingSandWall,
})

export const kunaiCloud = ({
  engine,
  actor,
  targetPos,
  throwDirection,
}) => createProjectileCloud({
  engine,
  actor,
  targetPos,
  throwDirection,
  speed: 500,
  structureType: 'square',
  createProjectile: kunai,
})

export const fireballCloud = ({
  engine,
  actor,
  targetPos,
  throwDirection,
}) => createProjectileCloud({
  engine,
  actor,
  targetPos,
  throwDirection,
  speed: 500,
  structureType: 'square',
  createProjectile: fireball,
})

export const kunai = (engine, pos, targetPos) => new Entity.DestructiveProjectile({
  game: engine.game,
  targetPos,
  passable: true,
  pos: { x: pos.x, y: pos.y },
  renderer: {
    character: '>',
    color: 'white',
    background: '',
    animation: [
      { background: '', foreground: 'white', character: '>', },
      { background: '', foreground: 'white', character: 'v', },
      { background: '', foreground: 'white', character: '<', },
      { background: '', foreground: 'white', character: '^', },
      { background: '', foreground: 'white', character: '>', },
    ],
  },
  name: TYPE.KUNAI,
  speed: 600,
  energy: 0,
  range: 30,
})

export const directionalKunai = (engine, pos, direction, range) => new Entity.DirectionalProjectile({
  game: engine.game,
  direction,
  passable: true,
  pos: { x: pos.x, y: pos.y },
  renderer: {
    character: '>',
    color: 'white',
    background: '',
    animation: [
      { background: 'lightgrey', foreground: 'grey', character: '>', },
      { background: 'lightgrey', foreground: 'grey', character: 'v', },
      { background: 'lightgrey', foreground: 'grey', character: '<', },
      { background: 'lightgrey', foreground: 'grey', character: '^', },
      { background: 'lightgrey', foreground: 'grey', character: '>', },
    ],
  },
  name: TYPE.DIRECTIONAL_KUNAI,
  speed: 600,
  energy: 0,
  range,
})

export const movingSandWall = (engine, pos, targetPos, range) => new Entity.MovingWall({
  game: engine.game,
  passable: false,
  pos: { x: pos.x, y: pos.y },
  targetPos,
  renderer: {
    // character: '>',
    character: ']',
    color: '#A89078',
    background: '#D8C0A8',
  },
  name: TYPE.KUNAI,
  // name: TYPE.BARRIER,
  durability: 3,
  range,
  speed: 300,
})

export const sandShuriken = (engine, pos, direction, range) => new Entity.DirectionalProjectile({
  game: engine.game,
  direction,
  passable: true,
  pos: { x: pos.x, y: pos.y },
  renderer: {
    // character: '>',
    character: '✦️',
    color: '#A89078',
    background: '#D8C0A8',
  },
  name: TYPE.DIRECTIONAL_KUNAI,
  speed: 600,
  energy: 0,
  range,
})

export const sandTombPart = (engine, pos, targetPos) => new Entity.DestructiveProjectile({
  game: engine.game,
  targetPos,
  passable: true,
  pos: { x: pos.x, y: pos.y },
  renderer: {
    // character: '>',
    character: '✦️',
    color: '#A89078',
    background: '#D8C0A8',
  },
  name: TYPE.KUNAI,
  speed: 600,
  energy: 0,
  range: 30,
})

export const fireball = (engine, pos, targetPos) => new Entity.DestructiveProjectile({
  game: engine.game,
  targetPos,
  passable: true,
  pos: { x: pos.x, y: pos.y },
  renderer: {
    // character: '>',
    character: '🔥',
    color: 'wheat',
    background: 'tomato',
  },
  name: TYPE.KUNAI,
  speed: 100,
  energy: 0,
  range: 30,
})

export const fireballGas = (engine, actor, targetPos) => {
  return new Entity.DestructiveCloudProjectile({
    game: engine.game,
    owner_id: actor ? actor.id : null,
    targetPos,
    passable: true,
    pos: actor ? { x: actor.pos.x, y: actor.pos.y } : null,
    renderer: {
      // character: '@',
      character: '🔥',
      color: 'wheat',
      background: 'tomato',
    },
    name: TYPE.KUNAI,
    speed: 100,
    range: 10,
    clonePattern: Constant.CLONE_PATTERNS.bigSquare,
    // clonePattern: Constant.CLONE_PATTERNS.square,
  })
}

export const waterball = (engine, actor, targetPos) => new Entity.DestructiveCloudProjectile({
  game: engine.game,
  owner_id: actor ? actor.id : null,
  targetPos,
  passable: true,
  pos: actor ? { x: actor.pos.x, y: actor.pos.y } : null,
  renderer: {
    // character: '~',
    character: '🌊',
    color: 'silver',
    background: 'lightslategrey',
  },
  name: TYPE.KUNAI,
  speed: 800,
  range: 10,
  clonePattern: Constant.CLONE_PATTERNS.bigSquare,
  // clonePattern: Constant.CLONE_PATTERNS.square,
})

export const sword = (engine) => new Entity.Weapon({
  game: engine.game,
  name: TYPE.SWORD,
  passable: true,
  attackDamage: 1,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    // character: '|',
    character: '🗡️',
    color: 'white',
    background: '',
  },
})

export const test = (engine, pos) => new Entity.Weapon({
  game: engine.game,
  name: TYPE.SWORD,
  passable: true,
  attackDamage: 1,
  pos,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    // character: '|',
    character: '🗡️',
    color: 'white',
    background: 'lightsteelblue',
  },
})
