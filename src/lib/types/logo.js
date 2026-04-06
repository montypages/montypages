
/** @typedef {'idle' | 'active' | 'success'} FormState */

/**
 * @typedef {'urlbar' | 'circle' | 'red' | 'teal'} ShapeId
 */

/**
 * @typedef {Object} SpringTarget
 * @property {number} x
 * @property {number} y
 * @property {number} scale
 * @property {number} rotate
 */

/**
 * @typedef {Record<ShapeId, SpringTarget>} SectionAnchors
 */

/**
 * @typedef {Object} ShapeDimensions
 * @property {number} w - Width in px
 * @property {number} h - Height in px
 */

/** @type {Record<ShapeId, ShapeDimensions>} */
export const SHAPE_DIMS = {
  urlbar: { w: 65,  h: 9  },
  circle: { w: 26,  h: 26 },
  red:    { w: 38,  h: 23 },
  teal:   { w: 38,  h: 23 },
};

/**
 * Returns responsive width based on viewport width
 * @param {number} shapeDim 
 * @returns {string}
 */
export function calcDim(shapeDim) {
  const min = (shapeDim * 0.875).toFixed(2);
  const max = (shapeDim * 1.75).toFixed(2);
  const preferred = (shapeDim * 0.18).toFixed(4); // vw factor — tune this
  return `clamp(${min}px, ${preferred}vw, ${max}px)`;
};

/**
 * Returns a scaled px dimension based on current viewport width.
 * Use this for anchor position calculations, not for CSS.
 * @param {number} shapeDim - Base dimension in px
 * @param {number} viewportWidth - Current window.innerWidth
 * @returns {number}
 */
export function scaleDim(shapeDim, viewportWidth) {
  const scale = Math.min(Math.max(viewportWidth / 1280, 0.875), 1.25);
  return shapeDim * scale;
}

export {};