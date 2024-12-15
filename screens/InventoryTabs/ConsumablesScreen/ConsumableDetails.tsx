import useCases from "lib/common/use-cases"
import { Consumable } from "lib/objects/data/consumables/consumables.types"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import RevertColorsPressable from "components/wrappers/RevertColorsPressable/RevertColorsPressable"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"

export default function ConsumableDetails({ dbKey }: { dbKey: Consumable["dbKey"] | null }) {
  const character = useCharacter()
  const { consumablesRecord } = useInventory()

  const consumable = dbKey ? consumablesRecord[dbKey] : null

  if (!consumable) return null

  const { data, remainingUse } = consumable
  const { description, maxUsage } = data

  return dbKey ? (
    <>
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
    </>
  ) : null
}
