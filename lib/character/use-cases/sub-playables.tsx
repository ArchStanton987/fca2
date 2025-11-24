import { useCallback, useMemo } from "react"

import { useQuery } from "@tanstack/react-query"
import { itemFactory } from "lib/inventory/item.mappers"
import { useItemsSymptoms } from "lib/inventory/use-cases/get-item-symptoms"
import {
  ammoCb,
  getAmmoOptions,
  getCapsOptions,
  getItemsOptions
} from "lib/inventory/use-sub-inv-cat"
import { DbItem } from "lib/objects/data/objects.types"
import { qkToPath, useSub, useSubCollection } from "lib/shared/db/useSub"
import { useSquads } from "lib/squad/use-cases/sub-squad"

import { useCollectiblesData } from "providers/AdditionalElementsProvider"

import Abilities from "../abilities/Abilities"
import { getDbAbilitiesOptions } from "../abilities/abilities-provider"
import { DbAbilities } from "../abilities/abilities.types"
import { getBaseSpecialOptions } from "../abilities/base-special-provider"
import { defaultSpecial } from "../abilities/special/special"
import { getCharCombatHistoryOptions } from "../combat-history/combat-history-provider"
import { csCb, getCombatStatusOptions } from "../combat-status/combat-status-provider"
import Effect from "../effects/Effect"
import { getEffectsOptions, useEffectsSymptoms } from "../effects/effects-provider"
import { DbEffect } from "../effects/effects.types"
import Health, { DbHealth } from "../health/Health"
import { getHealthOptions, useHealthSymptoms } from "../health/health-provider"
import CharInfo, { DbCharInfo } from "../info/CharInfo"
import { getCharInfoOptions } from "../info/info-provider"
import { getExpOptions } from "../progress/exp-provider"

function SubPrim({ id, squadId }: { id: string; squadId: string }) {
  const { data: datetime } = useSquads(squads => squads[squadId].datetime)
  const collectiblesData = useCollectiblesData()
  const itemsCb = useCallback(
    (db: DbItem & { key: string }) => itemFactory(db, collectiblesData),
    [collectiblesData]
  )

  const { effects } = collectiblesData
  const infoCb = useCallback((payload: DbCharInfo) => new CharInfo(payload, id), [id])
  const effectsCb = useCallback(
    (payload: DbEffect) => new Effect(payload, effects, datetime),
    [effects, datetime]
  )

  // Inventory
  useSub(qkToPath(getCapsOptions(id).queryKey))
  useSub(qkToPath(getAmmoOptions(id).queryKey), ammoCb)
  useSubCollection(qkToPath(getItemsOptions(id).queryKey), itemsCb)

  // Playable
  useSub(qkToPath(getCharInfoOptions(id).queryKey), infoCb)
  useSub(qkToPath(getBaseSpecialOptions(id).queryKey))
  useSub(qkToPath(getExpOptions(id).queryKey))
  useSubCollection(qkToPath(getEffectsOptions(id).queryKey), effectsCb)
  useSub(qkToPath(getCombatStatusOptions(id).queryKey), csCb)
  useSub(qkToPath(getCharCombatHistoryOptions(id).queryKey))

  return null
}

function SubHealth({ id }: { id: string }) {
  const { data: info } = useQuery(getCharInfoOptions(id))
  const { data: special } = useQuery(getBaseSpecialOptions(id))
  const { data: exp } = useQuery(getExpOptions(id))

  const healthCb = useCallback(
    (payload: DbHealth) =>
      new Health({
        health: payload,
        baseSPECIAL: special ?? defaultSpecial,
        exp: exp ?? 0,
        templateId: info?.templateId ?? "player"
      }),
    [info, special, exp]
  )

  const isHealthReady = !!info && !!special && typeof exp === "number"
  useSub(qkToPath(getHealthOptions(id, isHealthReady).queryKey), healthCb)

  return null
}

function SubAbilities({ id }: { id: string }) {
  const { data: info } = useQuery(getCharInfoOptions(id))

  const { data: healthSymptoms = [], isPending: isHSPending } = useHealthSymptoms(id)
  const { data: itemsSymptoms = [], isPending: isISPending } = useItemsSymptoms(id)
  const { data: effectsSymptoms = [], isPending: isESPending } = useEffectsSymptoms(id)
  const symptoms = useMemo(
    () => [...healthSymptoms, ...itemsSymptoms, ...effectsSymptoms],
    [healthSymptoms, itemsSymptoms, effectsSymptoms]
  )
  const abilitiesCb = useCallback(
    (payload: DbAbilities) =>
      new Abilities({
        payload,
        symptoms,
        templateId: info?.templateId ?? "player"
      }),
    [symptoms, info]
  )
  const abilitiesIsReady = !!info && ![isHSPending, isISPending, isESPending].some(r => !!r)
  useSub(qkToPath(getDbAbilitiesOptions(id, abilitiesIsReady).queryKey), abilitiesCb)

  return null
}

function SubPlayable({ id, squadId }: { id: string; squadId: string }) {
  return (
    <>
      <SubPrim id={id} squadId={squadId} />
      <SubHealth id={id} />
      <SubAbilities id={id} />
    </>
  )
}

export default function SubPlayables({
  playablesIds,
  squadId
}: {
  playablesIds: string[]
  squadId: string
}) {
  return playablesIds.map(id => <SubPlayable key={id} id={id} squadId={squadId} />)
}
