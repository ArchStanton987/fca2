import React, { useState } from "react"
import { Image, TouchableOpacity, View } from "react-native"

import AntDesign from "@expo/vector-icons/AntDesign"
import * as Haptics from "expo-haptics"
import secAttrMap from "lib/character/abilities/sec-attr/sec-attr"
import useCases from "lib/common/use-cases"
import {
  getApCost,
  getAvailableWeaponActions,
  getHasStrengthMalus
} from "lib/objects/data/weapons/weapons-utils"
import { Weapon, WeaponActionId, WeaponTagId } from "lib/objects/data/weapons/weapons.types"

import List from "components/List"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import SmallLine from "components/draws/Line/Line"
import { useCharacter } from "contexts/CharacterContext"
import colors from "styles/colors"

import AmmoIndicator from "./AmmoIndicator"
import styles from "./WeaponCard.styles"
import { WeaponAction, weaponActionMap } from "./WeaponCard.utils"

type WeaponCardProps = { weapon: Weapon; setPrevAp: (apCost: number) => void }

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

const getHapticSequence = async (actionId: WeaponActionId, weapon: Weapon) => {
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

export default function WeaponCard({ weapon, setPrevAp }: WeaponCardProps) {
  const char = useCharacter()

  const [selectedAction, setSelectedAction] = useState<WeaponAction | null>(null)

  const selectAction = (action: WeaponAction) => {
    if (selectedAction?.id === action.id) {
      setSelectedAction(null)
      setPrevAp(char.status.currAp)
    } else {
      setSelectedAction(action)
      const apCost = getApCost(weapon, char, action.actionId)
      setPrevAp(char.status.currAp - apCost)
    }
  }

  const hasMalus = getHasStrengthMalus(weapon, char.special.curr)

  const doAction = async (apCostOverride: number | undefined = undefined) => {
    if (!selectedAction) return
    setSelectedAction(null)
    switch (selectedAction.id) {
      case "load":
        await useCases.weapons.load(char, weapon, apCostOverride)
        break
      case "unload":
        await useCases.weapons.unload(char, weapon, apCostOverride)
        break
      default:
        await useCases.weapons.use(char, weapon, selectedAction.actionId, apCostOverride)
        break
    }
    setPrevAp(char.status.currAp)
    await getHapticSequence(selectedAction.actionId, weapon)
  }

  const actions = getAvailableWeaponActions(weapon, char)

  return (
    <View style={{ flexDirection: "row" }}>
      <View style={styles.cardContainer}>
        <View style={styles.horizBar} />
        <SmallLine top right />
        <Spacer y={10} />
        <Txt style={{ paddingRight: 10 }}>{weapon.data.label}</Txt>
        <Spacer y={10} />
        <View style={styles.row}>
          <View style={styles.imgContainer}>
            <Image
              source={{ uri: weapon.data.img }}
              style={{ height: 50, width: 50 }}
              resizeMode="contain"
            />
          </View>
          <Spacer x={10} />
          <View style={{ flex: 1 }}>
            <View style={styles.row}>
              <Txt style={styles.attr}>DEG</Txt>
              <Spacer x={10} />
              <Txt>{weapon.data.damageBasic}</Txt>
            </View>
            {weapon.data.damageBurst && (
              <View style={styles.row}>
                <Txt style={[styles.attr, { color: colors.primColor }]}>DEG</Txt>
                <Spacer x={10} />
                <Txt>{weapon.data.damageBurst}</Txt>
              </View>
            )}
            <View style={styles.row}>
              <Txt style={[styles.attr, hasMalus && styles.malus]}>COMP</Txt>
              <Spacer x={10} />
              <Txt style={hasMalus && styles.malus}>{weapon.skill}</Txt>
            </View>
            {weapon.data.range && (
              <View style={styles.row}>
                <Txt style={styles.attr}>POR</Txt>
                <Spacer x={10} />
                <Txt>
                  {weapon.data.range}
                  {secAttrMap.range.unit}
                </Txt>
              </View>
            )}
          </View>
          <Spacer x={20} />
          <AmmoIndicator weapon={weapon} />
          <Spacer x={5} />
        </View>
      </View>

      <Spacer x={20} />

      <View style={styles.actionsContainer}>
        <List
          data={actions}
          keyExtractor={item => item}
          separator={<Spacer y={10} />}
          renderItem={({ item }) => {
            const isSelected = selectedAction?.id === weaponActionMap[item].id
            return (
              <TouchableOpacity
                onPress={() => selectAction(weaponActionMap[item])}
                style={[styles.actionButton, isSelected && styles.selected]}
              >
                <Txt style={[styles.actionButtonText, isSelected && styles.txtSelected]}>
                  {weaponActionMap[item].label}
                </Txt>
              </TouchableOpacity>
            )
          }}
        />
      </View>

      <Spacer x={20} />

      <TouchableOpacity
        disabled={selectedAction === null}
        style={styles.playContainer}
        onPress={() => doAction()}
      >
        <AntDesign
          name="playcircleo"
          size={70}
          color={selectedAction === null ? "transparent" : colors.secColor}
        />
      </TouchableOpacity>
      <Spacer x={20} />
    </View>
  )
}
