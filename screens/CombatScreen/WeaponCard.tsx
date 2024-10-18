import React, { useState } from "react"
import { Image, TouchableOpacity, View } from "react-native"

import AntDesign from "@expo/vector-icons/AntDesign"
import secAttrMap from "lib/character/abilities/sec-attr/sec-attr"
import useCases from "lib/common/use-cases"
import {
  getApCost,
  getAvailableWeaponActions,
  getHasStrengthMalus,
  getWeaponActionLabel
} from "lib/objects/data/weapons/weapons-utils"
import { Weapon, WeaponActionId } from "lib/objects/data/weapons/weapons.types"

import unarmedImg from "assets/images/unarmed.png"
import List from "components/List"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import SmallLine from "components/draws/Line/Line"
import { useCharacter } from "contexts/CharacterContext"
import colors from "styles/colors"
import { getHapticSequence } from "utils/haptics"

import AmmoIndicator from "./AmmoIndicator"
import styles from "./WeaponCard.styles"

type WeaponCardProps = { weapon: Weapon; setPrevAp: (apCost: number) => void }

export default function WeaponCard({ weapon, setPrevAp }: WeaponCardProps) {
  const char = useCharacter()

  const [selectedAction, setSelectedAction] = useState<WeaponActionId | null>(null)

  const selectAction = (actionId: WeaponActionId) => {
    if (selectedAction === actionId) {
      setSelectedAction(null)
      setPrevAp(char.status.currAp)
    } else {
      setSelectedAction(actionId)
      const apCost = getApCost(weapon, char, actionId)
      setPrevAp(char.status.currAp - apCost)
    }
  }

  const hasMalus = getHasStrengthMalus(weapon, char.special.curr)

  const doAction = async (apCostOverride: number | undefined = undefined) => {
    if (!selectedAction) return
    setSelectedAction(null)
    switch (selectedAction) {
      case "load":
        await useCases.weapons.load(char, weapon, apCostOverride)
        break
      case "unload":
        await useCases.weapons.unload(char, weapon, apCostOverride)
        break
      default:
        await useCases.weapons.use(char, weapon, selectedAction, apCostOverride)
        break
    }
    setPrevAp(char.status.currAp)
    await getHapticSequence(selectedAction, weapon)
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
              source={weapon.id === "unarmed" ? unarmedImg : { uri: weapon.data.img }}
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
            const isSelected = selectedAction === item
            return (
              <TouchableOpacity
                onPress={() => selectAction(item)}
                style={[styles.actionButton, isSelected && styles.selected]}
              >
                <Txt style={[styles.actionButtonText, isSelected && styles.txtSelected]}>
                  {getWeaponActionLabel(weapon, item)}
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
