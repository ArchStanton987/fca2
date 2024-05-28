import Character from "lib/character/Character"
import { Weapon } from "lib/objects/data/weapons/weapons.types"

/**
 * Returns a random integer number between min (inclusive) and max (exclusive)
 */
export const getRandomArbitrary = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min) + min)

/**
 * Get the average damage of a weapon
 */
export const getAverageDamage = (character: Character, weapon: Weapon): number => {
  const { damageBasic, damageBurst } = weapon.data
  if (!damageBasic && !damageBurst) return 0
  const refDamage = (damageBasic || damageBurst) as string
  const sections = refDamage.split("+")
  const sum = sections.reduce((acc, section) => {
    if (section === "DM") return acc + character.secAttr.curr.meleeDamage
    // regex that matches a number followed by a 'D' followed by another number
    if (section.includes("D")) {
      const [nDices, faces] = section.split("D").map(Number)
      return acc + nDices * faces
    }
    return acc + Number(section)
  }, 0)
  return sum
}
