import { Wall } from '../../entites';
import { PlaceItems } from '../../actions';
import { TYPE } from '../../items';
import { getDirectionKey, DIRECTIONS, ENERGY_THRESHOLD } from '../../constants';

// ------------ SAND WALL ----------------------
const createSandWall = (engine, pos) => new Wall({
  game: engine.game,
  passable: false,
  pos: { x: pos.x, y: pos.y },
  renderer: {
    // character: '>',
    character: '✦️',
    color: '#A89078',
    background: '#D8C0A8',
  },
  name: TYPE.BARRIER,
  durability: 3,
})

const triggerSandWall = (direction, engine) => {
  let actor = engine.actors[engine.currentActor];
  let targetPositions = [];
  let directionKey = getDirectionKey(direction);
  switch (directionKey) {
    case 'N':
      targetPositions = targetPositions.concat([
        {
          x: actor.pos.x - 1,
          y: actor.pos.y - 1,
        },
        {
          x: actor.pos.x,
          y: actor.pos.y - 1,
        },
        {
          x: actor.pos.x + 1,
          y: actor.pos.y - 1,
        },
      ]);
      break;
    case 'S':
      targetPositions = targetPositions.concat([
        {
          x: actor.pos.x - 1,
          y: actor.pos.y + 1,
        },
        {
          x: actor.pos.x,
          y: actor.pos.y + 1,
        },
        {
          x: actor.pos.x + 1,
          y: actor.pos.y + 1,
        },
      ]);
      break;
    case 'E':
      targetPositions = targetPositions.concat([
        {
          x: actor.pos.x + 1,
          y: actor.pos.y - 1,
        },
        {
          x: actor.pos.x + 1,
          y: actor.pos.y,
        },
        {
          x: actor.pos.x + 1,
          y: actor.pos.y + 1,
        },
      ]);
      break;
    case 'W':
      targetPositions = targetPositions.concat([
        {
          x: actor.pos.x - 1,
          y: actor.pos.y - 1,
        },
        {
          x: actor.pos.x - 1,
          y: actor.pos.y,
        },
        {
          x: actor.pos.x - 1,
          y: actor.pos.y + 1,
        },
      ]);
      break;
    default:
      break;
  }
  actor.setNextAction(new PlaceItems({
    targetPositions,
    entity: createSandWall(engine, { ...actor.pos }),
    game: engine.game,
    actor,
    energyCost: ENERGY_THRESHOLD
  }))
}

const keymapSandWall = (engine, initiatedBy, previousKeymap) => {
  const goToPreviousKeymap = () => initiatedBy.keymap = previousKeymap;
  return {
    Escape: {
      activate: goToPreviousKeymap,
      label: 'Close',
    },
    w: {
      activate: () => {
        triggerSandWall(DIRECTIONS.N, engine);
        goToPreviousKeymap();
      },
      label: 'activate N',
    },
    d: {
      activate: () => {
        triggerSandWall(DIRECTIONS.E, engine);
        goToPreviousKeymap();
      },
      label: 'activate E',
    },
    s: {
      activate: () => {
        triggerSandWall(DIRECTIONS.S, engine);
        goToPreviousKeymap();
      },
      label: 'activate S',
    },
    a: {
      activate: () => {
        triggerSandWall(DIRECTIONS.W, engine);
        goToPreviousKeymap();
      },
      label: 'activate W',
    },
  };
}

export const sandWall = (engine) => {
  let currentActor = engine.actors[engine.currentActor]
  currentActor.keymap = keymapSandWall(engine, currentActor, { ...currentActor.keymap });
}