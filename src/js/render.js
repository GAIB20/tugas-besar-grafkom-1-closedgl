const createShader = (shaderType, shaderText) => {
  let shader = gl.createShader(shaderType);

  gl.shaderSource(shader, shaderText);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "err: ",
      gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

function createProgram(vertexShaderText, fragmentShaderText) {
  const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderText);
  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderText);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("err: ", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return;
  }

  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error("err: ", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return;
  }

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return program;
}

const baseRender = (
  gl,
  shaderProgram,
  arrData = [],
  arrSize = 3,
  attribute = "a_position",
  dataType = gl.FLOAT,
  normalized = gl.FALSE
) => {
  const attrLoc = gl.getAttribLocation(shaderProgram, attribute);
  const buffer = gl.createBuffer();
  const stride = 0;
  const offset = 0;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrData), gl.STATIC_DRAW);

  gl.useProgram(shaderProgram);
  gl.enableVertexAttribArray(attrLoc);
  gl.vertexAttribPointer(
    attrLoc,
    arrSize,
    dataType,
    normalized,
    stride,
    offset
  );
};

const renderVertex = (program, arrData = [], arrSize = 3) => {
  if (!gl) alert("WebGL not supported")
  baseRender(gl, program, arrData, arrSize, "a_position");
};

const renderColor = (program, arrData = [], arrSize = 3) => {
  if (!gl) alert("WebGL not supported")
  baseRender(gl, program, arrData, arrSize, "vertColor");
};

/**
 * Draw a new shape based on given shapeType and push it to currShapes
 * */
const drawShape = (currShapes, shapeType, x, y) => {
  switch (shapeType) {
    case SHAPE.LINE:
      currShapes.line.push(new Line(x, y));
      break;

    default:
      break;
  }
};

const clearCanvas = () => {
  if (!gl) alert("WebGL not supported");
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};
