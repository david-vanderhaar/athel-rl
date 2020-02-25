// import deps
import * as Entity from '../entites';
import * as Keymap from '../Keymap';
import { createFourDirectionMoveOptions } from '../Keymap/helper';

export default function (engine) {
  // define keymap
  const keymap = (engine) => {
    return {
      ...createFourDirectionMoveOptions(Keymap.walk, engine),
      // DEV KEYS
      b: {
        activate: () => Keymap.addBody(engine),
        label: 'Add Body Part',
      },
      y: {
        activate: () => Keymap.addActor(engine.game),
        label: 'Add NPC',
      },
    };
  }
  // instantiate class
  let actor = new Entity.SnakePlayer({
    pos: { x: 23, y: 7 },
    renderer: {
      character: 'A',
      color: '#e6e6e6',
      background: '#36635b',
    },
    name: 'Athel',
    actions: [],
    speed: 200,
    durability: 10,
    keymap: keymap(engine),
  })

  return actor;
}