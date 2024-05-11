import React from "react"
import { ScrollView } from "react-native"

import useCases from "lib/common/use-cases"
import { Consumable } from "lib/objects/data/consumables/consumables.types"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import RevertColorsPressable from "components/wrappers/RevertColorsPressable/RevertColorsPressable"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"

function Header() {
  return (
    <>
      <Txt>DESCRIPTION</Txt>
      <Spacer y={10} />
    </>
  )
}

export default function ConsumableDetails({ dbKey }: { dbKey: Consumable["dbKey"] | null }) {
  const character = useCharacter()
  const { consumablesRecord } = useInventory()

  if (!dbKey) return <Header />

  const consumable = consumablesRecord[dbKey]
  const { data, remainingUse } = consumable
  const { description, maxUsage } = data

  return (
    <>
      <Header />
      {dbKey ? (
        <ScrollView>
          <Txt>{description}</Txt>
          <Spacer y={20} />
          {maxUsage && remainingUse ? (
            <Txt>
              Utilisations : {remainingUse}/{maxUsage}
            </Txt>
          ) : null}
          <Spacer y={20} />
          <RevertColorsPressable onPress={() => useCases.inventory.consume(character, consumable)}>
            <Txt>CONSOMMER</Txt>
          </RevertColorsPressable>
          <Spacer y={20} />
        </ScrollView>
      ) : null}
    </>
  )
}
