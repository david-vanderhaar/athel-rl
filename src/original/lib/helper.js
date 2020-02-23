import * as ROT from 'rot-js';

export const TILE_KEY = () => {
  return {
    'GROUND': {
      background: '#974',
      foreground: '#aaa',
      character: '.',
      passable: true,
    }
  }
}

// RENDERING

export const DRAW = (map, display) => {
  for (let key in map) {
    let parts = key.split(",");
    let x = parseInt(parts[0]);
    let y = parseInt(parts[1]);
    let tile = map[key];
    let { character, foreground, background } = TILE_KEY()[tile.type]
    if (tile.entities.length > 0) {
      let entity = tile.entities[tile.entities.length - 1]
      character = entity.components.renderer.character
      foreground = entity.components.renderer.color
      if (entity.components.renderer.background) {
        background = entity.components.renderer.background
      }
    }
    display.draw(x, y, character, foreground, background);
  }
}

// END RENDERING

export const coordsToString = (coords) => `${coords.x},${coords.y}`

export const getImpassableEntities = (entities) => {
  return entities.filter((e) => e.components.hasOwnProperty('impasse') && !e.components.impasse.passable)
}

export const getDestructableEntities = (entities) => {
  return entities.filter((e) => e.components.hasOwnProperty('destructible'))
}

export const delay = (timeDelayed = 100) => {
  return new Promise(resolve => setTimeout(resolve, timeDelayed));
}

export const exampleEngine = () => {
  let scheduler = new ROT.Scheduler.Simple();
  let engine = new ROT.Engine(scheduler);
  let output = [];
  /* sample actor: pauses the execution when dead */
  let actor = {
    lives: 3,
    act: function () {
      let done = null;
      let promise = {
        then: function (cb) { done = cb; }
      }

      output.push(".");
      // SHOW(output.join(""));
      console.log(output.join(""));

      this.lives--;

      /* if alive, wait for 500ms for next turn */
      if (this.lives) {
        setTimeout(function () { done(); }, 500);
      }

      return promise;
    }
  }
  scheduler.add(actor, true);
  engine.start();
}

export const getRandomInArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}