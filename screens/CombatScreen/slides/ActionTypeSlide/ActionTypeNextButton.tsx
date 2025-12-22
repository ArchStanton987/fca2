import {
  useCombatId,
  useCombatStatus,
  useCombatStatuses
} from "lib/character/combat-status/combat-status-provider"
import { useContenders } from "lib/combat/use-cases/sub-combats"
import { getActivePlayersWithAp } from "lib/combat/utils/combat-utils"
import Toast from "react-native-toast-message"

import {
  useActionActorId,
  useActionApi,
  useActionItemDbKey,
  useActionSubtype,
  useActionType,
  useIsCombinedAction
} from "providers/ActionFormProvider"
import { useScrollTo } from "providers/SlidesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"

import NextButton from "../NextButton"
import PlayButton from "../PlayButton"

type ActionTypePlayButtonProps = {
  charId: string
  slideIndex: number
}

const toastMessages = {
  wait: "OK ! On attends le bon moment !",
  prepare: "OK ! On se prépare !"
} as const

export default function ActionTypeNextButton({ charId, slideIndex }: ActionTypePlayButtonProps) {
  const useCases = useGetUseCases()

  const { scrollTo, resetSlider } = useScrollTo()

  const actionType = useActionType()
  const formActorId = useActionActorId()
  const actionSubtype = useActionSubtype()
  const isCombinedAction = useIsCombinedAction()
  const itemDbKey = useActionItemDbKey()

  const { reset } = useActionApi()

  const isPause = actionType === "wait"
  const isPrepare = actionType === "prepare"

  const actorId = formActorId === "" ? charId : formActorId
  const { data: combatId } = useCombatId(charId)
  const { data: contendersIds } = useContenders(combatId)
  const { data: currAp } = useCombatStatus(actorId, s => s.currAp)
  const combatStatuses = useCombatStatuses(contendersIds)
  const activePlayersWithAp = getActivePlayersWithAp(combatStatuses)
  const isLastPlayer = activePlayersWithAp.length === 1

  const getCanGoNext = () => {
    const defaultRes = !!actionType && !!actionSubtype
    if (actionType === "item") {
      if (actionSubtype === "pickUp") return defaultRes
      return defaultRes && !!itemDbKey
    }
    return defaultRes
  }

  const canGoNext = getCanGoNext()

  const submit = async () => {
    const payload = { actionSubtype, actionType, itemDbKey, actorId, isCombinedAction }
    if (actionType === "wait" || actionType === "prepare") {
      try {
        const action = { ...payload, apCost: actionType === "prepare" ? currAp : 0 }
        await useCases.combat.doCombatAction({ combatId, action })
        Toast.show({ type: "custom", text1: toastMessages[actionType] })
        reset()
        resetSlider()
      } catch (error) {
        Toast.show({ type: "error", text1: "Erreur lors de l'enregistrement de l'action" })
      }
      return
    }
    await useCases.combat.updateAction({ combatId, payload })
    scrollTo(slideIndex + 1)
  }

  return isPrepare || isPause ? (
    <PlayButton onPress={() => submit()} disabled={isPause && isLastPlayer} />
  ) : (
    <NextButton disabled={!canGoNext} onPress={() => submit()} />
  )
}
