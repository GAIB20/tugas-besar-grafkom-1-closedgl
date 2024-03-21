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

  updateLastVertexPosition(x, y) {}

  renderShape(program) {} // render shape using GL

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
      this.colors.push([0, 0, 0, 1]);
    }
  }

  translate(x, y) {}

  scale(x, y) {}

  renderShape(program) {
    renderVertex(program, flattenMatrix(this.vertices), 2);
    renderColor(program, flattenMatrix(this.colors), 4);
    for (let i = 0; i < this.vertices.length; i += 2) {
      gl.drawArrays(gl.LINES, i, 2);
    }
  }

  updateLastVertexPosition(x, y) {
    let len = this.vertices.length;
    this.vertices[len - 1][0] = x;
    this.vertices[len - 1][1] = y;
  }
}

class Square extends Shape {
  constructor(x, y, size) {
    super();

    // TODO: change this constant
    const SQ_DEFAULT_SIZE = 100;

    let square_size = size ? size : SQ_DEFAULT_SIZE

    let _vertices = [];
    let _colors = [];
    _vertices.push(convertToWGLCoordinate(canvas, x, y));
    _vertices.push(convertToWGLCoordinate(canvas, x + square_size, y));
    _vertices.push(convertToWGLCoordinate(canvas, x, y + square_size));
    _vertices.push(
      convertToWGLCoordinate(canvas, x + square_size, y + square_size)
    );

    for (let i = 0; i < 4; i++) {
      _colors.push([0, 0, 0, 1]);
    }

    this.colors.push(..._colors);
    this.vertices.push(..._vertices);
  }

  translate(x, y) {}

  scale(x, y) {}

  renderShape(program) {
    let size = this.vertices.length;

    renderVertex(program, flattenMatrix(this.vertices), 2);
    renderColor(program, flattenMatrix(this.colors), 4);

    // Draw using triangle strip
    for (let i = 0; i < size; i += 4) {
      gl.drawArrays(gl.TRIANGLE_STRIP, i, 4);
    }
  }
}

class Rectangle extends Shape {
  constructor(x, y) {
    super();
    let _colors = [];

    for (let i = 0; i < 4; i++) {
      this.vertices.push(convertToWGLCoordinate(canvas, x, y));
      _colors.push([0, 0, 0, 1]);
    }

    this.colors.push(..._colors);
  }

  translate(x, y) {}

  scale(x, y) {}

  renderShape(program) {
    renderVertex(program, flattenMatrix(this.vertices), 2);
    renderColor(program, flattenMatrix(this.colors), 4);
    
    for (let i = 0; i < this.vertices.length; i += 4) {
      gl.drawArrays(gl.TRIANGLE_STRIP, i, 4);
    }
  }

  updateLastVertexPosition(x, y) {
    let len = this.vertices.length;
    this.vertices[len - 1][0] = x;
    this.vertices[len - 1][1] = y;
    this.vertices[len - 2][1] = y;
    this.vertices[len - 3][0] = x;
  }
}

class Polygon extends Shape {
  constructor(x, y) {
    super();

    // flags to indicate if polygon is still in drawing mode (initialization)
    this.isAddingVertex = true;

    // start as line
    for (let i = 0; i < 2; i++) {
      this.vertices.push(convertToWGLCoordinate(canvas, x, y));
    }
    this.colors = [[0, 0, 0, 1]];
  }

  translate(x, y) {}

  scale(x, y) {}

  renderShape(program) {
    renderVertex(program, flattenMatrix(this.vertices), 2);
    renderColor(program, flattenMatrix(this.colors), 4);

    if (this.isAddingVertex) {
      gl.drawArrays(gl.LINE_STRIP, 0, this.vertices.length);
    } else {
      gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vertices.length);
    }
  }

  stopDrawing() {
    this.isAddingVertex = false;
    this.recalculatePolygon()
  }

  recalculatePolygon() {
    // todo: recalculate convex hull
    this.centroid = calculateCentroid(this.vertices);
  }

  addVertex(x, y) {
    this.vertices.push(convertToWGLCoordinate(canvas, x, y));
  }

  removeLastVertex() {
    this.vertices.pop();
  }

  updateLastVertexPosition(x, y) {
    let len = this.vertices.length;
    this.vertices[len - 1][0] = x;
    this.vertices[len - 1][1] = y;
  }
}
