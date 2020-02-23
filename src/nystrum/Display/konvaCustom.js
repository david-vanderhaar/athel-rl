import Konva from 'konva';

export class Display {
  constructor({
    containerId = null,
    width = 100,
    height = 100,
    tileWidth = 10,
    tileHeight = 10,
    tileGutter = 0,
    tileOffset = 10,
  }) {
    this.containerId = containerId;
    this.width = width;
    this.height = height;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.tileGutter = tileGutter;
    this.tileOffset = tileOffset;
    this.stage = null;
    this.layer = null;
  }

  initialize (document) {
    let d = document.getElementById(this.containerId)
    let displayContainer = document.createElement('div');
    d.appendChild(displayContainer);

    this.stage = new Konva.Stage({
      container: 'display',   // id of container <div>
      width: this.width,
      height: this.height
    });

    this.layer = new Konva.Layer({
      hitGraphEnabled: false,
    });
    this.stage.add(this.layer);
  }

  updateTile(tile, character, foreground, background) {
    // child[0] is the rectangle
    // child[1] is the text
    tile.children[0].fill(background);
    tile.children[1].fill(foreground);
    tile.children[1].text(character);
  }

  createTile(x, y, character, foreground, background) {
    let node = new Konva.Group({
      id: `${x},${y}`,
      x: (this.tileWidth * x) + (this.tileOffset + this.tileGutter),
      y: (this.tileHeight * y) + (this.tileOffset + this.tileGutter),
      width: this.tileWidth,
      height: this.tileHeight,
    });

    let rect = new Konva.Rect({
      name: 'rect',
      width: this.tileWidth,
      height: this.tileHeight,
      fill: background,
      strokeEnabled: false,
      // for optimization
      transformsEnabled: 'position',
      perfectDrawEnabled: false,
      listening: false,
    });

    let text = new Konva.Text({
      name: 'text',
      text: character,
      width: this.tileWidth,
      height: this.tileHeight,
      fill: foreground,
      align: 'center',
      verticalAlign: 'middle',
      // for optimization
      transformsEnabled: 'position',
      perfectDrawEnabled: false,
      listening: false,
    });

    node.add(rect);
    node.add(text);
    this.layer.add(node);
    return node;
  }

  draw () {
    this.layer.batchDraw();
    // this.layer.draw();
  }
}
