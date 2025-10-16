import { View } from "react-native"

import {
  getCategoriesMap,
  useBarterActions,
  useBarterAmount,
  useBarterCategory
} from "lib/objects/barter-store"
import BarterComponents from "lib/objects/ui/barter/BarterComponents"

import AmountSelector from "components/AmountSelector"
import List from "components/List"
import ScrollableSection from "components/ScrollableSection"
import Section from "components/Section"
import Selectable from "components/Selectable"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import ViewSection from "components/ViewSection"
import { useCollectiblesData } from "providers/AdditionalElementsProvider"
import GoBackButton from "screens/CombatScreen/slides/GoBackButton"
import PlayButton from "screens/CombatScreen/slides/PlayButton"

import styles from "lib/objects/ui/barter/BarterComponents.styles"

type BarterSectionProps = {
  onPressNext?: () => void
  onPressCancel?: () => void
}

export default function BarterSection({ onPressNext, onPressCancel }: BarterSectionProps) {
  const actions = useBarterActions()

  const category = useBarterCategory()
  const selectedAmount = useBarterAmount()

  const allCollectibles = useCollectiblesData()
  const categories = getCategoriesMap(allCollectibles)

  const hasSearch = categories[category]?.hasSearch

  return (
    <View style={styles.row}>
      <ScrollableSection title="CATEGORIES" style={styles.categoriesSection}>
        <List
          data={Object.values(categories)}
          keyExtractor={c => c.id}
          renderItem={({ item }) => (
            <Selectable
              isSelected={category === item.id}
              onPress={() => actions.selectCategory(item.id)}
            >
              <Txt style={styles.listItem}>{item.label}</Txt>
            </Selectable>
          )}
        />
      </ScrollableSection>
      <Spacer x={15} />
      <ScrollableSection title="LISTE" style={styles.listSection}>
        <BarterComponents.ObjectsList />
      </ScrollableSection>
      <Spacer x={15} />
      <View>
        {hasSearch && (
          <ViewSection title="RECHERCHE" style={styles.searchSection}>
            <BarterComponents.SearchInput />
          </ViewSection>
        )}
        <ViewSection title="AJOUTER" style={styles.addSection}>
          <View style={{ flex: 1, justifyContent: "space-evenly" }}>
            <List
              data={categories[category].selectors}
              keyExtractor={item => item.toString()}
              renderItem={({ item }) => (
                <AmountSelector
                  value={item}
                  isSelected={selectedAmount === item}
                  onPress={() => actions.selectAmount(item)}
                />
              )}
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly"
              }}
            />
            <BarterComponents.ModButtons />
          </View>
        </ViewSection>
        {onPressNext && onPressCancel ? (
          <>
            <Spacer y={5} />
            <Section contentContainerStyle={styles.centeredSection}>
              <GoBackButton size={36} onPress={onPressCancel} />
              <PlayButton onPress={onPressNext} />
            </Section>
          </>
        ) : null}
      </View>
    </View>
  )
}
