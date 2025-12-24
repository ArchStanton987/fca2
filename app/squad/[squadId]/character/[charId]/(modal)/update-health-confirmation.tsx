import { View } from "react-native"

import { router } from "expo-router"

import { useCurrCharId } from "lib/character/character-store"
import { limbsMap } from "lib/character/health/Health"
import { LimbId } from "lib/character/health/health.const"
import {
  useUpdateHealthActions,
  useUpdateHealthCurrHp,
  useUpdateHealthLimbs,
  useUpdateHealthRads
} from "lib/character/health/update-health-store"

import List from "components/List"
import ModalCta from "components/ModalCta/ModalCta"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import ModalBody from "components/wrappers/ModalBody"
import { useGetUseCases } from "providers/UseCasesProvider"

function ListElement({ label, count }: { label: string; count: number }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Txt>{label}</Txt>
      <Txt>{count > 0 ? `+ ${count}` : count}</Txt>
    </View>
  )
}

export default function UpdateHealthConfirmationModal() {
  const charId = useCurrCharId()

  const useCases = useGetUseCases()

  const actions = useUpdateHealthActions()
  const rads = useUpdateHealthRads()
  const currHp = useUpdateHealthCurrHp()
  const limbs = useUpdateHealthLimbs()

  const limbsEntries = Object.entries(limbs)
    .map(([limbId, count]) => ({ id: limbId as LimbId, count }))
    .filter(entry => entry.count !== 0)

  const onPressConfirm = async () => {
    const payload = { rads, currHp, limbs }
    await useCases.character.updateHealth({ charId, modPayload: payload })
    actions.reset()
    router.dismiss(2)
  }

  return (
    <ModalBody>
      <Spacer y={10} />
      <Txt style={{ textAlign: "center" }}>
        Vous êtes sur le point d&apos;effectuer les modifications suivantes :
      </Txt>
      <Spacer y={15} />
      <ScrollSection title="SANTE" style={{ flex: 1, width: 300, alignSelf: "center" }}>
        {rads !== 0 ? <ListElement label="RADS" count={rads} /> : null}
        {currHp !== 0 ? <ListElement label="PV" count={currHp} /> : null}
        <List
          data={limbsEntries}
          keyExtractor={l => l.id}
          renderItem={({ item }) => (
            <ListElement label={limbsMap[item.id].label} count={item.count} />
          )}
        />
      </ScrollSection>
      <Spacer y={10} />
      <ModalCta onPressConfirm={onPressConfirm} />
    </ModalBody>
  )
}
