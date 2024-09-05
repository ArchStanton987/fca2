import React from "react"
import { Image, Pressable, View } from "react-native"

import useCases from "lib/common/use-cases"
import { fillZeros } from "lib/common/utils/number-utils"
import ammoMap from "lib/objects/data/ammo/ammo"
import { Weapon } from "lib/objects/data/weapons/weapons.types"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import SmallLine from "components/draws/Line/Line"
import { useCharacter } from "contexts/CharacterContext"
import colors from "styles/colors"

import styles from "./WeaponCard.styles"

type WeaponCardProps = { weapon: Weapon }

export default function WeaponCard({ weapon }: WeaponCardProps) {
  const char = useCharacter()

  const load = () => {
    useCases.weapons.load(char, weapon)
  }

  const inMagazine = weapon?.inMagazine || 0
  const remaining = weapon.ammo - inMagazine

  return (
    <Pressable onLongPress={load}>
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
        <View>
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
            <Txt style={styles.attr}>COMP</Txt>
            <Spacer x={10} />
            <Txt>{weapon.skill}</Txt>
          </View>
          {weapon.data.range && (
            <View style={styles.row}>
              <Txt style={styles.attr}>POR</Txt>
              <Spacer x={10} />
              <Txt>{weapon.data.range}m</Txt>
            </View>
          )}
        </View>
        <Spacer x={20} />
        {weapon.data.ammoType && (
          <View style={{ alignItems: "flex-end" }}>
            <Txt style={{ fontSize: 20 }}>{fillZeros(inMagazine)}</Txt>
            <View
              style={{
                width: 30,
                height: 2,
                backgroundColor: colors.secColor
              }}
            />
            <Txt style={{ fontSize: 20 }}>{fillZeros(remaining)}</Txt>
            <Txt style={{ fontSize: 12 }}>{ammoMap[weapon.data.ammoType].label}</Txt>
          </View>
        )}
      </View>
    </Pressable>
  )
}
