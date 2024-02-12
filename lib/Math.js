// Matha is a temporary name else *Cannot access 'Math' before initialization*
const Matha = Math || {};

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
Matha.clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/**
 * @brief linear interpolation of a value between two values
 * @param {Number} v value
 * @param {Number} min output min (output can be less than min if v is less than vMin)
 * @param {Number} max output max (output can be more than max if v is more than vMax)
 * @param {Number} vMin value theoretical minimum
 * @param {Number} vMax value theoretical maximum
 * @returns {Number} linearly interpolated value
 */
Matha.linear = (v, min = 0, max = 1, vMin = 0, vMax = 1) => min + (max - min) * (v - vMin) / (vMax - vMin);

/**
 * @brief linear interpolation
 * @param {Number} v value
 * @param {Number} min minimum value
 * @param {Number} max maximum value
 * @returns {Number} linearly interpolated value
 */
Matha.lerp = (v, min, max) => min + (max - min) * v;

/**
 * @brief ease interpolation
 * @param {Number} v value
 * @returns {Number} eased value
 * @see https://easings.net/#easeInCubic
 * @note can be combinated with lerp for min-max
 */
Matha.easeInCubic = v => v**2;

export { Matha as Math };
