// import deps
import * as Constant from '../constants';
import * as Item from '../items';
import * as Entity from '../entites';
import * as Keymap from '../Keymap';
import { createEightDirectionMoveOptions } from '../Keymap/helper';
// create class

const keymap = (engine) => {
  return {
    ...createEightDirectionMoveOptions(Keymap.walk, engine),
    i: {
      activate: () => Keymap.activateInventory(engine),
      label: 'Open Inventory',
    },
    q: {
      activate: () => Keymap.activateEquipment(engine),
      label: 'Open Equipment',
    },
    k: {
      activate: () => Keymap.cloneSelf(engine),
      label: 'Clone Self',
    },
    g: {
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
    y: {
      activate: () => Keymap.addActor(engine.game),
      label: 'Add NPC',
    },
    c: {
      activate: () => Keymap.charge(engine, 1),
      label: 'Charge',
    },
    '1': {
      activate: () => Keymap.sign(Constant.HAND_SIGNS.Power, engine),
      label: 'Sign - Power',
    },
    '2': {
      activate: () => Keymap.sign(Constant.HAND_SIGNS.Healing, engine),
      label: 'Sign - Healing',
    },
    '3': {
      activate: () => Keymap.sign(Constant.HAND_SIGNS.Absolute, engine),
      label: 'Sign - Absolution',
    },
    r: {
      activate: () => Keymap.signRelease(engine),
      label: 'Release',
    },
  };
}

export default function (engine) {
  let actor = new Entity.Player({
    pos: { x: 23, y: 7 },
    renderer: {
      character: 'N',
      color: 'black',
      background: 'orange',
    },
    name: 'Naruto Uzumaki',
    actions: [],
    speed: 600,
    durability: 1,
    keymap: keymap(engine),
  })

  actor.container = [
    Item.sword(engine),
    Item.sword(engine),
    Item.sword(engine),
    ...Array(10).fill('').map(() => Item.kunai(engine, { ...actor.pos })),
  ]

  return actor;
}
// export instance