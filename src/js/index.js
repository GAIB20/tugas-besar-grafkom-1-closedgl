/**
 * ENUMS
 * */
const SHAPE = {
  LINE: "line",
  SQUARE: "square",
  RECTANGLE: "rectangle",
  POLYGON: "polygon",
};

/**
 * State variables
 */
let isDrawing = false;
let currentSelectedShape = null;
let isFocusingCanvas = false;
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
 * Setup WGL program
 * */
let fragmentShaderSrc = `
    precision highp float;
    varying vec4 fragmentColor;

    void main() {
        gl_FragColor = fragmentColor; // mengembalikan warna ungu kemerahan
    }
`;

let vertexShaderSrc = `
    precision mediump float;
    attribute vec4 a_position;
    attribute vec4 vertexColor;
    varying vec4 fragmentColor;

    void main() {
        gl_Position = a_position;
        gl_PointSize = 20.0;
        fragmentColor = vertexColor;
    }
`;

const wglProgram = createProgram(vertexShaderSrc, fragmentShaderSrc);

/**
 * Buttons event listener
 */
let drawLineBtn = document.getElementById("line");
drawLineBtn.addEventListener("click", () => {
  if (!isDrawing) {
    currentSelectedShape = SHAPE.LINE;
    isDrawing = true;
  } else {
    alert("Click finish drawing before start another one");
  }
});

/**
 * Canvas event listener
 * */
canvas.addEventListener("mousemove", (e) => {
  // Only draws when canvas is focused
  if (isFocusingCanvas) {
    const { x, y } = getCursorPosition(canvas, e);
    onMouseMove(shapes, currentSelectedShape, x, y);
  }
});

canvas.addEventListener("mousedown", (e) => {
  isFocusingCanvas = true;

  const { x, y } = getCursorPosition(canvas, e);
  drawShape(shapes, currentSelectedShape, x, y);
});

canvas.addEventListener("mouseup", () => {
  isFocusingCanvas = false;
  console.log(shapes)
});

/**
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
