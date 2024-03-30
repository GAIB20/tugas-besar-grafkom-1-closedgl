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

const SHAPE_CLASSES = {
  line: Line,
  square: Square,
  rectangle: Rectangle,
  polygon: Polygon,
};

/**
 * ====================================================
 * State variables
 */
let isDrawing = false;
let isEditing = false;
let isAddingPolygonPoint = false;
let currentSelectedShape = null;
let isFocusingCanvas = false;
let keyPressed = false;
let savedFile = null;
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
  if (!isDrawing && !isEditing) {
    currentSelectedShape = SHAPE.LINE;
    isDrawing = true;
    alert("You can start drawing line");
    drawLineBtn.classList.add("button-hovered");
  } else {
    if (isDrawing && currentSelectedShape === SHAPE.LINE && !isEditing) {
      isDrawing = false;
      alert("Finished drawing line");
      drawLineBtn.classList.remove("button-hovered");
    } else if (isEditing) {
      alert("Disable edit mode before drawing");
    } else {
      alert("Unselect current shape before drawing another shape");
    }
  }
});

let drawSquareBtn = document.getElementById("square");
drawSquareBtn.addEventListener("click", () => {
  if (!isDrawing && !isEditing) {
    currentSelectedShape = SHAPE.SQUARE;
    isDrawing = true;
    alert("You can start drawing square");
    drawSquareBtn.classList.add("button-hovered");
  } else {
    if (isDrawing && currentSelectedShape === SHAPE.SQUARE && !isEditing) {
      isDrawing = false;
      alert("Finished drawing square");
      drawSquareBtn.classList.remove("button-hovered");
    } else if (isEditing) {
      alert("Disable edit mode before drawing");
    } else {
      alert("Unselect current shape before drawing another shape");
    }
  }
});

let drawRectangleBtn = document.getElementById("rectangle");
drawRectangleBtn.addEventListener("click", () => {
  if (!isDrawing && !isEditing) {
    currentSelectedShape = SHAPE.RECTANGLE;
    isDrawing = true;
    alert("You can start drawing rectangle");
    drawRectangleBtn.classList.add("button-hovered");
  } else {
    if (isDrawing && currentSelectedShape === SHAPE.RECTANGLE && !isEditing) {
      isDrawing = false;
      alert("Finished drawing rectangle");
      drawRectangleBtn.classList.remove("button-hovered");
    } else if (isEditing) {
      alert("Disable edit mode before drawing");
    } else {
      alert("Unselect current shape before drawing another shape");
    }
  }
});

let drawPolygonBtn = document.getElementById("polygon");
drawPolygonBtn.addEventListener("click", () => {
  if (!isDrawing && !isEditing) {
    currentSelectedShape = SHAPE.POLYGON;
    isDrawing = true;
    alert("You can start drawing polygon");
    drawPolygonBtn.classList.add("button-hovered");
  } else {
    if (isDrawing && currentSelectedShape === SHAPE.POLYGON && !isEditing) {
      isDrawing = false;
      alert("Finished drawing polygon");
      drawPolygonBtn.classList.remove("button-hovered");
    } else if (isEditing) {
      alert("Disable edit mode before drawing");
    } else {
      alert("Unselect current shape before drawing another shape");
    }
  }
});

// Action buttons
let editShapeButton = document.getElementById("edit");
let addPointBtn = document.getElementById("add-point");
let removePointBtn = document.getElementById("remove-point");
editShapeButton.addEventListener("click", () => {
  if (!isDrawing && !isEditing) {
    if (isEmptyCheckbox()) {
      alert("Select vertices or shapes before editing");
      return;
    }

    isEditing = true;
    if (isPolygonSelected()) {
      addPointBtn.classList.remove("button-hidden");
      removePointBtn.classList.remove("button-hidden");
    }
    alert("You can start editing now!");
    editShapeButton.textContent = "Finish Edit";
  } else {
    if (isDrawing) {
      alert("Finish drawing before entering editing mode");
    } else {
      alert("Editing mode is disabled");
    }
    isEditing = false;

    addPointBtn.classList.add("button-hidden");
    removePointBtn.classList.add("button-hidden");

    editShapeButton.textContent = "Edit";
    resetAllCheckboxes();
  }
  document.getElementById("translate-x").value = "0";
  document.getElementById("translate-y").value = "0";
  document.getElementById("scale").value = "1";
  document.getElementById("rotate").value = "0";
  let shearXSlider = document.getElementById("shear-x");
  if (shearXSlider) {
    shearXSlider.value = "0";
  }
  let shearYSlider = document.getElementById("shear-y");
  if (shearYSlider) {
    shearYSlider.value = "0";
  }
  editObject(shapes);
});

addPointBtn.addEventListener("click", () => {
  if (!isEditing) {
    alert("Select edit mode first");
    return;
  }

  if (!isAddingPolygonPoint) {
    alert("Add polygon point by clicking on canvas");
    addPointBtn.textContent = "Finish Adding Point";
  } else {
    alert("Finished adding polygon point");
    addPointBtn.textContent = "Add Point";
    listVertices(shapes);
  }
  isAddingPolygonPoint = !isAddingPolygonPoint;
});

removePointBtn.addEventListener("click", () => {
  if (!isEditing) {
    alert("Select edit mode first");
    return;
  }

  deletePointsPolygon(shapes);
  listVertices(shapes);
});

let saveBtn = document.getElementById("save");
saveBtn.addEventListener("click", () => {
  if (!isEditing && !isDrawing) {
    let jsonFile = JSON.stringify(shapes);
    let data = new Blob([jsonFile], { type: "application/json" });

    // remove if exists
    if (savedFile !== null) {
      window.URL.revokeObjectURL(savedFile);
    }

    savedFile = window.URL.createObjectURL(data);
    let link = document.createElement("a");
    link.setAttribute("download", "shapes.json");
    link.href = savedFile;
    document.body.appendChild(link);
    link.click();
    alert("Shapes downloaded!");
  } else {
    alert("Please finish drawing or editing");
  }
});

let loadBtn = document.getElementById("load");
loadBtn.addEventListener("change", (e) => {
  if (!isEditing && !isDrawing) {
    let reader = new FileReader();
    reader.readAsText(e.target.files[0]);
    reader.addEventListener("load", () => {
      loadShapes(JSON.parse(reader.result));
    });

    alert("Shapes loaded!");
  } else {
    alert("Please finish drawing or editing!");
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
    drawShape(shapes, currentSelectedShape, x, y);
  } else if (isEditing && isAddingPolygonPoint) {
    isFocusingCanvas = true;
    const { x, y } = getCursorPosition(canvas, e);
    addPointToPolygons(x, y, shapes);
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

/**
 * Misc
 * */
const clearShapes = () => {
  shapes = {
    line: [],
    square: [],
    rectangle: [],
    polygon: [],
  };
};

const loadShapes = (jsonObj) => {
  clearShapes();
  Object.keys(jsonObj).forEach((shapeType) => {
    jsonObj[shapeType].forEach((item) => {
      let obj = new SHAPE_CLASSES[shapeType]();
      obj.copy(item);
      shapes[shapeType].push(obj);
      listVertices(shapes);
    });
  });
};
