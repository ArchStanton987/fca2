import { useState } from "react"
import { Pressable, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"

import { Image } from "expo-image"
import { useAbilities } from "lib/character/abilities/abilities-provider"
import secAttrMap from "lib/character/abilities/sec-attr/sec-attr"
import { useCombatStatus } from "lib/character/combat-status/combat-status-provider"
import { useAmmo, useCombatWeapons, useItem } from "lib/inventory/use-sub-inv-cat"
import Weapon from "lib/objects/data/weapons/Weapon"
import {
  getCanBasicUseFirearm,
  getCanLoad,
  getCanShootBurst,
  getCanUnload,
  getHasStrengthMalus
} from "lib/objects/data/weapons/weapons-utils"

import unarmedImg from "assets/images/unarmed.png"
import Row from "components/Row"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useActionApi } from "providers/ActionFormProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import AmmoIndicator from "screens/CombatScreen/AmmoIndicator"
import PlayButton from "screens/CombatScreen/slides/PlayButton"
import colors from "styles/colors"
import layout from "styles/layout"

type WeaponInfoUiProps = { charId: string; weaponKey: Weapon["dbKey"] }

const styles = StyleSheet.create({
  attr: {
    width: 30
  },
  malus: {
    color: colors.yellow
  },
  actionButton: {
    padding: 10,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  selected: {
    backgroundColor: colors.terColor
  }
})

function WeaponAction({
  title,
  doAction,
  select,
  isSelected
}: {
  title: string
  doAction: () => void
  select: (id: string) => void
  isSelected: boolean
}) {
  return (
    <TouchableOpacity
      onPress={() => select(title)}
      style={[styles.actionButton, isSelected && styles.selected]}
    >
      <Txt>{title}</Txt>
      {isSelected ? <PlayButton onPress={doAction} /> : null}
    </TouchableOpacity>
  )
}

function WeaponActions({ weaponKey, charId }: { weaponKey: string; charId: string }) {
  const useCases = useGetUseCases()
  const { data: maxAp } = useAbilities(charId, a => a.secAttr.curr.actionPoints)
  const { data: currAp } = useCombatStatus(charId, cs => cs.currAp)
  const { data: weapon } = useItem(charId, weaponKey)
  const { data: ammo } = useAmmo(charId)

  const [selectedAction, setSelectedAction] = useState("")

  const select = (id: string) => {
    setSelectedAction(prev => (prev === id ? "" : id))
  }

  if (weapon.category !== "weapons") throw new Error("Item is not a weapon")

  const canShoot = getCanBasicUseFirearm(weapon)
  const canShootBurst = getCanShootBurst(weapon, { currAp, maxAp })
  const canLoad = getCanLoad(weapon, { currAp }, ammo)
  const canUnload = getCanUnload(weapon, { currAp })

  return (
    <ScrollSection title="actions" style={{ flex: 1 }}>
      {canShoot ? (
        <WeaponAction
          title="TIRER"
          select={select}
          isSelected={selectedAction === "TIRER"}
          doAction={() => useCases.weapons.useWeapon({ charId, weapon, actionId: "basic" })}
        />
      ) : null}
      {canShootBurst ? (
        <WeaponAction
          title="TIRER (rafale)"
          isSelected={selectedAction === "TIRER (rafale)"}
          select={select}
          doAction={() => useCases.weapons.useWeapon({ charId, weapon, actionId: "burst" })}
        />
      ) : null}
      {canLoad ? (
        <WeaponAction
          title="RECHARGER"
          isSelected={selectedAction === "RECHARGER"}
          select={select}
          doAction={() => useCases.weapons.load({ charId, weapon })}
        />
      ) : null}
      {canUnload ? (
        <WeaponAction
          title="DECHARGER"
          isSelected={selectedAction === "DECHARGER"}
          select={select}
          doAction={() => useCases.weapons.unload({ charId, weapon })}
        />
      ) : null}
    </ScrollSection>
  )
}

function WeaponInfoUi({ charId, weaponKey }: WeaponInfoUiProps) {
  const { data: abilities } = useAbilities(charId)
  const { data: weapon } = useItem(charId, weaponKey)
  const hasMalus = getHasStrengthMalus(weapon, abilities.special.curr)
  if (weapon.category !== "weapons") throw new Error("Item is not a weapon")
  return (
    <>
      <Row style={{ alignItems: "center", justifyContent: "center" }}>
        <Image
          source={weapon.id === "unarmed" ? unarmedImg : { uri: weapon.data.img }}
          style={{ height: 70, width: 70 }}
          contentFit="contain"
        />
        <Spacer x={15} />
        <AmmoIndicator charId={charId} weaponKey={weaponKey} />
      </Row>

      <Spacer y={10} />

      <View style={{ alignSelf: "center" }}>
        <Txt>{weapon.data.label}</Txt>
        <Row>
          <Txt style={styles.attr}>DEG</Txt>
          <Spacer x={10} />
          <Txt>{weapon.data.damageBasic}</Txt>
        </Row>
        {weapon.data.damageBurst && (
          <Row>
            <Txt style={[styles.attr, { color: colors.primColor }]}>DEG</Txt>
            <Spacer x={10} />
            <Txt>{weapon.data.damageBurst}</Txt>
          </Row>
        )}
        <Row>
          <Txt style={[styles.attr, hasMalus && styles.malus]}>COMP</Txt>
          <Spacer x={10} />
          <Txt style={hasMalus && styles.malus}>{weapon.getSkillScore(abilities)}</Txt>
        </Row>
        {weapon.data.range && (
          <Row>
            <Txt style={styles.attr}>POR</Txt>
            <Spacer x={10} />
            <Txt>
              {weapon.data.range}
              {secAttrMap.range.unit}
            </Txt>
          </Row>
        )}
      </View>
    </>
  )
}

export function NoCombatWeaponIndicator({
  charId,
  style,
  contentContainerStyle,
  withActions
}: {
  charId: string
  withActions: boolean
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
}) {
  const weapons = useCombatWeapons(charId)
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
    <>
      {withActions ? (
        <>
          <WeaponActions charId={charId} weaponKey={selectedWeapon} />
          <Spacer x={layout.globalPadding} />
        </>
      ) : null}

      <Section
        title={weapons.length > 1 ? `arme ${wepaonDisplayIndex} / ${weapons.length}` : "arme"}
        style={[{ width: 175 }, style]}
        contentContainerStyle={[{ justifyContent: "center", flex: 1 }, contentContainerStyle]}
      >
        <Pressable key={selectedWeapon} onPress={toggleWeapon} disabled={weapons.length < 2}>
          <WeaponInfoUi charId={charId} weaponKey={selectedWeapon} />
        </Pressable>
      </Section>
    </>
  )
}

