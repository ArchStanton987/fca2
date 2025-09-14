import { useState } from "react"
import { Pressable, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"

import { Image } from "expo-image"
import Character from "lib/character/Character"
import secAttrMap from "lib/character/abilities/sec-attr/sec-attr"
import {
  getCanBasicUseFirearm,
  getCanLoad,
  getCanShootBurst,
  getCanUnload,
  getHasStrengthMalus
} from "lib/objects/data/weapons/weapons-utils"
import { Weapon } from "lib/objects/data/weapons/weapons.types"

import unarmedImg from "assets/images/unarmed.png"
import Row from "components/Row"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import { useActionApi } from "providers/ActionProvider"
import { useCombatStatus } from "providers/CombatStatusProvider"
import { useContenders } from "providers/ContendersProvider"
import { useInventories } from "providers/InventoriesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import AmmoIndicator from "screens/CombatScreen/AmmoIndicator"
import PlayButton from "screens/CombatScreen/slides/PlayButton"
import colors from "styles/colors"
import layout from "styles/layout"

type WeaponIndicatorProps = {
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
}
type CombatWeaponIndicatorProps = WeaponIndicatorProps & { contenderId: string }
type NoCombatWeaponIndicatorProps = WeaponIndicatorProps
type WeaponInfoUiProps = { weapon: Weapon; isHuman: boolean; hasMalus: boolean }

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

function WeaponActions({ weapon }: { weapon: Weapon }) {
  const useCases = useGetUseCases()
  const character = useCharacter()
  const maxAp = character.secAttr.curr.actionPoints
  const { currAp } = useCombatStatus()

  const [selectedAction, setSelectedAction] = useState("")

  const select = (id: string) => {
    setSelectedAction(prev => (prev === id ? "" : id))
  }

  const canShoot = getCanBasicUseFirearm(weapon)
  const canShootBurst = getCanShootBurst(weapon, currAp, maxAp)
  const canLoad = getCanLoad(weapon, currAp)
  const canUnload = getCanUnload(weapon, currAp)

  return (
    <ScrollSection title="actions" style={{ flex: 1 }}>
      {canShoot ? (
        <WeaponAction
          title="TIRER"
          select={select}
          isSelected={selectedAction === "TIRER"}
          doAction={() => useCases.weapons.use(character, weapon, "basic")}
        />
      ) : null}
      {canShootBurst ? (
        <WeaponAction
          title="TIRER (rafale)"
          isSelected={selectedAction === "TIRER (rafale)"}
          select={select}
          doAction={() => useCases.weapons.use(character, weapon, "burst")}
        />
      ) : null}
      {canLoad ? (
        <WeaponAction
          title="RECHARGER"
          isSelected={selectedAction === "RECHARGER"}
          select={select}
          doAction={() => useCases.weapons.load(character, weapon)}
        />
      ) : null}
      {canUnload ? (
        <WeaponAction
          title="DECHARGER"
          isSelected={selectedAction === "DECHARGER"}
          select={select}
          doAction={() => useCases.weapons.unload(character, weapon)}
        />
      ) : null}
    </ScrollSection>
  )
}

function WeaponInfoUi({ weapon, isHuman, hasMalus }: WeaponInfoUiProps) {
  return (
    <>
      <Row style={{ alignItems: "center", justifyContent: "center" }}>
        <Image
          source={weapon.id === "unarmed" ? unarmedImg : { uri: weapon.data.img }}
          style={{ height: 70, width: 70 }}
          contentFit="contain"
        />
        <Spacer x={15} />
        <AmmoIndicator weapon={weapon} />
      </Row>

      <Spacer y={10} />

      <View style={{ alignSelf: "center" }}>
        {!isHuman ? <Txt>{weapon.data.label}</Txt> : null}
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
          <Txt style={hasMalus && styles.malus}>{weapon.skill}</Txt>
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

function NoCombatWeaponIndicator({ style, contentContainerStyle }: NoCombatWeaponIndicatorProps) {
  const character = useCharacter()
  const { equipedObjects, unarmed } = character
  const weapons = equipedObjects.weapons.length > 0 ? equipedObjects.weapons : [unarmed]

  const inv = useInventory()

  const [selectedWeapon, setSelectedWeapon] = useState(() => weapons[0].dbKey)

  const weaponIndex = weapons.findIndex(w => w.dbKey === selectedWeapon)
  const wepaonDisplayIndex = weaponIndex + 1

  const toggleWeapon = () => {
    if (weapons.length < 2) return
    const nextIndex = (weaponIndex + 1) % weapons.length
    const { dbKey } = weapons[nextIndex]
    setSelectedWeapon(dbKey)
  }

  let weapon = character.unarmed
  const isHuman = character instanceof Character
  if (selectedWeapon) {
    weapon = isHuman
      ? inv.weaponsRecord[selectedWeapon] ?? character.unarmed
      : character.equipedObjectsRecord.weapons[selectedWeapon]
  }

  if (!weapon) return null

  const hasMalus = getHasStrengthMalus(weapon, character.special.curr)

  return (
    <>
      <WeaponActions weapon={weapon} />

      <Spacer x={layout.globalPadding} />
      <Section
        title={weapons.length > 1 ? `arme ${wepaonDisplayIndex} / ${weapons.length}` : "arme"}
        style={[{ width: 160 }, style]}
        contentContainerStyle={[{ justifyContent: "center", flex: 1 }, contentContainerStyle]}
      >
        <Pressable key={selectedWeapon} onPress={toggleWeapon} disabled={weapons.length < 2}>
          <WeaponInfoUi weapon={weapon} hasMalus={hasMalus} isHuman={isHuman} />
        </Pressable>
      </Section>
    </>
  )
}

function CombatWeaponIndicator({
  contenderId,
  style,
  contentContainerStyle
}: CombatWeaponIndicatorProps) {
  const { setForm } = useActionApi()

  const character = useContenders(contenderId)
  const { equipedObjects, unarmed } = character
  const weapons = equipedObjects.weapons.length > 0 ? equipedObjects.weapons : [unarmed]

  const inv = useInventories(contenderId)

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

  let weapon = character.unarmed
  const isHuman = character instanceof Character
  if (selectedWeapon) {
    weapon = isHuman
      ? inv.weaponsRecord[selectedWeapon] ?? character.unarmed
      : character.equipedObjectsRecord.weapons[selectedWeapon]
  }

  if (!weapon) return null

  const hasMalus = getHasStrengthMalus(weapon, character.special.curr)

  return (
    <Section
      title={weapons.length > 1 ? `arme ${wepaonDisplayIndex} / ${weapons.length}` : "arme"}
      style={[{ width: 160 }, style]}
      contentContainerStyle={[{ justifyContent: "center", flex: 1 }, contentContainerStyle]}
    >
      <Pressable key={selectedWeapon} onPress={toggleWeapon} disabled={weapons.length < 2}>
        <WeaponInfoUi weapon={weapon} hasMalus={hasMalus} isHuman={isHuman} />
      </Pressable>
    </Section>
  )
}

export default function WeaponIndicator({
  contenderId,
  style,
  contentContainerStyle
}: {
  contenderId?: string
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
}) {
  if (contenderId)
    return (
      <CombatWeaponIndicator
        contenderId={contenderId}
        style={style}
        contentContainerStyle={contentContainerStyle}
      />
    )
  return <NoCombatWeaponIndicator style={style} contentContainerStyle={contentContainerStyle} />
}
