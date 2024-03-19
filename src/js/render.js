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
  baseRender(gl, program, arrData, arrSize, "a_position");
};

const renderColor = (program, arrData = [], arrSize = 3) => {
  baseRender(gl, program, arrData, arrSize, "vertColor");
};
