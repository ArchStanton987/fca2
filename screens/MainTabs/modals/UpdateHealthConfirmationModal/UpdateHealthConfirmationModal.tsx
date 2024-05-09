import React from "react"
import { View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import useCases from "lib/common/use-cases"

import { DrawerParams } from "components/Drawer/Drawer.params"
import ModalCta from "components/ModalCta/ModalCta"
import ScrollableSection from "components/ScrollableSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import ModalBody from "components/wrappers/ModalBody"
import routes from "constants/routes"
import { useUpdateHealth } from "contexts/UpdateHealthContext"
import { SearchParams } from "screens/ScreenParams"

export default function UpdateHealthConfirmationModal() {
  const { squadId, charId } = useLocalSearchParams() as SearchParams<DrawerParams>

  const { state, dispatch } = useUpdateHealth()

  const updates = Object.entries(state)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => ("count" in value ? value.count !== 0 : false))
    .map(([id, content]) => ({ id, ...content }))

  const onPressConfirm = async () => {
    await useCases.status.groupUpdate(charId, state)
    dispatch({ type: "reset" })
    router.push({ pathname: routes.main.index, params: { squadId, charId } })
  }
  return (
    <ModalBody>
      <Spacer y={30} />
      <Txt style={{ textAlign: "center" }}>
        Vous êtes sur le point d&apos;effectuer les modifications suivantes :
      </Txt>
      <Spacer y={30} />
      <ScrollableSection title="SANTE" style={{ flex: 1, width: 300, alignSelf: "center" }}>
        {updates.map(healthUpdate => (
          <View
            key={healthUpdate.id}
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Txt>{healthUpdate.label}</Txt>
            <Txt>{healthUpdate.count}</Txt>
          </View>
        ))}
      </ScrollableSection>
      <Spacer y={15} />
      <ModalCta onPressConfirm={onPressConfirm} />
    </ModalBody>
  )
}
