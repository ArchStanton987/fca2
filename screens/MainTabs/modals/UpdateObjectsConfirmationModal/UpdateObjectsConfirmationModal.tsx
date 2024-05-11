import { StyleSheet, View } from "react-native"

import { router } from "expo-router"

import useCases from "lib/common/use-cases"

import ModalCta from "components/ModalCta/ModalCta"
import ScrollableSection from "components/ScrollableSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import ModalBody from "components/wrappers/ModalBody"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { useUpdateObjects } from "contexts/UpdateObjectsContext"
import { categoriesMap } from "screens/MainTabs/modals/UpdateObjectsModal/UpdateObjectsModal.utils"
import colors from "styles/colors"

const styles = StyleSheet.create({
  section: {
    flex: 1,
    width: 300,
    alignSelf: "center"
  },
  category: {
    textAlign: "center",
    backgroundColor: colors.terColor,
    padding: 4
  },
  listItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 2
  }
})

export default function UpdateObjectsConfirmationModal() {
  const { state } = useUpdateObjects()
  const character = useCharacter()
  const categoryList = Object.entries(state)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, objects]) => Object.values(objects).some(el => el.count !== 0))
    .map(([category, objects]) => ({
      category,
      objects: Object.entries(objects)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, content]) => content.count !== 0)
        .map(([id, content]) => ({ ...content, id }))
    }))

  const onPressConfirm = async () => {
    // TODO: add apropriate redirection
    await useCases.inventory.groupAdd(character.charId, state)
    router.replace({ pathname: routes.inventory.weapons })
  }

  return (
    <ModalBody>
      <Spacer y={10} />
      <Txt style={{ textAlign: "center" }}>
        Vous êtes sur le point d&apos;effectuer les modifications suivantes :
      </Txt>
      <ScrollableSection title="MODIFICATIONS" style={styles.section}>
        {categoryList.map(cat => (
          <View key={cat.category}>
            <Txt style={styles.category}>
              {categoriesMap[cat.category as keyof typeof categoriesMap].label.toUpperCase()}
            </Txt>
            {cat.objects.map(obj => (
              <View key={obj.id} style={styles.listItemContainer}>
                <Txt>{obj.label}</Txt>
                <Txt>x{obj.count}</Txt>
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
