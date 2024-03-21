/**
 * ====================================================
 * ENUMS
 * */
const SHAPE = {
  LINE: "line",
  SQUARE: "square",
  RECTANGLE: "rectangle",
  POLYGON: "polygon",
};

/**
 * ====================================================
 * State variables
 */
let isDrawing = false;
let shapeSize = 0;
let currentSelectedShape = null;
let isFocusingCanvas = false;
let keyPressed = false;
let shapes = {
  line: [],
  square: [],
  rectangle: [],
  polygon: [],
};

let canvas = document.querySelector("#c");
var gl = canvas.getContext("webgl");
if (!gl) {
  console.error("webgl not found");
}

/**
 * ====================================================
 * Setup canvas width and height to match display
 * Setup wgl viewport to match canvas resolution
 * */
let displayWidth = canvas.clientWidth;
let displayHeight = canvas.clientHeight;

if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
  canvas.width = displayWidth;
  canvas.height = displayHeight;
}
gl.viewport(0, 0, canvas.width, canvas.height);

/**
 * ====================================================
 * Setup WGL program
 * */
let fragmentShaderSrc = `
    precision highp float;
    varying vec4 fragmentColor;

    void main() {
        gl_FragColor = fragmentColor;
    }
`;

let vertexShaderSrc = `
    precision mediump float;
    attribute vec4 a_position;
    attribute vec4 vertexColor;
    varying vec4 fragmentColor;

    void main() {
        gl_Position = a_position;
        gl_PointSize = 10.0;
        fragmentColor = vertexColor;
    }
`;

const wglProgram = createProgram(vertexShaderSrc, fragmentShaderSrc);

/**
 * ====================================================
 * Buttons event listener
 */

// Draw buttons
let drawLineBtn = document.getElementById("line");
drawLineBtn.addEventListener("click", () => {
  if (!isDrawing) {
    currentSelectedShape = SHAPE.LINE;
    isDrawing = true;
  } else {
    alert("Click finish drawing before start another one");
  }
});

let drawSquareBtn = document.getElementById("square");
drawSquareBtn.addEventListener("click", () => {
  if (!isDrawing) {
    currentSelectedShape = SHAPE.SQUARE;
    isDrawing = true;
  } else {
    alert("Click finish drawing before start another one");
  }
});

let drawPolygonBtn = document.getElementById("polygon");
drawPolygonBtn.addEventListener("click", () => {
  if (!isDrawing) {
    currentSelectedShape = SHAPE.POLYGON;
    isDrawing = true;
  } else {
    alert("Click finish drawing before start another one");
  }
});

// Action buttons
let finishDrawBtn = document.getElementById("finish");
finishDrawBtn.addEventListener("click", () => {
  if (isDrawing) {
    isDrawing = false;
  }
});

/**
 * ====================================================
 * Canvas event listener
 * */
canvas.addEventListener("mousemove", (e) => {
  // Only draws when canvas is focused
  if (isFocusingCanvas && isDrawing) {
    const { x, y } = getCursorPosition(canvas, e);
    onMouseMove(shapes, currentSelectedShape, x, y);
  }
});

canvas.addEventListener("mousedown", (e) => {
  if (isDrawing) {
    isFocusingCanvas = true;

    const { x, y } = getCursorPosition(canvas, e);
    drawShape(shapes, currentSelectedShape, x, y, shapeSize);
  }
});

canvas.addEventListener("mouseup", () => {
  if (isDrawing) {
    isFocusingCanvas = false;

    if (currentSelectedShape === SHAPE.POLYGON) {
      polygonStopDrawing(shapes, currentSelectedShape);
    }
  }
  console.log(shapes);
});

/**
 * ====================================================
 * Polygon related keybinds
 * */
document.addEventListener("keydown", (e) => {
  if (!keyPressed && isFocusingCanvas) {
    if (currentSelectedShape === SHAPE.POLYGON) {
      if (e.code === "Backspace") {
        const { x, y } = getCursorPosition(canvas, e);
        onBackspaceRemovePolygonVertex(shapes, currentSelectedShape, x, y);
      } else if (e.code === "Enter") {
        onEnterAddPolygonVertex(shapes, currentSelectedShape);
      }
    }

    keyPressed = true;
  }
});
document.addEventListener("keyup", (e) => {
  keyPressed = false;
});

/**
 * ===================================================
 * Sliders event listeners
 * */
const sizeSlider = document.getElementById("size");
sizeSlider.addEventListener("input", function (e) {
  shapeSize = parseInt(sizeSlider.value);
});

/**
 * ====================================================
 * Renders all the given shapes on 60fps
 * */
const renderShapes = (program) => {
  clearCanvas();

  let shapeNames = Object.keys(shapes);
  shapeNames.forEach((shapeName) => {
    shapes[shapeName].forEach((shape) => {
      shape.renderShape(program);
    });
  });

  window.requestAnimFrame(() => {
    renderShapes(wglProgram);
  });
};

window.requestAnimFrame = (() => {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

renderShapes(wglProgram);
