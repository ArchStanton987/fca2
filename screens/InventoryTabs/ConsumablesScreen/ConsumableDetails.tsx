import React from "react"

import { Consumable } from "lib/objects/data/consumables/consumables.types"
import { ScrollView } from "react-native-gesture-handler"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import RevertColorsPressable from "components/wrappers/RevertColorsPressable/RevertColorsPressable"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"

export default function ConsumableDetails({ dbKey }: { dbKey: Consumable["dbKey"] | null }) {
  const character = useCharacter()
  const { consumablesRecord } = useInventory()

  if (!dbKey) return null

  const consumable = consumablesRecord[dbKey]
  const { data, remainingUse } = consumable
  const { description, maxUsage } = data

  return (
    <ScrollView>
      <Txt>DESCRIPTION</Txt>
      <Spacer y={10} />
      <Txt>{description}</Txt>
      <Spacer y={20} />
      {maxUsage && remainingUse ? (
        <Txt>
          Utilisations : {remainingUse}/{maxUsage}
        </Txt>
      ) : null}
      <Spacer y={20} />
      <RevertColorsPressable onPress={() => character.consume(consumable)}>
        <Txt>CONSOMMER</Txt>
      </RevertColorsPressable>
    </ScrollView>
  )
}
