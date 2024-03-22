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

/**
 * Generate UUID
 * To generate unique id for every shape generated
 */
const generateUUID = () => {
  return "xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Append list of checkboxes for every shapes
 * @param shapes
 * */
const listVertices = (shapes) => {
  // Get the container div
  let container = document.getElementById("shape-data-container");

  // Clear the container
  container.innerHTML = "";

  for (let shapeType in shapes) {
    let shapeArray = shapes[shapeType];

    shapeArray.forEach((shape, shapeIndex) => {
      // Create a checkbox for the shape
      let shapeCheckbox = document.createElement("input");
      shapeCheckbox.type = "checkbox";
      shapeCheckbox.id = `${shape.id}-shape-${shapeIndex}`;
      shapeCheckbox.name = `${shape.id}-shape-${shapeIndex}`;

      // Create a label for the shape checkbox
      let shapeLabel = document.createElement("label");
      shapeLabel.htmlFor = shapeCheckbox.id;
      shapeLabel.textContent = `${shape.constructor.name} ${shapeIndex + 1}`;

      // Append the shape checkbox and label to the container
      container.appendChild(shapeCheckbox);
      container.appendChild(shapeLabel);
      container.appendChild(document.createElement("br"));

      // Iterate over each vertex in the shape
      shape.vertices.forEach((_, vertexIndex) => {
        // Create a checkbox for the vertex
        let vertexCheckbox = document.createElement("input");
        vertexCheckbox.type = "checkbox";
        vertexCheckbox.id = `${shape.id}-${shape.constructor.name}-${shapeIndex}-vertex-${vertexIndex}`;
        vertexCheckbox.name = `${shape.id}-${shape.constructor.name}-${shapeIndex}-vertex-${vertexIndex}`;

        // Create a label for the vertex checkbox
        let vertexLabel = document.createElement("label");
        vertexLabel.htmlFor = vertexCheckbox.id;
        vertexLabel.textContent = `Vertex ${vertexIndex + 1}`;

        // Append the vertex checkbox and label to the container
        container.appendChild(vertexCheckbox);
        container.appendChild(vertexLabel);
        container.appendChild(document.createElement("br"));

        // Event listener to shape checkbox
        shapeCheckbox.addEventListener("change", function () {
          vertexCheckbox.checked = shapeCheckbox.checked;
        });

        // Event listener to vertex checkbox
        vertexCheckbox.addEventListener("change", function () {
          if (!vertexCheckbox.checked) {
            shapeCheckbox.checked = false;
          }
        });
      });

      // Separator between shapes
      container.appendChild(document.createElement("hr"));
    });
  }
};

const editObject = (shapes) => {
  let container = document.getElementById("shape-data-container");

  let checkboxes = container.getElementsByTagName("input");

  // Object to store the checked vertices for each shape
  let checkedVertices = {};

  // Loop over each checkbox
  for (let checkbox of checkboxes) {
    if (checkbox.checked) {
      // Extract the shape id, shape index, and vertex index from the checkbox id
      let [shapeId, shapeName, _, __, vertexIndex] = checkbox.id.split("-");

      // If the checkbox is for a vertex
      if (vertexIndex !== undefined) {
        // Add the vertex index to the checkedVertices
        let shapeKey = `${shapeId}-${shapeName}-${vertexIndex}`;
        if (!checkedVertices[shapeKey]) {
          checkedVertices[shapeKey] = [];
        }
        checkedVertices[shapeKey].push(vertexIndex);
      }
    }
  }

  /**
   * NOTE: Every new node created is to remove the previous existing event listeners.
   */
  /**
   * X Translation
   */
  let translateXSlider = document.getElementById("translate-x");

  let newXSlider = translateXSlider.cloneNode(true);
  translateXSlider.parentNode.replaceChild(newXSlider, translateXSlider);

  let initX = 0;

  newXSlider.addEventListener("input", () => {
    // check global variable `isEditing` if still editing
    if (!isEditing) return;

    // Loop over each shape in checkedVertices and apply the X translation
    for (let shapeKey in checkedVertices) {
      let [shapeId, shapeName, vertexIndex] = shapeKey.split("-");

      let shape = shapes[shapeName.toLowerCase()].find(
        (shape) => shape.id == shapeId
      );

      shape.translateVertex(
        vertexIndex,
        parseFloat(newXSlider.value) - initX,
        0
      );
    }
    initX = parseFloat(newXSlider.value);
  });

  /**
   * Y Translation
   */
  let translateYSlider = document.getElementById("translate-y");

  let newYSlider = translateYSlider.cloneNode(true);
  translateYSlider.parentNode.replaceChild(newYSlider, translateYSlider);

  let initY = 0;

  newYSlider.addEventListener("input", () => {
    // check global variable `isEditing` if still editing
    if (!isEditing) return;

    // Loop over each shape in checkedVertices and apply the Y translation
    for (let shapeKey in checkedVertices) {
      let [shapeId, shapeName, vertexIndex] = shapeKey.split("-");

      let shape = shapes[shapeName.toLowerCase()].find(
        (shape) => shape.id == shapeId
      );

      shape.translateVertex(
        vertexIndex,
        0,
        parseFloat(newYSlider.value) - initY
      );
    }
    initY = parseFloat(newYSlider.value);
  });

  /**
   * Scale Transformation
   */
  let scaleSlider = document.getElementById("scale");

  let newScaleSlider = scaleSlider.cloneNode(true);
  scaleSlider.parentNode.replaceChild(newScaleSlider, scaleSlider);

  let initScale = 1;

  newScaleSlider.addEventListener("input", () => {
    // check global variable `isEditing` if still editing
    if (!isEditing) return;

    // Loop over each shape in checkedVertices and apply the Y translation
    for (let shapeKey in checkedVertices) {
      let [shapeId, shapeName, _] = shapeKey.split("-");

      let shape = shapes[shapeName.toLowerCase()].find(
        (shape) => shape.id == shapeId
      );

      shape.scaleShape(parseFloat(newScaleSlider.value), initScale);
    }
    initScale = parseFloat(newScaleSlider.value);
  });

  /**
   * Change color
   * */
  let colorInput = document.getElementById("color");

  let newColorInput = colorInput.cloneNode(true);
  colorInput.parentNode.replaceChild(newColorInput, colorInput);
  newColorInput.addEventListener("input", () => {
    // check global variable `isEditing` if still editing
    if (!isEditing) {
      return;
    }

    for (let shapeKey in checkedVertices) {
      let [shapeId, shapeName, vertexIndex] = shapeKey.split("-");

      let shape = shapes[shapeName.toLowerCase()].find(
        (shape) => shape.id == shapeId
      );

      shape.setColor(vertexIndex, newColorInput.value);
    }
  });
};

const resetAllCheckboxes = () => {
  let container = document.getElementById("shape-data-container");
  let checkboxes = container.getElementsByTagName("input");

  for (let checkbox of checkboxes) {
    if (checkbox.checked) {
      checkbox.checked = false;
    }
  }
};
