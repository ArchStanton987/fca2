import React from "react"

import { ScrollView } from "react-native-gesture-handler"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { CharConsumable } from "hooks/db/useGetInventory"
import consumablesMap from "models/objects/consumable/consumables"

export default function ConsumableDetails({ charConsumable }: { charConsumable?: CharConsumable }) {
  const consumable = charConsumable ? consumablesMap[charConsumable.id] : null

  if (!consumable || !charConsumable) return null

  const { description, maxUsage } = consumable

  return (
    <ScrollView>
      <Txt>DESCRIPTION</Txt>
      <Spacer y={10} />
      <Txt>{description}</Txt>
      <Spacer y={20} />
      {maxUsage && charConsumable.remainingUse ? (
        <Txt>
          Utilisations : {charConsumable?.remainingUse}/{maxUsage}
        </Txt>
      ) : null}
    </ScrollView>
  )
}
