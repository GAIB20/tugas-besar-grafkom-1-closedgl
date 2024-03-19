const convertToWGLCoordinate = (canvas, x, y) => {
  const position = canvas.getBoundingClientRect();
  const [w, h] = [position.width, position.height];

  /* Normalize x and y to [-1, 1], with y inverted */
  const wglWidth = (x / w) * 2 - 1;
  const wglHeight = (y / h) * -2 + 1;

  return [wglWidth, wglHeight];
};

const parseRGB = (rgb) => {
  //convert rgb to 0 to 1 form
  const r = parseInt(rgb.substr(1, 2), 16) / 255;
  const g = parseInt(rgb.substr(3, 2), 16) / 255;
  const b = parseInt(rgb.substr(5, 2), 16) / 255;

  return { r, g, b };
};
