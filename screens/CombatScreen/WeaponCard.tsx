import React, { useState } from "react"
import { Image, TouchableOpacity, View } from "react-native"

import AntDesign from "@expo/vector-icons/AntDesign"
import secAttrMap from "lib/character/abilities/sec-attr/sec-attr"
import {
  getApCost,
  getHasStrengthMalus,
  getWeaponActionLabel,
  weaponActionsMap
} from "lib/objects/data/weapons/weapons-utils"
import { Weapon, WeaponActionId } from "lib/objects/data/weapons/weapons.types"

import unarmedImg from "assets/images/unarmed.png"
import List from "components/List"
import Section from "components/Section"
import { ComposedTitleProps } from "components/Section/Section.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useCombatStatus } from "providers/CombatStatusProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import { getHapticSequence } from "utils/haptics"

import AmmoIndicator from "./AmmoIndicator"
import styles from "./WeaponCard.styles"

type WeaponCardProps = { weapon: Weapon; setPrevAp: (apCost: number) => void }

const getTitle = (str: string): ComposedTitleProps => [
  { title: str, containerStyle: { flex: 1 } },
  { title: "action(s) disponible(s)", containerStyle: { flex: 1 } }
]

export default function WeaponCard({ weapon, setPrevAp }: WeaponCardProps) {
  const useCases = useGetUseCases()
  const char = useCharacter()
  const combatStatus = useCombatStatus()

  const [selectedAction, setSelectedAction] = useState<WeaponActionId | null>(null)

  const selectAction = (actionId: WeaponActionId) => {
    if (selectedAction === actionId) {
      setSelectedAction(null)
      setPrevAp(combatStatus.currAp)
    } else {
      setSelectedAction(actionId)
      const apCost = getApCost(weapon, char, actionId)
      setPrevAp(combatStatus.currAp - apCost)
    }
  }

  const hasMalus = getHasStrengthMalus(weapon, char.special.curr)

  const doAction = async () => {
    if (!selectedAction) return
    setSelectedAction(null)
    switch (selectedAction) {
      case "reload":
        await useCases.weapons.load(char, weapon)
        break
      case "unload":
        await useCases.weapons.unload(char, weapon)
        break
      default:
        await useCases.weapons.use(char, weapon, selectedAction)
        break
    }
    setPrevAp(combatStatus.currAp)
    await getHapticSequence(selectedAction, weapon)
  }

  const actions = weaponActionsMap

  return (
    <Section title={getTitle(weapon.data.label)}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={styles.cardContainer}>
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
            keyExtractor={item => item.actionId}
            separator={<Spacer y={10} />}
            renderItem={({ item }) => {
              const isSelected = selectedAction === item.actionId
              const isAvailable = item.fn(
                weapon,
                combatStatus.currAp,
                char.secAttr.curr.actionPoints
              )
              return (
                <TouchableOpacity
                  onPress={() => {
                    if (!isAvailable) return
                    selectAction(item.actionId)
                  }}
                  style={[
                    styles.actionButton,
                    isSelected && styles.selected,
                    !isAvailable && styles.disabled
                  ]}
                >
                  <Txt
                    style={[
                      styles.actionButtonText,
                      isSelected && styles.txtSelected,
                      !isAvailable && styles.disabledText
                    ]}
                  >
                    {getWeaponActionLabel(weapon, item.actionId)}
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
      <Spacer y={10} />
    </Section>
  )
}
