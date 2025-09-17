import { StyleSheet, View } from "react-native"

import { Image } from "expo-image"
import Character from "lib/character/Character"
import secAttrMap from "lib/character/abilities/sec-attr/sec-attr"
import { getHasStrengthMalus } from "lib/objects/data/weapons/weapons-utils"

import unarmedImg from "assets/images/unarmed.png"
import Row from "components/Row"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import { useActionActorId } from "providers/ActionFormProvider"
import { useContenders } from "providers/ContendersProvider"
import { useInventories } from "providers/InventoriesProvider"
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

export function WeaponInfo({ selectedWeapon }: { selectedWeapon?: string }) {
  const formActorId = useActionActorId()

  const { charId } = useCharacter()
  const actorId = formActorId === "" ? charId : formActorId
  const contender = useContenders(actorId)

  const inv = useInventories(actorId)

  let weapon = contender.unarmed
  const isHuman = contender instanceof Character
  if (selectedWeapon) {
    weapon = isHuman
      ? inv.weaponsRecord[selectedWeapon] ?? contender.unarmed
      : contender.equipedObjectsRecord.weapons[selectedWeapon]
  }

  if (!weapon) return null

  const hasMalus = getHasStrengthMalus(weapon, contender.special.curr)

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

export function NoCombatWeaponInfo({ selectedWeapon }: { selectedWeapon?: string }) {
  const character = useCharacter()
  const inv = useInventory()

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
