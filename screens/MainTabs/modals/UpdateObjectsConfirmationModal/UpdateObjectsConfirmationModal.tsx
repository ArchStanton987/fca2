import { View } from "react-native"

import { ObjectExchangeState } from "lib/objects/objects-reducer"

import ModalCta from "components/ModalCta/ModalCta"
import ScrollableSection from "components/ScrollableSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import ModalBody from "components/wrappers/ModalBody"
import { useUpdateObjects } from "contexts/UpdateObjectsContext"

import { categoriesMap } from "../UpdateObjectsModal/UpdateObjectsModal"

type CategoryList = {
  category: string
  objects: { id: string; label: string; amount: number }[]
}[]

export default function UpdateObjectsConfirmationModal() {
  const { state } = useUpdateObjects()
  const categoryList: CategoryList = Object.entries(state)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, objects]) => Object.values(objects).some(el => el > 0))
    .map(([category, objects]) => ({
      category,
      objects: Object.entries(objects).map(([id, content]) => ({ ...content, id }))
    }))

  // TODO: merge all update confirmations modals
  const onPressConfirm = () => {}

  return (
    <ModalBody>
      <Spacer y={30} />
      <Txt style={{ textAlign: "center" }}>
        Vous êtes sur le point d&apos;effectuer les modifications suivantes :
      </Txt>
      <ScrollableSection title="OBJETS" style={{ flex: 1, width: 300, alignSelf: "center" }}>
        {categoryList.map(cat => (
          <View key={cat.category}>
            <Txt>{categoriesMap[cat.category as keyof ObjectExchangeState].label}</Txt>
            {cat.objects.map(obj => (
              <View key={obj.id} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Txt>{obj.label}</Txt>
                <Txt>x{obj.amount}</Txt>
              </View>
            ))}
          </View>
        ))}
      </ScrollableSection>
      <Spacer y={15} />
      <ModalCta onPressConfirm={onPressConfirm} />
    </ModalBody>
  )
}
