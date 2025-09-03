import { useState } from "react"
import { Pressable, StyleProp, ViewStyle } from "react-native"

import Section from "components/Section"
import { useCharacter } from "contexts/CharacterContext"
import WeaponInfo from "screens/CombatScreen/slides/WeaponInfo"

type WeaponIndicatorProps = {
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
}

export default function WeaponIndicator({ style, contentContainerStyle }: WeaponIndicatorProps) {
  const { equipedObjects, unarmed } = useCharacter()
  const weapons = equipedObjects.weapons.length > 0 ? equipedObjects.weapons : [unarmed]

  const [selectedWeapon, setSelectedWeapon] = useState(() => weapons[0].dbKey)

  const weaponIndex = weapons.findIndex(w => w.dbKey === selectedWeapon)
  const wepaonDisplayIndex = weaponIndex + 1

  const toggleWeapon = () => {
    if (weapons.length < 2) return
    const nextIndex = (weaponIndex + 1) % weapons.length
    const { dbKey } = weapons[nextIndex]
    setSelectedWeapon(dbKey)
  }
  return (
    <Section
      title={weapons.length > 1 ? `arme ${wepaonDisplayIndex} / ${weapons.length}` : "arme"}
      style={[{ width: 160 }, style]}
      contentContainerStyle={[{ justifyContent: "center", flex: 1 }, contentContainerStyle]}
    >
      <Pressable key={selectedWeapon} onPress={toggleWeapon} disabled={weapons.length < 2}>
        <WeaponInfo selectedWeapon={selectedWeapon} />
      </Pressable>
    </Section>
  )
}
