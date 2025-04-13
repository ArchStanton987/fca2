/* eslint-disable import/prefer-default-export */
export function isKeyOf<T extends object, K extends PropertyKey>(
  key: K,
  obj: T
): key is K & keyof T {
  return key in obj
}
