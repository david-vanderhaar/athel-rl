import * as Helper from '../lib/helper';

export const receiver = (pos) => {
  return {
    responded: false,
    RECIEVE: (parameters) => {
      let { self, component, message } = parameters
      console.log(message, pos.x, pos.y)
      if (!component.responded) {
        component.responded = true
        self.sendEvent(parameters.sender, 'hello', 'RECIEVE', { message: 'copy', sender: self })
      }
    }
  }
}

export const impasse = (passable = false) => {
  return {
    passable,
    MAKE_PASSABLE: (parameters) => {
      let { component } = parameters;
      component.passable = true;
    },
    MAKE_IMPASSABLE: (parameters) => {
      let { component } = parameters;
      component.passable = false;
    }
  }
}

export const body = (world, pos = { x: 0, y: 0 }) => {
  if (world) {
    return {
      pos,
      MOVE: (parameters) => {
        let { self, component, currentPos, targetPos } = parameters
        if (world.canOccupy(world.map, targetPos)) {
          component.pos = targetPos
          let tile = world.map[Helper.coordsToString(currentPos)]
          world.map[Helper.coordsToString(currentPos)] = {...tile, entities: []}
          self.sendEvent(self, 'PREPARE_RENDER')
          // Helper.DRAW(world.map, world.display)
        } else {
          console.log('can\'t move there')
        }
      }
    }
  }
  console.log('No world to occupy');
  return {}
}

export const destructible = (world, durability = 1) => {
  return {
    durability,
    DECREASE_DURABILITY: (parameters) => {
      let { self, component, value } = parameters;
      component.durability -= value
      if (component.durability <= 0) {
        self.sendEvent(self, 'DESTROY')
      }
    },
    INCREASE_DURABILITY: (parameters) => {
      let { component, value } = parameters;
      component.durability += value
    },
    DESTROY: (parameters) => {
      let { self, component, value } = parameters;
      let tile = world.map[Helper.coordsToString(self.components.body.pos)];
      world.map[Helper.coordsToString(self.components.body.pos)].entities = tile.entities.filter((e) => e.id !== self.id);
      // self.sendEvent(self, 'PREPARE_RENDER')
      // Helper.DRAW(world.map, world.display)
    }
  }
}

export const attack = (damage = 1) => {
  return {
    damage,
  }
}

export const throwable = (world) => {
  return {
    THROW: (parameters) => {
      let { self, component, direction } = parameters;
      // if next tile is passable
        // send move action to self
        // send throw action to self
      // else
        // send decrease_durability to entity next in tile
        // send decrease_durability to self
      let currentPos = self.components.body.pos;
      let nextPos = { x: currentPos.x + direction.x, y: currentPos.y + direction.y }
      let nextTile = world.map[Helper.coordsToString(nextPos)];
      if (world.canOccupy(world.map, nextPos)) { // change to check for target entity
        self.sendEvent(
          self, 'MOVE', {
            currentPos: currentPos,
            targetPos: nextPos
          }
        )
        self.sendEvent(self, 'THROW', {direction});
      } else {
        if (world.map.hasOwnProperty(Helper.coordsToString(nextPos))) {
          let impassable_and_destructable_entities = Helper.getDestructableEntities(Helper.getImpassableEntities(nextTile.entities))
          if (impassable_and_destructable_entities.length > 0) {
            self.sendEvent(impassable_and_destructable_entities[0], 'DECREASE_DURABILITY', { value: 1 });
          }
        }
        self.sendEvent(self, 'DECREASE_DURABILITY', { value: 1 });
      }
    },
  }
}

export const renderer = (world, character = '', color = 'white', background = false) => {
  return {
    character,
    color,
    background,
    PREPARE_RENDER: (parameters) => {
      let { self } = parameters
      if (self.components.hasOwnProperty('body')) {
        world.map[Helper.coordsToString(self.components.body.pos)].entities.push(self)
      }
    }
  }
}