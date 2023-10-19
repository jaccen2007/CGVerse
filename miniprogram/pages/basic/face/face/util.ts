const color = 'aqua';

export const drawPoint = (ctx: WechatMiniprogram.CanvasContext, y: number, x: number, r: number, color: string) => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
};

/**
 * Draw pose keypoints onto a canvas
 */
// tslint:disable-next-line:no-any
export const drawKeypoints = (keypoints: [number, number, number][], ctx: WechatMiniprogram.CanvasContext, scale = 1) => {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    const [x, y, _] = keypoint;
    drawPoint(ctx, y * scale, x * scale, 1, color);
  }
};

export const drawKeyAreaByPoints = (keypoints: [number, number, number][], ctx: WechatMiniprogram.CanvasContext, color = 'red') => {
  ctx.moveTo(keypoints[0][0], keypoints[0][1]);
  for (let i = 1; i < keypoints.length; i++) {
    const keypoint = keypoints[i];
    const [x, y, _] = keypoint;
    ctx.lineTo(x, y);
  }
  ctx.setFillStyle(color);
  ctx.fill();
};
export const getFrameSliceOptions = (frameWidth: number, frameHeight: number, displayWidth: number, displayHeight: number) => {
  let result = {
    start: [0, 0, 0],
    size: [-1, -1, 3]
  };

  const ratio = displayHeight / displayWidth;

  if (ratio > frameHeight / frameWidth) {
    result.start = [0, Math.ceil((frameWidth - Math.ceil(frameHeight / ratio)) / 2), 0];
    result.size = [-1, Math.ceil(frameHeight / ratio), 3];
  } else {
    result.start = [Math.ceil((frameHeight - Math.floor(ratio * frameWidth)) / 2), 0, 0];
    result.size = [Math.ceil(ratio * frameWidth), -1, 3];
  }

  return result;
};