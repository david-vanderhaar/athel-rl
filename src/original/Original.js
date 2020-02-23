import React from 'react';
import '../App.css';
import * as ROT from 'rot-js';
import * as Entity from './lib/entity'
import * as Helper from './lib/helper'
import * as Components from './components/index'

const SHOW = (canvas) => {
  let d = document.getElementById('display')
  d.appendChild(canvas)
}

const CREATE_LEVEL = (world) => {
  let digger = new ROT.Map.Arena();
  let freeCells = [];
  let digCallback = function (x, y, value) {
    if (value) { return; }
    let key = x + "," + y;
    world.map[key] = {
      type: 'GROUND',
      entities: [],
    };
    freeCells.push(key);
  }
  digger.create(digCallback.bind(this));
}

let scheduler = new ROT.Scheduler.Simple()
let engine = new ROT.Engine(scheduler)

let world = {
  canAct: true,
  scheduler,
  engine,
  map: {},
  display: new ROT.Display({ fontSize: 24, bg: '#099' }),
  canOccupy: (map, pos) => {
    if (map.hasOwnProperty(Helper.coordsToString(pos))) {
      let tile = map[Helper.coordsToString(pos)];
      if (Helper.TILE_KEY()[tile.type].passable && Helper.getImpassableEntities(tile.entities).length === 0) {
        return true
      }
    } else {
      return false
    }
  },
}

let naruto = {
  ...Entity.createEntity(1, 'Naruto', {
    reciever: Components.receiver({ x: 10, y: 30 }),
    body: Components.body(world, { x: 19, y: 21 }),
    renderer: Components.renderer(world, 'N', 'orange', 'black'),
  },
    world,
  ),
}

let box = {
  ...Entity.createEntity(2, 'Box', {
    body: Components.body(world, { x: 22, y: 21 }),
    renderer: Components.renderer(world, '#', 'black'),
    impasse: Components.impasse(),
    destructible: Components.destructible(world),
  },
    world,
  )
}

let box2 = {
  ...Entity.createEntity(2, 'Box', {
    body: Components.body(world, { x: 22, y: 19 }),
    renderer: Components.renderer(world, '#', 'black'),
    impasse: Components.impasse(),
    destructible: Components.destructible(world),
  },
    world,
  )
}

let box3 = {
  ...Entity.createEntity(2, 'Box', {
    body: Components.body(world, { x: 22, y: 17 }),
    renderer: Components.renderer(world, '#', 'black'),
    impasse: Components.impasse(),
    destructible: Components.destructible(world),
  },
    world,
  )
}

let kunai = {
  ...Entity.createEntity(3, 'Kunai', {
    body: Components.body(world, { x: 20, y: 21 }),
    renderer: Components.renderer(world, '<>', 'black'),
    destructible: Components.destructible(world),
    attack: Components.attack(),
    throwable: Components.throwable(world),
  },
    world,
  )
}

class Original extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.presserRef = React.createRef();
  }

  handleKeyPress = (event, world, entity) => {
    let keymap = {
      w: 0,
      d: 1,
      s: 2,
      a: 3,
    };

    let code = event.key;
    let dir = ROT.DIRS[4][keymap[code]];
    if (code === 't') {
      kunai.sendEvent(kunai, 'MOVE', {
        currentPos: kunai.components.body.pos,
        targetPos: {
          x: entity.components.body.pos.x + 1,
          y: entity.components.body.pos.y,
        },
      })
      return kunai.sendEvent(kunai, 'THROW', { direction: { x: 1, y: 0 } })
    }
    if (!(code in keymap)) { return; }
    let newX = entity.components.body.pos.x + dir[0];
    let newY = entity.components.body.pos.y + dir[1];

    entity.sendEvent(
      entity, 'MOVE', {
        currentPos: entity.components.body.pos,
        targetPos: {
          x: newX,
          y: newY
        }
      }
    )

    return;
    // return Helper.DRAW(world.map, world.display)

  }

  componentDidMount() {
    ROT.RNG.setSeed(7);
    SHOW(world.display.getContainer());
    CREATE_LEVEL(world);
    naruto.sendEvent(naruto, 'PREPARE_RENDER')
    // kunai.sendEvent(kunai, 'PREPARE_RENDER')
    box.sendEvent(box, 'PREPARE_RENDER')
    box2.sendEvent(box2, 'PREPARE_RENDER')
    box3.sendEvent(box3, 'PREPARE_RENDER')
    Helper.DRAW(world.map, world.display)
    this.presserRef.current.focus();
  }

  render() {
    return (
      <div className="App" ref={this.presserRef} onKeyDown={(event) => this.handleKeyPress(event, world, naruto)} tabIndex='0'>
        <div id='display'></div>
      </div>
    );
  }
}

export default Original;
