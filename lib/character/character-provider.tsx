import { ReactNode, useState } from "react"
import { Platform } from "react-native"

import { useQueries } from "@tanstack/react-query"
import { useSub } from "lib/shared/db/useSub"
import Toast from "react-native-toast-message"

import Txt from "components/Txt"
import { useSquad } from "contexts/SquadContext"
import LoadingScreen from "screens/LoadingScreen"
import { getDDMMYYYY, getHHMM } from "utils/date"

import { AbilitiesProvider, getAbilitiesOptions } from "./abilities/abilities-provider"
import { EffectsProvider, getEffectsOptions } from "./effects/effects-provider"
import { HealthProvider, getHealthOptions } from "./health/health-provider"
import CharInfo, { DbCharInfo } from "./info/CharInfo"
import { CharInfoProvider, getCharInfoOptions } from "./info/info-provider"
import { ProgressProvider, getExpOptions } from "./progress/progress-provider"

function CharSubsProvider({ children, charId }: { children: ReactNode; charId: string }) {
  const charInfoOptions = getCharInfoOptions(charId)
  useSub<DbCharInfo>(charInfoOptions.queryKey.join("/"), snap => new CharInfo(snap, charId))

  const abilitiesOptions = getAbilitiesOptions(charId)
  useSub(abilitiesOptions.queryKey.join("/"))

  const healthOptions = getHealthOptions(charId)
  useSub(healthOptions.queryKey.join("/"))

  const effectsOptions = getEffectsOptions(charId)
  useSub(effectsOptions.queryKey.join("/"))

  const expOptions = getExpOptions(charId)
  useSub(expOptions.queryKey.join("/"))

  const queries = useQueries({
    queries: [charInfoOptions, abilitiesOptions, healthOptions, effectsOptions, expOptions],
    combine: req => ({
      isPending: req.some(r => r.isPending),
      isError: req.some(r => r.isError),
      data: req.map(r => r)
    })
  })

  if (queries.isError) return <Txt>Erreur lors de la récupération du personnage</Txt>
  if (queries.isPending) return <LoadingScreen />

  return children
}

export default function CharacterProvider({
  children,
  charId
}: {
  children: ReactNode
  charId: string
}) {
  const squad = useSquad()
  const [currDatetime, setCurrDatetime] = useState(squad.date.toJSON())

  if (squad.date.toJSON() !== currDatetime) {
    setCurrDatetime(squad.date.toJSON())
    const newDate = getDDMMYYYY(squad.date)
    const newHour = getHHMM(squad.date)
    Toast.show({
      type: "custom",
      text1: `Le temps passe ! Nous sommes le ${newDate}, il est ${newHour}.`,
      autoHide: Platform.OS === "web"
    })
  }

  return (
    <CharSubsProvider charId={charId}>
      <CharInfoProvider charId={charId}>
        <ProgressProvider charId={charId}>
          <HealthProvider charId={charId}>
            <EffectsProvider charId={charId}>
              <AbilitiesProvider charId={charId}>{children}</AbilitiesProvider>
            </EffectsProvider>
          </HealthProvider>
        </ProgressProvider>
      </CharInfoProvider>
    </CharSubsProvider>
  )
}
