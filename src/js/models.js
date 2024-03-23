class Shape {
  constructor() {
    this.id = generateUUID();
    this.vertices = []; // matrix of vertices
    this.colors = []; // matrix of vertices color in r,g,b form. Defaults to black
    this.selected = false;
    this.selectedVertices = []; // matrix of vertices
    this.scale = 0; // multiplier
    this.translation = [0, 0]; // x, y
    this.centroid = [0, 0]; // x, y
  }

  copy(obj) {
    this.vertices = obj.vertices;
    this.colors = obj.colors;
    this.selected = obj.selected;
    this.scale = obj.scale;
    this.translation = obj.translation;
  }

  translateVertex(vertexIndex, x, y) {
    // do the translation here
    let currentX = this.vertices[vertexIndex][0];
    let currentY = this.vertices[vertexIndex][1];

    this.vertices[vertexIndex] = [currentX + x, currentY + y];
  }

  scaleShape(factor, prevFactor) {
    this.vertices.forEach((v, index) => {
      let [x, y] = v;
      let newX =
        this.centroid[0] + (factor * (x - this.centroid[0])) / prevFactor;
      let newY =
        this.centroid[1] + (factor * (y - this.centroid[1])) / prevFactor;
      this.vertices[index] = [newX, newY];
    });
  }

  updateLastVertexPosition(x, y) {}

  renderShape(program) {} // render shape using GL

  /**
   * Set colors of each vertices of the shape
   * @param vertexIndex
   * @param rgbHex
   */
  setColor(vertexIndex, rgbHex) {
    const { r, g, b } = parseRGB(rgbHex);
    this.colors[vertexIndex] = [r, g, b, 1];
  }

  /**
   * Set the center of the shape
   */
  setCentroid() {
    this.centroid = calculateCentroid(this.vertices);
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

  rotateShape(angle) {
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    let rotationMatrix = [
      [cos, sin * -1],
      [sin, cos],
    ];

    this.vertices.forEach((v, index) => {
      // Rotate the shape like a wheel
      let [x, y] = v;
      x -= this.centroid[0];
      y -= this.centroid[1];
      let newX = x * rotationMatrix[0][0] + y * rotationMatrix[0][1];
      let newY = x * rotationMatrix[1][0] + y * rotationMatrix[1][1];
      newX += this.centroid[0];
      newY += this.centroid[1];

      this.vertices[index] = [newX, newY];
    });
  }

  shearXShape(factor, prevFactor) {
    let relativeFactor = factor - prevFactor;

    this.vertices.forEach((v, index) => {
      let [x, y] = v;
      let newX = x + relativeFactor * y;
      this.vertices[index] = [newX, y];
    });
  }

  shearYShape(factor, prevFactor) {
    let relativeFactor = factor - prevFactor;

    this.vertices.forEach((v, index) => {
      let [x, y] = v;
      let newY = y + relativeFactor * x;
      this.vertices[index] = [x, newY];
    });
  }

  renderShape(program) {
    // recalculate object center
    this.setCentroid();

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

  rotateShape(angle) {
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    let rotationMatrix = [
      [cos, sin * -1],
      [sin, cos],
    ];

    this.vertices.forEach((v, index) => {
      // Rotate the shape like a wheel
      let [x, y] = v;
      x -= this.centroid[0];
      y -= this.centroid[1];
      let newX = x * rotationMatrix[0][0] + y * rotationMatrix[0][1];
      let newY = x * rotationMatrix[1][0] + y * rotationMatrix[1][1];
      newX += this.centroid[0];
      newY += this.centroid[1];

      this.vertices[index] = [newX, newY];
    });
  }

  shearXShape(factor, prevFactor) {
    let relativeFactor = factor - prevFactor;

    this.vertices.forEach((v, index) => {
      let [x, y] = v;
      let newX = x + relativeFactor * y;
      this.vertices[index] = [newX, y];
    });
  }

  shearYShape(factor, prevFactor) {
    let relativeFactor = factor - prevFactor;

    this.vertices.forEach((v, index) => {
      let [x, y] = v;
      let newY = y + relativeFactor * x;
      this.vertices[index] = [x, newY];
    });
  }

  renderShape(program) {
    this.setCentroid();

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

  rotateShape(angle) {
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    let rotationMatrix = [
      [cos, sin * -1],
      [sin, cos],
    ];

    this.vertices.forEach((v, index) => {
      // Rotate the shape like a wheel
      let [x, y] = v;
      x -= this.centroid[0];
      y -= this.centroid[1];
      let newX = x * rotationMatrix[0][0] + y * rotationMatrix[0][1];
      let newY = x * rotationMatrix[1][0] + y * rotationMatrix[1][1];
      newX += this.centroid[0];
      newY += this.centroid[1];

      this.vertices[index] = [newX, newY];
    });
  }

  shearXShape(factor, prevFactor) {
    let relativeFactor = factor - prevFactor;

    this.vertices.forEach((v, index) => {
      let [x, y] = v;
      let newX = x + relativeFactor * y;
      this.vertices[index] = [newX, y];
    });
  }

  shearYShape(factor, prevFactor) {
    let relativeFactor = factor - prevFactor;

    this.vertices.forEach((v, index) => {
      let [x, y] = v;
      let newY = y + relativeFactor * x;
      this.vertices[index] = [x, newY];
    });
  }

  renderShape(program) {
    this.setCentroid();

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

    // start as line
    for (let i = 0; i < 2; i++) {
      this.vertices.push(convertToWGLCoordinate(canvas, x, y));
      this.colors.push([0, 0, 0, 1]);
    }

    // flags to indicate if polygon is still in drawing mode (initialization)
    this.isAddingVertex = true;
  }

  rotateShape(angle) {}

  shearXShape(factor, prevFactor) {}

  shearYShape(factor, prevFactor) {}

  renderShape(program) {
    this.setCentroid();

    renderVertex(program, flattenMatrix(this.vertices), 2);
    renderColor(program, flattenMatrix(this.colors), 4);

    if (this.isAddingVertex || this.vertices.length <= 2) {
      gl.drawArrays(gl.LINE_STRIP, 0, this.vertices.length);
    } else {
      gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vertices.length);
    }
  }

  stopDrawing() {
    this.isAddingVertex = false;
    this.recalculatePolygon();
  }

  recalculatePolygon() {
    // todo: recalculate convex hull
    this.setCentroid();
  }

  addVertex(x, y) {
    this.vertices.push(convertToWGLCoordinate(canvas, x, y));
    this.colors.push([0, 0, 0, 1]);
    this.setCentroid();
  }

  removeLastVertex() {
    this.vertices.pop();
    this.colors.pop();
    this.setCentroid();
  }

  updateLastVertexPosition(x, y) {
    let len = this.vertices.length;
    this.vertices[len - 1][0] = x;
    this.vertices[len - 1][1] = y;
  }
}
