/* eslint-disable import/prefer-default-export */
import * as Haptics from "expo-haptics"
import { Weapon, WeaponActionId, WeaponTagId } from "lib/objects/data/weapons/weapons.types"

const getBurstInterval = (weapon: Weapon) => {
  const burstTags = [
    { tagId: "pistolet mitrailleur", delay: 150 },
    { tagId: "fusil à pompe", delay: 600 },
    { tagId: "mitrailleuse", delay: 200 },
    { tagId: "fusil d'assault", delay: 200 },
    { tagId: "mitrailleuse lourde", delay: 250 },
    { tagId: "minigun", delay: 30 }
  ]
  const defaultDelay = 200
  const weaponTags = weapon.data.tags
  const delay = burstTags.find(tag => weaponTags.includes(tag.tagId as WeaponTagId))?.delay
  return delay || defaultDelay
}

const basicHaptic = async () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
const burstHaptic = async (weapon: Weapon) => {
  const delay = getBurstInterval(weapon)
  const shots = weapon.data.ammoPerBurst || 3
  const t = new Array(shots)
  for (let i = 0; i < shots; i += 1) {
    t[i] = setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), i * delay)
  }
  // cleanup
  return () => t.forEach(clearTimeout)
}
const loadHaptic = async () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
const unloadHaptic = async () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)

export const getHapticSequence = async (actionId: WeaponActionId, weapon: Weapon) => {
  switch (actionId) {
    case "basic":
      return basicHaptic()
    case "aim":
      return basicHaptic()
    case "burst":
      return burstHaptic(weapon)
    case "load":
      return loadHaptic()
    case "unload":
      return unloadHaptic()
    default:
      return null
  }
}
