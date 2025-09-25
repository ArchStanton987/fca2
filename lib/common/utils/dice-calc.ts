import Abilities from "lib/character/abilities/Abilities"
import Weapon from "lib/objects/data/weapons/Weapon"

/**
 * Returns a random integer number between min (inclusive) and max (exclusive)
 */
export const getRandomArbitrary = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min) + min)

/**
 * Get the average damage of a weapon
 */
export const getDamageEst = (secAttr: Abilities["secAttr"], weapon: Weapon): number => {
  const { damageBasic, damageBurst } = weapon.data
  if (!damageBasic && !damageBurst) return 0
  const refDamage = (damageBurst || damageBasic) as string
  const sections = refDamage.split("+")
  const sum = sections.reduce((acc, section) => {
    if (section === "DM") return acc + secAttr.curr.meleeDamage
    if (section.includes("D")) {
      const [nDices, faces] = section.split("D").map(Number)
      return acc + nDices * (faces / 2)
    }
    return acc + Number(section)
  }, 0)
  return sum
}
