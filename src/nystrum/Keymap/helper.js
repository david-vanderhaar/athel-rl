import { ALPHABET, DIRECTIONS } from '../constants';

export const addAlphabeticallyToKeymap = (keymap, obj) => {
  let alphabetAllowed = ALPHABET.filter((letter) => {
    return !Object.keys(keymap).includes(letter);
  });
  keymap[alphabetAllowed[0]] = obj;
}

export const deactivateUIKeymap = (engine, visibleUIKey) => {
  let currentUiActor = engine.actors[engine.currentActor];
  engine.game.removeActor(currentUiActor);
  engine.game[visibleUIKey] = null;
}

export const createFourDirectionMoveOptions = (moveFunction, engine, label = 'move') => {
  return {
    w: {
      activate: () => moveFunction(DIRECTIONS.N, engine),
      label: `${label} N`,
    },
    d: {
      activate: () => moveFunction(DIRECTIONS.E, engine),
      label: `${label} E`,
    },
    x: {
      activate: () => moveFunction(DIRECTIONS.S, engine),
      label: `${label} S`,
    },
    a: {
      activate: () => moveFunction(DIRECTIONS.W, engine),
      label: `${label} W`,
    },
  }
}

export const createEightDirectionMoveOptions = (moveFunction, engine, label = 'move') => {
  return {
    w: {
      activate: () => moveFunction(DIRECTIONS.N, engine),
      label: `${label} N`,
    },
    e: {
      activate: () => moveFunction(DIRECTIONS.NE, engine),
      label: `${label} NE`,
    },
    d: {
      activate: () => moveFunction(DIRECTIONS.E, engine),
      label: `${label} E`,
    },
    c: {
      activate: () => moveFunction(DIRECTIONS.SE, engine),
      label: `${label} SE`,
    },
    x: {
      activate: () => moveFunction(DIRECTIONS.S, engine),
      label: `${label} S`,
    },
    z: {
      activate: () => moveFunction(DIRECTIONS.SW, engine),
      label: `${label} SW`,
    },
    a: {
      activate: () => moveFunction(DIRECTIONS.W, engine),
      label: `${label} W`,
    },
    q: {
      activate: () => moveFunction(DIRECTIONS.NW, engine),
      label: `${label} NW`,
    },
  }
}