/**
 * @brief clamp a value between two values:
 * if      v is less than min, return min
 * else if v is more than max, return max
 * else return v
 * @param {Number} v value
 * @param {Number} min minimum value
 * @param {Number} max maximum value
 * @returns {Number} clamped value
 */
export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/**
 * @brief linear interpolation of a value between two values
 * @param {Number} v value
 * @param {Number} min output min (output can be less than min if v is less than vMin)
 * @param {Number} max output max (output can be more than max if v is more than vMax)
 * @param {Number} vMin value theoretical minimum
 * @param {Number} vMax value theoretical maximum
 * @returns {Number} linearly interpolated value
 */
export const linear = (v, min = 0, max = 1, vMin = 0, vMax = 1) => min + (max - min) * (v - vMin) / (vMax - vMin);

/**
 * @brief linear interpolation
 * @param {Number} v value
 * @param {Number} min minimum value
 * @param {Number} max maximum value
 * @returns {Number} linearly interpolated value
 */
export const lerp = (v, min = 0, max = 1) => min + (max - min) * v;

/**
 * @brief ease interpolation
 * @param {Number} v value
 * @returns {Number} eased value
 * @see https://easings.net/#easeInCubic
 * @note can be combinated with lerp for min-max
 */
export const easeInCubic = v => v**2;

/**
 * @brief ease out elastic interpolation
 * @param {Number} v value
 * @returns {Number} eased value
 * @see https://easings.net/#easeOutElastic
 * @note can be combinated with lerp for min-max
 */
export const easeOutElastic = v => v < 0 ? 0 : v > 1 ? 1 : Math.pow(2, -10 * v) * Math.sin((v * 10 - 0.75) * (2 * Math.PI) / 3) + 1;

