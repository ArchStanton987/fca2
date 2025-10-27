import { StyleSheet, View } from "react-native"

import { useLocalSearchParams } from "expo-router"

import { Image } from "expo-image"
import { useAbilities, useSpecial } from "lib/character/abilities/abilities-provider"
import secAttrMap from "lib/character/abilities/sec-attr/sec-attr"
import { useItem } from "lib/inventory/use-sub-inv-cat"
import { getHasStrengthMalus } from "lib/objects/data/weapons/weapons-utils"

import unarmedImg from "assets/images/unarmed.png"
import Row from "components/Row"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useActionActorId } from "providers/ActionFormProvider"
import colors from "styles/colors"

import AmmoIndicator from "../AmmoIndicator"

const styles = StyleSheet.create({
  attr: {
    width: 30
  },
  malus: {
    color: colors.yellow
  }
})

export default function WeaponInfo({ selectedWeapon }: { selectedWeapon: string }) {
  const { charId } = useLocalSearchParams<{ charId: string }>()
  const formActorId = useActionActorId()
  const actorId = formActorId === "" ? charId : formActorId

  const { data: abilities } = useAbilities(actorId)
  const { data: weapon } = useItem(actorId, selectedWeapon)
  const { data: special } = useSpecial(actorId)

  if (weapon.category !== "weapons") return null

  const hasMalus = getHasStrengthMalus(weapon, special.curr)

  return (
    <>
      <Row style={{ alignItems: "center", justifyContent: "center" }}>
        <Image
          source={weapon.id === "unarmed" ? unarmedImg : { uri: weapon.data.img }}
          style={{ height: 70, width: 70 }}
          contentFit="contain"
        />
        <Spacer x={15} />
        <AmmoIndicator charId={actorId} weaponKey={selectedWeapon} />
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
