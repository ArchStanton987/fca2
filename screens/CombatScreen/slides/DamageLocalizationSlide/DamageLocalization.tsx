import { ReactNode, useCallback } from "react"
import { ActivityIndicator, TouchableOpacity } from "react-native"

import { useIsMutating, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCurrCharId } from "lib/character/character-store"
import { useCombatId } from "lib/character/combat-status/combat-status-provider"
import { limbsMap } from "lib/character/health/Health"
import { LimbId } from "lib/character/health/health.const"
import { TemplateId } from "lib/character/info/CharInfo"
import { useCharInfo } from "lib/character/info/info-provider"
import { useCombatState } from "lib/combat/use-cases/sub-combats"
import { getBodyPart } from "lib/combat/utils/combat-utils"
import { delay } from "lib/shared/utils/fn-utils"

import NumPad from "components/NumPad/NumPad"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import {
  useActionActorId,
  useActionApi,
  useActionDamageLocScore,
  useActionTargetId
} from "providers/ActionFormProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"

import NextButton from "../NextButton"
import styles from "./DamageLocalization.styles"

function TargetIsNotAPlayableSlide({ onPressNext }: { onPressNext: () => void }) {
  return (
    <DrawerSlide>
      <Section style={{ flex: 1 }} title="valider" contentContainerStyle={styles.centeredSection}>
        <Txt>La cible n&apos;est pas dans le combat, pas besoin de localiser les dégâts... !</Txt>
        <Spacer y={30} />
        <TouchableOpacity style={styles.cta} onPress={onPressNext}>
          <Txt style={styles.ctaText}>SUIVANT</Txt>
        </TouchableOpacity>
      </Section>
    </DrawerSlide>
  )
}

function Score() {
  const currCharId = useCurrCharId()
  const { data: combatId } = useCombatId(currCharId)
  const { data: savedScore } = useCombatState(
    combatId,
    c => c.action.damageLocalizationScore ?? null
  )
  const score = useActionDamageLocScore() ?? "-"
  return <Txt style={styles.score}>{savedScore ?? score}</Txt>
}

function DamageLocNumPad() {
  const { setRoll } = useActionApi()
  const onPressKeyPad = useCallback(
    (str: string) => {
      setRoll(str, "damageLocalizationScore")
    },
    [setRoll]
  )
  return <NumPad onPressKeyPad={onPressKeyPad} />
}

const getDamageLocQk = (score: string, targetTemplateId: string = "") => [
  "DAMAGE_LOC",
  targetTemplateId,
  score
]

const useLocResult = (score: string, targetTemplateId: string = "") =>
  useQuery({
    queryKey: getDamageLocQk(score, targetTemplateId),
    queryFn: () => new Promise<LimbId>(() => {})
  })

function LimbResult() {
  const damageLocScore = useActionDamageLocScore() ?? ""
  const actorId = useActionActorId()
  const { data: combatId } = useCombatId(actorId)
  const { data: savedDice } = useCombatState(combatId, c => c.action.damageLocalizationScore)
  const targetId = useActionTargetId() ?? ""
  const { data: targetTemplateId } = useCharInfo(targetId, i => i.templateId)
  const score = typeof savedDice === "number" ? savedDice.toString() : damageLocScore
  const query = useLocResult(score, targetTemplateId)
  const isMutating = useIsMutating({ mutationKey: ["GET_LOC"] }) > 0
  if (isMutating) return <ActivityIndicator color={colors.secColor} size="large" />
  if (query.isError || !query.data) return <Txt>-</Txt>
  return <Txt>{limbsMap[query.data].label}</Txt>
}

function NextSection({ children }: { children: ReactNode }) {
  const damageLocScore = useActionDamageLocScore() ?? ""
  const targetId = useActionTargetId() ?? ""
  const { data: targetTemplateId } = useCharInfo(targetId, i => i.templateId)
  const { isSuccess } = useLocResult(damageLocScore, targetTemplateId)
  return (
    <Section title={isSuccess ? "suivant" : "voir"} contentContainerStyle={styles.scoreContainer}>
      {children}
    </Section>
  )
}

const useSetLocResult = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["GET_LOC"],
    mutationFn: async (payload: { score: string; templateId: TemplateId }) => {
      const { score, templateId } = payload
      const result = await delay(1000, getBodyPart(score, templateId))
      queryClient.setQueryData(getDamageLocQk(score, templateId), result)
    }
  })
}

function Submit({ onSuccess }: { onSuccess: () => void }) {
  const queryClient = useQueryClient()
  const useCases = useGetUseCases()
  const { setRoll } = useActionApi()

  const actorId = useActionActorId()
  const { data: combatId } = useCombatId(actorId)
  const { data: savedDice } = useCombatState(combatId, c => c.action.damageLocalizationScore)

  const damageLocScore = useActionDamageLocScore() ?? ""
  const targetId = useActionTargetId() ?? ""
  const { data: targetTemplateId } = useCharInfo(targetId, i => i.templateId)
  const formDice = damageLocScore ? parseInt(damageLocScore, 10) : 0
  const dice = typeof savedDice === "number" ? savedDice : formDice
  const isScoreValid = !Number.isNaN(dice) && dice > 0 && dice < 101

  const setLocalization = useSetLocResult()

  const reset = async () => {
    await useCases.combat.resetDamageLoc({ combatId })
    setRoll("clear", "damageLocalizationScore")
  }

  const submit = async () => {
    if (!isScoreValid) throw new Error("invalid score")
    const result = queryClient.getQueryData(getDamageLocQk(damageLocScore, targetTemplateId))
    if (!result) {
      return setLocalization.mutate({ score: damageLocScore, templateId: targetTemplateId })
    }
    const payload = { damageLocalizationScore: dice }
    await useCases.combat.updateAction({ combatId, payload })
    onSuccess()
    return null
  }

  return (
    <NextButton
      onLongPress={() => reset()}
      disabled={!isScoreValid || setLocalization.isPending}
      onPress={() => submit()}
    />
  )
}

const components = {
  Score,
  DamageLocNumPad,
  LimbResult,
  NextSection,
  Submit,
  TargetIsNotAPlayableSlide
}

export default components
