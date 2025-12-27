import { ReactNode, memo, useCallback, useState } from "react"
import { StyleSheet } from "react-native"

import { useCurrCharId } from "lib/character/character-store"
import { useCombatId } from "lib/character/combat-status/combat-status-provider"
import { WeaponInfoUi } from "lib/combat/ui/WeaponIndicator"
import { useCombatState } from "lib/combat/use-cases/sub-combats"
import { useGetPlayerCanReact } from "lib/combat/utils/combat-utils"
import { DamageTypeId } from "lib/objects/data/weapons/weapons.types"

import Col from "components/Col"
import NumPad from "components/NumPad/NumPad"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import {
  useActionActorId,
  useActionApi,
  useActionItem,
  useActionItemDbKey,
  useActionRawDamage,
  useActionTargetId,
  useActionType
} from "providers/ActionFormProvider"
import { useScrollTo } from "providers/SlidesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

import PlayButton from "../PlayButton"
import VisualizeReactionSlide from "../score-result/VisualizeReactionSlide"
import AwaitReactionSlide from "../wait-slides/AwaitReactionSlide"
import AwaitTargetSlide from "../wait-slides/AwaitTargetSlide"
import DamageRoll from "./DamageRoll"

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

function AwaitReactionWrapper({ children, targetId }: { children: ReactNode; targetId: string }) {
  const isWaitingForReaction = useGetPlayerCanReact(targetId)
  if (isWaitingForReaction) return <AwaitReactionSlide />
  return children
}

function AwaitTargetWrapper({ children }: { children: ReactNode }) {
  const targetId = useActionTargetId()
  if (!targetId) return <AwaitTargetSlide />
  if (targetId === "other") return children
  return <AwaitReactionWrapper targetId={targetId}>{children}</AwaitReactionWrapper>
}

function VisualizeReactionWrapper({
  children,
  combatId,
  actorId
}: {
  children: ReactNode
  combatId: string
  actorId: string
}) {
  const useCases = useGetUseCases()
  const [isReactionResultVisible, setIsReactionResultVisible] = useState(() => true)

  const { resetSlider } = useScrollTo()
  const { reset } = useActionApi()
  const { data: action } = useCombatState(combatId, state => state.action)

  const submitNoDamages = async () => {
    const payload = {
      ...action,
      actorId,
      rawDamage: false as const,
      damageType: false as const,
      healthEntriesChange: false
    }
    await useCases.combat.doCombatAction({ combatId, action: payload })
    reset()
    resetSlider()
  }

  if (!!action.reactionRoll && isReactionResultVisible)
    return (
      <VisualizeReactionSlide
        combatId={combatId}
        dismiss={() => setIsReactionResultVisible(false)}
        skipDamage={() => submitNoDamages()}
      />
    )

  return children
}

function DamageSlide({ slideIndex }: DamageSlideProps) {
  const charId = useCurrCharId()
  const useCases = useGetUseCases()

  const rawDamage = useActionRawDamage()
  const itemDbKey = useActionItemDbKey()
  const actionType = useActionType()

  const { setRoll } = useActionApi()

  const formActorId = useActionActorId()
  const actorId = formActorId === "" ? charId : formActorId
  const { data: combatId } = useCombatId(actorId)
  const { data: savedScore } = useCombatState(combatId, c =>
    typeof c.action.rawDamage === "number" ? c.action.rawDamage : null
  )
  const item = useActionItem(actorId, itemDbKey)

  const { scrollTo } = useScrollTo()

  const scrollNext = () => {
    scrollTo(slideIndex + 1)
  }

  const resetField = async () => {
    await useCases.combat.resetDamageScore({ combatId })
    setRoll("clear", "rawDamage")
  }

  const onPressPad = useCallback(
    (e: string) => {
      setRoll(e, "rawDamage")
    },
    [setRoll]
  )

  const parsedScore = typeof savedScore === "number" ? savedScore : parseInt(rawDamage ?? "", 10)
  const isValid = !Number.isNaN(parsedScore) && parsedScore >= 0 && parsedScore < 1000

  const submitDamages = async () => {
    if (!isValid) throw new Error("invalid score")
    let damageType: DamageTypeId = "physical"
    if (item && item.category === "weapons") {
      damageType = item.data.damageType
    }
    const payload = { rawDamage: parsedScore, damageType }
    await useCases.combat.updateAction({ combatId, payload })
    scrollNext()
  }

  // NO SUCCESSFUL REACTION
  return (
    <AwaitTargetWrapper>
      <VisualizeReactionWrapper combatId={combatId} actorId={actorId}>
        <DrawerSlide>
          <Section title="score de dégâts" contentContainerStyle={{ flex: 1, height: "100%" }}>
            <NumPad onPressKeyPad={onPressPad} />
          </Section>

          <Spacer x={layout.globalPadding} />

          <Col style={{ flex: 1 }}>
            <Section title="jet dégâts" contentContainerStyle={styles.scoreContainer}>
              <DamageRoll charId={actorId} />
            </Section>
            <Spacer y={layout.globalPadding} />
            <Section
              title={actionType === "weapon" ? "arme" : "objet"}
              style={{ flex: 1 }}
              contentContainerStyle={{ alignItems: "center", justifyContent: "center", flex: 1 }}
            >
              {actionType === "weapon" ? (
                <WeaponInfoUi charId={actorId} weaponKey={itemDbKey ?? ""} />
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
            <Section
              title="résultat"
              style={{ flex: 1 }}
              contentContainerStyle={styles.scoreContainer}
            >
              <Txt style={styles.score}>{rawDamage}</Txt>
            </Section>
            <Spacer y={layout.globalPadding} />

            <Section
              title="valider"
              style={{ flex: 1 }}
              contentContainerStyle={styles.scoreContainer}
            >
              <PlayButton
                onLongPress={() => resetField()}
                disabled={!isValid}
                onPress={() => submitDamages()}
              />
            </Section>
          </Col>
        </DrawerSlide>
      </VisualizeReactionWrapper>
    </AwaitTargetWrapper>
  )
}

export default memo(DamageSlide)
