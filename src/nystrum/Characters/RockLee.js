// import deps
import * as Item from '../items';
import * as Entity from '../entites';
import * as Constant from '../constants';
import * as Keymap from '../Keymap';
import { createEightDirectionMoveOptions } from '../Keymap/helper';

export default function (engine) {
  // define keymap
  const keymap = (engine) => {
    return {
      ...createEightDirectionMoveOptions(Keymap.walk, engine),
      s: {
        activate: () => Keymap.none(engine),
        label: 'stay',
      },
      l: {
        activate: () => Keymap.activateFlyingLotus(engine),
        label: 'Flying Lotus',
      },
      k: {
        activate: () => Keymap.removeWeights(engine, 200),
        label: 'Remove wraps',
      },
      j: {
        activate: () => Keymap.drunkenFist(engine),
        label: 'Sip Sake',
      },
      h: {
        activate: () => Keymap.leafWhirlwind(engine),
        label: 'Leaf Whirlwind',
      },
      g: {
        activate: () => Keymap.openInnerGate(engine),
        label: 'Gate of Opening',
      },
      i: {
        activate: () => Keymap.activateInventory(engine),
        label: 'Open Inventory',
      },
      o: {
        activate: () => Keymap.activateEquipment(engine),
        label: 'Open Equipment',
      },
      u: {
        activate: () => Keymap.activateDropItem(engine),
        label: 'Drop Item',
      },
      p: {
        activate: () => Keymap.pickupRandom(engine),
        label: 'Pickup',
      },
      t: {
        activate: () => Keymap.activateThrow(engine),
        label: 'Throw',
      },
      // DEV KEYS
      y: {
        activate: () => Keymap.addActor(engine.game),
        label: 'Add NPC',
      },
    };
  }
  // instantiate class
  let actor = new Entity.Player({
    pos: { x: 23, y: 7 },
    renderer: {
      character: 'R',
      color: '#e6e6e6',
      background: '#36635b',
    },
    name: 'Rock Lee',
    actions: [],
    speed: 400,
    durability: 20,
    keymap: keymap(engine),
  })

  // add default items to container
  const kunais = Array(100).fill('').map(() => Item.directionalKunai(engine, { ...actor.pos }, null, 10));
  const swords = Array(2).fill('').map(() => Item.sword(engine));
  actor.container = [
    new Entity.ContainerSlot({
      itemType: kunais[0].name,
      items: kunais,
    }),
    new Entity.ContainerSlot({
      itemType: swords[0].name,
      items: swords,
    }),
  ]

  return actor;
}