export function CombatWeaponIndicator({
  contenderId,
  style,
  contentContainerStyle
}: {
  contenderId: string
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
}) {
  const { setForm } = useActionApi()

  const weapons = useCombatWeapons(contenderId)
  const [selectedWeapon, setSelectedWeapon] = useState(() => weapons[0].dbKey)

  const weaponIndex = weapons.findIndex(w => w.dbKey === selectedWeapon)
  const wepaonDisplayIndex = weaponIndex + 1

  const toggleWeapon = () => {
    if (weapons.length < 2) return
    const nextIndex = (weaponIndex + 1) % weapons.length
    const { dbKey } = weapons[nextIndex]
    setSelectedWeapon(dbKey)
    setForm({ itemDbKey: dbKey, apCost: 0, actionSubtype: undefined })
  }

  return (
    <Section
      title={weapons.length > 1 ? `arme ${wepaonDisplayIndex} / ${weapons.length}` : "arme"}
      style={[{ width: 175 }, style]}
      contentContainerStyle={[{ justifyContent: "center", flex: 1 }, contentContainerStyle]}
    >
      <Pressable key={selectedWeapon} onPress={toggleWeapon} disabled={weapons.length < 2}>
        <WeaponInfoUi charId={contenderId} weaponKey={selectedWeapon} />
      </Pressable>
    </Section>
  )
}
