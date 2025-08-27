import { calculatedEffects } from "lib/character/effects/effects-utils"
import { limbsMap } from "lib/character/health/health"

import List from "components/List"
import Selectable from "components/Selectable"
import Txt from "components/Txt"
import useCreatedElements from "hooks/context/useCreatedElements"
import { useCombat } from "providers/CombatProvider"
import { useDamageFormStore } from "providers/DamageFormProvider"

function CharList() {
  const { players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }
  const charList = Object.values(contenders).map(c => ({
    id: c.char.charId,
    name: c.char.fullname
  }))
  const actions = useDamageFormStore(state => state.actions)
  return (
    <List
      data={charList}
      keyExtractor={e => e.id}
      renderItem={({ item }) => (
        <Selectable isSelected={false} onPress={() => actions.setEntry("charId", item.id)}>
          <Txt>{item.name}</Txt>
        </Selectable>
      )}
    />
  )
}

function LimbsList() {
  const actions = useDamageFormStore(state => state.actions)
  return (
    <List
      data={Object.values(limbsMap)}
      keyExtractor={e => e.id}
      renderItem={({ item }) => (
        <Selectable isSelected={false} onPress={() => actions.setEntry("localization", item.id)}>
          <Txt>{item.label}</Txt>
        </Selectable>
      )}
    />
  )
}

function EffectsList() {
  const { newEffects } = useCreatedElements()
  const effects = Object.values(newEffects).filter(e => !calculatedEffects.includes(e.type))
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
