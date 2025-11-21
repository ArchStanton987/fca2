import { useLocalSearchParams } from "expo-router"

import { useCombatId } from "lib/character/combat-status/combat-status-provider"
import { calculatedEffects } from "lib/character/effects/effects-utils"
import { limbsMap } from "lib/character/health/Health"
import { limbsTemplates } from "lib/character/health/health.const"
import { useCharInfo, useFullname } from "lib/character/info/info-provider"
import { useContenders } from "lib/combat/use-cases/sub-combat"
import { critters } from "lib/npc/const/npc-templates"

import List from "components/List"
import Selectable from "components/Selectable"
import Txt from "components/Txt"
import { useCollectiblesData } from "providers/AdditionalElementsProvider"
import { useDamageFormStore } from "providers/DamageFormProvider"

function CharEntry({ charId }: { charId: string }) {
  const actions = useDamageFormStore(state => state.actions)
  const { data: fullname } = useFullname(charId)
  return (
    <Selectable isSelected={false} onPress={() => actions.setEntry("charId", charId)}>
      <Txt>{fullname}</Txt>
    </Selectable>
  )
}

function CharList() {
  const { charId } = useLocalSearchParams<{ charId: string }>()
  const { data: combatId } = useCombatId(charId)
  const { data: contenders } = useContenders(combatId)
  return (
    <List
      data={contenders}
      keyExtractor={e => e}
      renderItem={({ item }) => <CharEntry charId={item} />}
    />
  )
}

function LimbsList() {
  const actions = useDamageFormStore(state => state.actions)
  const selectedChar = useDamageFormStore(state => {
    if (!state.selectedEntry) return ""
    return state.entries[state.selectedEntry].charId
  })
  const { data: templateId } = useCharInfo(selectedChar, i => i.templateId)
  const limbsTemplateId = templateId in critters ? critters[templateId].limbsTemplate : "large"
  const limbsTemplate = limbsTemplates[limbsTemplateId]
  return (
    <List
      data={limbsTemplate}
      keyExtractor={e => e}
      renderItem={({ item }) => (
        <Selectable isSelected={false} onPress={() => actions.setEntry("localization", item)}>
          <Txt>{limbsMap[item].label}</Txt>
        </Selectable>
      )}
    />
  )
}

function EffectsList() {
  const { effects: allEffects } = useCollectiblesData()
  const effects = Object.values(allEffects).filter(e => !calculatedEffects.includes(e.type))
  const actions = useDamageFormStore(state => state.actions)
  return (
    <List
      data={effects}
      keyExtractor={e => e.id}
      renderItem={({ item }) => (
        <Selectable isSelected={false} onPress={() => actions.setEntry("effectId", item.id)}>
          <Txt>{item.label}</Txt>
        </Selectable>
      )}
    />
  )
}

export default function DamageFormListPicker() {
  const pannel = useDamageFormStore(state => state.pannel)

  if (pannel === "bodyParts") return <LimbsList />
  if (pannel === "chars") return <CharList />
  if (pannel === "effects") return <EffectsList />
  return null
}
