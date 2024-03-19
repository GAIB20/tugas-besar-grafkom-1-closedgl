class Shape {
  constructor() {
    this.vertices = []; // matrix of vertices
    this.colors = []; // matrix of vertices color in r,g,b form. Defaults to black
    this.selected = false;
    this.selectedVertices = []; // matrix of vertices
    this.scale = 0; // multiplier
    this.translation = [0, 0]; // x, y
    this.centroid = [0, 0]; // x, y
  }

  translate(x, y) {}

  scale(x, y) {}

  onRendupdateLastVertexPositionerMove(x, y) {}

  renderShape(program) {} // render shape using GL

  setCentroid() {
    this.centroid = centroid(this.vertices);
  }

  /**
   * Set colors of each vertices of the shape
   * @param rgbHexs array of rgbHex
   */
  setColors(rgbHexs) {
    rgbHexs.forEach((rgbHex, index) => {
      const { r, g, b } = parseRGB(rgbHex);
      this.colors[index] = [r, g, b, 1];
    });
  }
}

class Line extends Shape {
  constructor(x, y) {
    super();

    for (let i = 0; i < 2; i++) {
      this.vertices.push(convertToWGLCoordinate(canvas, x, y));
    }
    this.colors = [[0, 0, 0, 1]];
  }

  translate(x, y) {}

  scale(x, y) {}

  renderShape(program) {}

  updateLastVertexPosition(x, y) {
    let len = this.vertices.length;
    this.vertices[len - 1][0] = x;
    this.vertices[len - 1][1] = y;
  }
}

class Square extends Shape {
  constructor(x, y) {
    super();
    
    // TODO: change this constant
    const SQ_DEFAULT_SIZE = 100;
    
    let _vertices = [];
    let _colors = [];
    _vertices.push(convertToWGLCoordinate(canvas, x, y));
    _vertices.push(convertToWGLCoordinate(canvas, x + SQ_DEFAULT_SIZE, y));
    _vertices.push(convertToWGLCoordinate(canvas, x, y + SQ_DEFAULT_SIZE));
    _vertices.push(
      convertToWGLCoordinate(canvas, x + SQ_DEFAULT_SIZE, y + SQ_DEFAULT_SIZE)
    );

    for (let i = 0; i < 4; i++) {
      _colors.push([0, 0, 0, 1]);
    }

    this.colors.push(..._colors);
    this.vertices.push(..._vertices);
  }

  translate(x, y) {}

  scale(x, y) {}

  renderShape(program) {}
}

class Rectangle extends Shape {
  constructor(x, y) {
    super();

    for (let i = 0; i < 4; i++) {
      this.vertices.push(transformCoordinate(canvas, x, y));
      this.colors = [[0, 0, 0, 1]];
    }
  }
  
  translate(x, y) {}

  scale(x, y) {}

  renderShape(program) {}

  updateLastVertexPosition(x, y) {
    let len = this.vertices.length;
    this.vertices[len - 1][0] = x;
    this.vertices[len - 1][1] = y;
    this.vertices[len - 2][1] = y;
    this.vertices[len - 3][0] = x;
  }
}

class Polygon extends Shape {
  constructor(polyPoints) {
    super();
  }

  translate(x, y) {}

  scale(x, y) {}

  renderShape(program) {}
}
