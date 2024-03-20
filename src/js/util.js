/**
 * Flatten the given matrix
 * @returns Float32Array
 * */
const flattenMatrix = (matrix) => {
  if (Array.isArray(matrix[0])) {
    return new Float32Array(matrix.flat());
  } else {
    return new Float32Array(matrix);
  }
};

const convertToWGLCoordinate = (canvas, x, y) => {
  const position = canvas.getBoundingClientRect();
  const [w, h] = [position.width, position.height];

  /* Normalize x and y to [-1, 1], with y inverted */
  const wglWidth = (x / w) * 2 - 1;
  const wglHeight = (y / h) * -2 + 1;

  return [wglWidth, wglHeight];
};

const parseRGB = (rgb) => {
  //convert rgb HEX to [0-1]
  const r = parseInt(rgb.substr(1, 2), 16) / 255;
  const g = parseInt(rgb.substr(3, 2), 16) / 255;
  const b = parseInt(rgb.substr(5, 2), 16) / 255;

  return { r, g, b };
};

/**
 * Get the centroid from the given matrix shape
 * */
const calculateCentroid = (matrix) => {
  let x = 0;
  let y = 0;
  let totalVertex = matrix.length;

  for (i = 0; i < totalVertex; i++) {
    x += matrix[i][0];
    y += matrix[i][1];
  }

  x = x / totalVertex;
  y = y / totalVertex;

  return [x, y];
};

/**
 * Returns user current cursor position
 * */
const getCursorPosition = (canvas, e) => {
  const position = canvas.getBoundingClientRect();

  const x = e.clientX - position.x;
  const y = e.clientY - position.y;

  return { x, y };
};

/**
 * Gets the latest object of the given shape type
 * Animate drawing by updating last vertex position (LINE and RECTANGLE)
 * */
const onMouseMove = (currShapes, shapeType, x, y) => {
  let [wglWidth, wglHeight] = convertToWGLCoordinate(canvas, x, y);

  if (shapeType === SHAPE.LINE) {
    const len = currShapes[SHAPE.LINE].length;
    currShapes[SHAPE.LINE][len - 1].updateLastVertexPosition(
      wglWidth,
      wglHeight
    );
    return;
  }

  if (shapeType === SHAPE.RECTANGLE) {
    const len = currShapes[SHAPE.RECTANGLE].length;
    currShapes[SHAPE.RECTANGLE][len - 1].updateLastVertexPosition(
      wglWidth,
      wglHeight
    );
  }

  if (shapeType === SHAPE.POLYGON) {
    const len = currShapes[SHAPE.POLYGON].length;
    currShapes[SHAPE.POLYGON][len - 1].updateLastVertexPosition(
      wglWidth,
      wglHeight
    );
    return;
  }
};

/**
 * Polygon utils
 * used for drawing of polygon
 */
const onEnterAddPolygonVertex = (currShapes, shapeType, x, y) => {
  if (shapeType !== SHAPE.POLYGON) {
    return;
  }

  let [wglWidth, wglHeight] = convertToWGLCoordinate(canvas, x, y);

  const len = currShapes[SHAPE.POLYGON].length;
  if (currShapes[SHAPE.POLYGON][len - 1].isAddingVertex) {
    currShapes[SHAPE.POLYGON][len - 1].addVertex(wglWidth, wglHeight);
  }
};

const onBackspaceRemovePolygonVertex = (currShapes, shapeType) => {
  if (shapeType !== SHAPE.POLYGON) {
    return;
  }

  const len = currShapes[SHAPE.POLYGON].length;
  if (
    currShapes[SHAPE.POLYGON][len - 1].vertices.length > 2 &&
    currShapes[SHAPE.POLYGON][len - 1].isAddingVertex
  ) {
    currShapes[SHAPE.POLYGON][len - 1].removeLastVertex();
  }
};

const polygonStopDrawing = (currShapes, shapeType) => {
  if (shapeType !== SHAPE.POLYGON) {
    return;
  }

  const len = currShapes[SHAPE.POLYGON].length;
  currShapes[SHAPE.POLYGON][len - 1].stopDrawing();

  if (currShapes[SHAPE.POLYGON][len - 1].vertices.length <= 2) {
    // if polygon only have 2 vertices, remove from shapes list
    currShapes[SHAPE.POLYGON].pop();
  }
};
