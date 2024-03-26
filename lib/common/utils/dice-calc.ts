/* eslint-disable import/prefer-default-export */
/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export const getRandomArbitrary = (min: number, max: number) => Math.random() * (max - min) + min
