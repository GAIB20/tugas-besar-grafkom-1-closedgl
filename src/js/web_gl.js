let fragmentShader2DSrc = `
    precision highp float;

    void main() {
    gl_FragColor = vec4(1, 0, 0.5, 1); // mengembalikan warna ungu kemerahan
    }
`;

let vertexShader2DSrc = `
 attribute vec4 a_position;

 void main() {
 gl_Position = a_position;
}
`;

const createShader = (gl, type, source) => {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
};

const createProgram = (gl, vertexShader, fragmentShader) => {
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
};

window.onload = () => {
  let canvas = document.querySelector("#c");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    console.error("webgl not found");
  }

  let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShader2DSrc);
  let fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShader2DSrc
  );

  let program = createProgram(gl, vertexShader, fragmentShader);
  let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  let positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  let positions = [
        -0.2, -0.2,
        0, 0.2,
        0.2, -0.2
    ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};
