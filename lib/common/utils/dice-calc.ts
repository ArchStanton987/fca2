/* eslint-disable import/prefer-default-export */
/**
 * Returns a random integer number between min (inclusive) and max (exclusive)
 */
export const getRandomArbitrary = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min) + min)
