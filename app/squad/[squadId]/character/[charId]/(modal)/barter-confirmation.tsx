import { StyleSheet } from "react-native"

import { router } from "expo-router"

import { useCurrCharId } from "lib/character/character-store"
import {
  useBarterActions,
  useBarterAmmos,
  useBarterCaps,
  useBarterClothings,
  useBarterConsumables,
  useBarterMiscObjects,
  useBarterWeapons
} from "lib/objects/barter-store"
import ammoMap from "lib/objects/data/ammo/ammo"
import { AmmoType } from "lib/objects/data/ammo/ammo.types"
import { RecapCategory, RecapEntry } from "lib/objects/ui/barter/RecapCategory"

import List from "components/List"
import ModalCta from "components/ModalCta/ModalCta"
import ScrollableSection from "components/ScrollableSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import ModalBody from "components/wrappers/ModalBody"
import { useCollectiblesData } from "providers/AdditionalElementsProvider"
import { useGetUseCases } from "providers/UseCasesProvider"

const styles = StyleSheet.create({
  section: {
    flex: 1,
    width: 300,
    alignSelf: "center"
  }
})

export default function BarterConfirmationModal() {
  const charId = useCurrCharId()

  const { weapons, clothings, consumables, miscObjects } = useCollectiblesData()

  const useCases = useGetUseCases()

  const actions = useBarterActions()

  const barterCaps = useBarterCaps()
  const barterAmmo = useBarterAmmos()
  const barterWeapons = useBarterWeapons()
  const barterClothings = useBarterClothings()
  const barterConsumables = useBarterConsumables()
  const barterMiscObjects = useBarterMiscObjects()

  const onPressConfirm = async () => {
    const exchange = {
      items: {
        ...barterWeapons,
        ...barterClothings,
        ...barterConsumables,
        ...barterMiscObjects
      },
      ammo: barterAmmo,
      caps: barterCaps
    }
    await useCases.inventory.barter({ charId, ...exchange })
    actions.reset()
    router.dismiss(2)
  }

  const weaponsEntries = Object.entries(barterWeapons).map(([id, count]) => ({
    count,
    label: weapons[id].label
  }))
  const clothingsEntries = Object.entries(barterClothings).map(([id, count]) => ({
    count,
    label: clothings[id].label
  }))
  const consumablesEntries = Object.entries(barterConsumables).map(([id, count]) => ({
    count,
    label: consumables[id].label
  }))
  const miscObjectsEntries = Object.entries(barterMiscObjects).map(([id, count]) => ({
    count,
    label: miscObjects[id].label
  }))
  const ammoEntries = Object.entries(barterAmmo).map(([id, count]) => ({
    count,
    label: ammoMap[id as AmmoType].label
  }))

  return (
    <ModalBody>
      <Spacer y={10} />
      <Txt style={{ textAlign: "center" }}>
        Vous êtes sur le point d&apos;effectuer les modifications suivantes :
      </Txt>
      <ScrollableSection title="MODIFICATIONS" style={styles.section}>
        {barterCaps !== 0 ? (
          <>
            <RecapCategory title="Caps" />
            <RecapEntry label="Caps" count={barterCaps} />
          </>
        ) : null}
        {weaponsEntries.length > 0 ? (
          <>
            <RecapCategory title="Armes" />
            <List
              data={weaponsEntries}
              keyExtractor={e => e.label}
              renderItem={({ item }) => <RecapEntry label={item.label} count={item.count} />}
            />
          </>
        ) : null}
        {clothingsEntries.length > 0 ? (
          <>
            <RecapCategory title="Protections" />
            <List
              data={clothingsEntries}
              keyExtractor={e => e.label}
              renderItem={({ item }) => <RecapEntry label={item.label} count={item.count} />}
            />
          </>
        ) : null}
        {consumablesEntries.length > 0 ? (
          <>
            <RecapCategory title="Consommables" />
            <List
              data={consumablesEntries}
              keyExtractor={e => e.label}
              renderItem={({ item }) => <RecapEntry label={item.label} count={item.count} />}
            />
          </>
        ) : null}
        {miscObjectsEntries.length > 0 ? (
          <>
            <RecapCategory title="Divers" />
            <List
              data={miscObjectsEntries}
              keyExtractor={e => e.label}
              renderItem={({ item }) => <RecapEntry label={item.label} count={item.count} />}
            />
          </>
        ) : null}
        {ammoEntries.length > 0 ? (
          <>
            <RecapCategory title="Munitions" />
            <List
              data={ammoEntries}
              keyExtractor={e => e.label}
              renderItem={({ item }) => <RecapEntry label={item.label} count={item.count} />}
            />
          </>
        ) : null}
      </ScrollableSection>
      <Spacer y={15} />
      <ModalCta onPressConfirm={() => onPressConfirm()} />
    </ModalBody>
  )
}
