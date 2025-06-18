import { StyleSheet } from "react-native"

import Character from "lib/character/Character"
import { DamageTypeId } from "lib/objects/data/weapons/weapons.types"

import Col from "components/Col"
import NumPad from "components/NumPad/NumPad"
import useNumPad from "components/NumPad/useNumPad"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

import PlayButton from "../PlayButton"
import SlideError, { slideErrors } from "../SlideError"
import WeaponInfo from "../WeaponInfo"

const styles = StyleSheet.create({
  score: {
    color: colors.secColor,
    fontSize: 42,
    lineHeight: 50
  },
  scoreContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})

type DamageSlideProps = SlideProps & {}

export default function DamageSlide({ scrollNext }: DamageSlideProps) {
  const useCases = useGetUseCases()
  const { combat } = useCombat()
  const char = useCharacter()
  const inv = useInventory()
  const { clothingsRecord, consumablesRecord, miscObjectsRecord } = inv
  const form = useActionForm()
  const { actionType, actionSubtype, itemDbKey } = form
  const { setForm } = useActionApi()

  const { scoreStr, onPressKeypad } = useNumPad(form.rawDamage?.toString(), 3)
  const isScoreValid =
    (scoreStr.length > 0 && scoreStr.length < 4) || typeof form.rawDamage === "number"

  if (!itemDbKey) return <SlideError error={slideErrors.noItemError} />

  let item
  let damageRoll
  let damageType: DamageTypeId = "physical"

  if (actionType === "weapon") {
    const isHuman = char instanceof Character
    item = isHuman
      ? inv.weaponsRecord[itemDbKey] ?? char.unarmed
      : char.equipedObjectsRecord.weapons[itemDbKey]
    damageType = item.data.damageType
    if (actionSubtype === "basic" || actionSubtype === "aim") {
      damageRoll = item.data.damageBasic
    }
    if (actionSubtype === "burst") {
      damageRoll = item.data.damageBurst
    }
  } else {
    item = clothingsRecord[itemDbKey] ??
      consumablesRecord[itemDbKey] ??
      miscObjectsRecord[itemDbKey] ?? { data: { weight: 0.5 } }
    const weight = item?.data?.weight ?? 0.5
    const roundedWeight = Math.ceil(weight)
    damageRoll = `1D6+${roundedWeight}`
  }

  const resetField = () => {
    setForm({ rawDamage: undefined })
  }

  const submit = async () => {
    if (combat === null || !scrollNext) return
    const parsedScore = form?.rawDamage ?? parseInt(scoreStr, 10)
    if (!isScoreValid || Number.isNaN(parsedScore)) throw new Error("invalid score")
    const payload = { ...form, rawDamage: parsedScore, damageType }
    await useCases.combat.updateAction({ combat, payload })
    setForm({ rawDamage: parsedScore, damageType })
    scrollNext()
    console.log("here")
  }

  return (
    <DrawerSlide>
      <Section title="score de dégâts" contentContainerStyle={{ flex: 1, height: "100%" }}>
        <NumPad onPressKeyPad={onPressKeypad} />
      </Section>

      <Spacer x={layout.globalPadding} />

      <Col style={{ flex: 1 }}>
        <Section title="jet dégâts" contentContainerStyle={styles.scoreContainer}>
          <Txt style={{ fontSize: 36 }}>{damageRoll}</Txt>
        </Section>
        <Spacer y={layout.globalPadding} />
        <Section title={actionType === "weapon" ? "arme" : "objet"} style={{ flex: 1 }}>
          {actionType === "weapon" ? (
            <WeaponInfo selectedWeapon={form.itemDbKey} />
          ) : (
            <>
              <Txt>{item?.data?.label}</Txt>
              <Txt>poids : {item?.data?.weight}</Txt>
            </>
          )}
        </Section>
      </Col>

      <Spacer x={layout.globalPadding} />

      <Col style={{ minWidth: 100 }}>
        <Section title="résultat" style={{ flex: 1 }} contentContainerStyle={styles.scoreContainer}>
          <Txt style={styles.score}>{form?.rawDamage ?? scoreStr}</Txt>
        </Section>
        <Spacer y={layout.globalPadding} />

        <Section title="valider" style={{ flex: 1 }} contentContainerStyle={styles.scoreContainer}>
          <PlayButton
            onLongPress={() => resetField()}
            disabled={!isScoreValid}
            onPress={() => submit()}
          />
        </Section>
      </Col>
    </DrawerSlide>
  )
}
