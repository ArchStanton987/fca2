import { ReactNode, createContext, useContext, useMemo, useState } from "react"
import { Platform } from "react-native"

import { useItemSymptoms } from "lib/inventory/use-sub-inv-cat"
import Toast from "react-native-toast-message"

import Txt from "components/Txt"
import { useSquad } from "contexts/SquadContext"
import LoadingScreen from "screens/LoadingScreen"
import { getDDMMYYYY, getHHMM } from "utils/date"

import Abilities from "./abilities/Abilities"
import perksMap from "./abilities/perks/perks"
import { PerkId } from "./abilities/perks/perks.types"
import { useAbilitiesQuery, useSubAbilities } from "./abilities/sub-abilities"
import traitsMap from "./abilities/traits/traits"
import { TraitId } from "./abilities/traits/traits.types"
import Effect from "./effects/Effect"
import { useEffectsQuery, useSubEffects } from "./effects/sub-effects"
import Health from "./health/Health"
import { useHealthQuery, useSubHealth } from "./health/sub-health"
import { DbCharMeta } from "./meta/meta"
import { useCharInfoQuery, useSubCharInfo } from "./meta/sub-meta"
import Progress from "./progress/Progress"
import { useExpQuery, useSubExp } from "./sub-exp"

function CharSubsProvider({ children, charId }: { children: ReactNode; charId: string }) {
  useSubCharInfo(charId)
  const charInfoReq = useCharInfoQuery(charId)

  useSubAbilities(charId)
  const abilitiesReq = useAbilitiesQuery(charId)

  useSubHealth(charId)
  const healthReq = useHealthQuery(charId)

  useSubEffects(charId)
  const effectsReq = useEffectsQuery(charId)

  useSubExp(charId)
  const expReq = useExpQuery(charId)

  const requests = [charInfoReq, abilitiesReq, healthReq, effectsReq, expReq]

  const isPending = requests.some(r => r.isPending)
  const isError = requests.some(r => r.isError)

  if (isError) return <Txt>Erreur lors de la récupération du personnage</Txt>
  if (isPending) return <LoadingScreen />

  return children
}

const CharInfoContext = createContext({} as DbCharMeta)

function CharInfoProvider({ children, charId }: { children: ReactNode; charId: string }) {
  const charInfo = useCharInfoQuery(charId).data
  if (!charInfo) return <LoadingScreen />
  return <CharInfoContext.Provider value={charInfo}>{children}</CharInfoContext.Provider>
}

export function useCharInfo() {
  const info = useContext(CharInfoContext)
  if (!info) throw new Error("CharInfoContext not found")
  return info
}

const ExpContext = createContext({} as Progress)

function ProgressProvider({ children, charId }: { children: ReactNode; charId: string }) {
  const exp = useExpQuery(charId).data
  const dbAbilities = useAbilitiesQuery(charId).data
  const charInfo = useCharInfo()

  const progress = useMemo(() => {
    if (!dbAbilities || typeof exp !== "number") return undefined
    return new Progress(exp, dbAbilities, charInfo)
  }, [exp, dbAbilities, charInfo])

  if (!progress) return <LoadingScreen />

  return <ExpContext.Provider value={progress}>{children}</ExpContext.Provider>
}

export function useProgress() {
  const exp = useContext(ExpContext)
  if (!exp) throw new Error("ExpContext not found")
  return exp
}

const AbilitiesContext = createContext({} as Abilities)

export function useAbilities() {
  const abilities = useContext(AbilitiesContext)
  if (!abilities) throw new Error("AbilitiesContext not found")
  return abilities
}

function AbilitiesProvider({ children, charId }: { children: ReactNode; charId: string }) {
  const abilitiesReq = useAbilitiesQuery(charId)
  const symptomsReq = useItemSymptoms(charId)

  const abilities = useMemo(() => {
    if (!abilitiesReq.data) return undefined

    const traits = Object.keys(abilitiesReq.data?.traits ?? {})
    const perks = Object.keys(abilitiesReq.data?.perks ?? {})
    const traitsSymptoms = traits.map(t => traitsMap[t as TraitId].symptoms)
    const perksSymptoms = perks.map(t => perksMap[t as PerkId].symptoms)
    const innateSymptoms = [...traitsSymptoms, ...perksSymptoms].flat()

    return new Abilities(abilitiesReq.data, innateSymptoms, symptomsReq.data ?? [])
  }, [abilitiesReq.data, symptomsReq.data])

  if (!abilities) return <LoadingScreen />

  return <AbilitiesContext.Provider value={abilities}>{children}</AbilitiesContext.Provider>
}

const HealthContext = createContext({} as Health)

function HealthProvider({ children, charId }: { children: ReactNode; charId: string }) {
  const healthReq = useHealthQuery(charId)
  if (!healthReq.data) return <LoadingScreen />
  return <HealthContext.Provider value={healthReq.data}>{children}</HealthContext.Provider>
}

export function useHealth() {
  const health = useContext(HealthContext)
  if (!health) throw new Error("HealthContext not found")
  return health
}

const EffectsContext = createContext({} as Record<string, Effect>)

function EffectsProvider({ children, charId }: { children: ReactNode; charId: string }) {
  const effectsReq = useEffectsQuery(charId)
  const { calculatedEffects } = useHealth()

  const effects = useMemo(
    () => ({ ...effectsReq.data, ...calculatedEffects }),
    [effectsReq.data, calculatedEffects]
  )

  if (!effects) return <LoadingScreen />

  return <EffectsContext.Provider value={effects}>{children}</EffectsContext.Provider>
}

export function usePCEffects() {
  const effects = useContext(EffectsContext)
  if (!effects) throw new Error("EffectsContext not found")
  return effects
}

export function CharacterProvider({ children, charId }: { children: ReactNode; charId: string }) {
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
