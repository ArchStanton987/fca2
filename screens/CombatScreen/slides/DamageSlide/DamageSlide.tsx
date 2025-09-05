import { useState } from "react"
import { StyleSheet } from "react-native"

import Character from "lib/character/Character"
import { getPlayerCanReact } from "lib/combat/utils/combat-utils"
import { DamageTypeId } from "lib/objects/data/weapons/weapons.types"

import Col from "components/Col"
import NumPad from "components/NumPad/NumPad"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import { useInventories } from "providers/InventoriesProvider"
import { useScrollTo } from "providers/SlidesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

import PlayButton from "../PlayButton"
import SlideError, { slideErrors } from "../SlideError"
import WeaponInfo from "../WeaponInfo"
import VisualizeReactionSlide from "../score-result/VisualizeReactionSlide"
import AwaitReactionSlide from "../wait-slides/AwaitReactionSlide"

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

export default function DamageSlide({ slideIndex }: DamageSlideProps) {
  const useCases = useGetUseCases()
  const { combat, players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }
  const form = useActionForm()
  const character = useCharacter()
  const { actionType, actionSubtype, itemDbKey, rawDamage = "" } = form
  const { setForm, setRoll } = useActionApi()

  const actorId = form.actorId === "" ? character.charId : form.actorId
  const actor = contenders[actorId]?.char

  const inv = useInventories(actorId)
  const { clothingsRecord, consumablesRecord, miscObjectsRecord } = inv

  const { scrollTo } = useScrollTo()

  const scrollNext = () => {
    scrollTo(slideIndex + 1)
  }

  const [isReactionResultVisible, setIsReactionResultVisible] = useState(() => true)

  const parsedScore = parseInt(rawDamage, 10)
  const isValid = !Number.isNaN(parsedScore) && parsedScore >= 0 && parsedScore < 1000

  const action = combat?.currAction
  if (!action) return <SlideError error={slideErrors.noCombatError} />
  if (!itemDbKey) return <SlideError error={slideErrors.noItemError} />

  let item
  let damageRoll
  let damageType: DamageTypeId = "physical"

  if (actionType === "weapon" && actionSubtype !== "hit") {
    const isHuman = actor instanceof Character
    item = isHuman
      ? inv.weaponsRecord[itemDbKey] ?? actor.unarmed
      : actor.equipedObjectsRecord.weapons[itemDbKey]
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
    const roundedWeight = Math.round(weight)
    damageRoll = `1D6+DM+${roundedWeight}`
  }

  const resetField = () => {
    setForm({ rawDamage: "" })
  }

  const onPressPad = (e: string) => {
    setRoll(e, "damage")
  }

  const submitDamages = async () => {
    if (combat === null) return
    if (!isValid) throw new Error("invalid score")
    const payload = { rawDamage: parsedScore, damageType }
    await useCases.combat.updateAction({ combat, payload })
    scrollNext()
  }
  const submitNoDamages = async () => {
    if (combat === null) return
    const payload = {
      ...action,
      rawDamage: false as const,
      damageType: false as const,
      healthEntriesChange: false
    }
    await useCases.combat.doCombatAction({ combat, action: payload, contenders })
    scrollNext()
  }

  // AWAIT REACTION (loading)
  let opponentCanReact = false
  const opponent = action.targetId ? contenders[action?.targetId].char : null
  if (opponent) {
    opponentCanReact = getPlayerCanReact(opponent, combat)
  }
  if (opponentCanReact && action.reactionRoll === undefined) return <AwaitReactionSlide />

  // SEE REACTION
  if (!!action.reactionRoll && isReactionResultVisible)
    return (
      <VisualizeReactionSlide
        dismiss={() => setIsReactionResultVisible(false)}
        skipDamage={() => submitNoDamages()}
      />
    )

  // NO SUCCESSFUL REACTION
  return (
    <DrawerSlide>
      <Section title="score de dégâts" contentContainerStyle={{ flex: 1, height: "100%" }}>
        <NumPad onPressKeyPad={onPressPad} />
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
          <Txt style={styles.score}>{rawDamage}</Txt>
        </Section>
        <Spacer y={layout.globalPadding} />

        <Section title="valider" style={{ flex: 1 }} contentContainerStyle={styles.scoreContainer}>
          <PlayButton
            onLongPress={() => resetField()}
            disabled={!isValid}
            onPress={() => submitDamages()}
          />
        </Section>
      </Col>
    </DrawerSlide>
  )
}
