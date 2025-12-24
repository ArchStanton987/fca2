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
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Selectable from "components/Selectable"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCollectiblesData } from "providers/AdditionalElementsProvider"
import GoBackButton from "screens/CombatScreen/slides/GoBackButton"
import PlayButton from "screens/CombatScreen/slides/PlayButton"
import layout from "styles/layout"

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
      <ScrollSection title="CATEGORIES" style={styles.categoriesSection}>
        <List
          style={styles.categoriesContainer}
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
      </ScrollSection>
      <Spacer x={layout.globalPadding} />
      <ScrollSection title="LISTE" style={styles.listSection}>
        <BarterComponents.ObjectsList />
      </ScrollSection>
      <Spacer x={layout.globalPadding} />
      <View>
        {hasSearch && (
          <>
            <Section title="RECHERCHE" style={styles.searchSection}>
              <BarterComponents.SearchInput />
            </Section>
            <Spacer y={layout.globalPadding} />
          </>
        )}
        <Section
          title="AJOUTER"
          style={styles.addSection}
          contentContainerStyle={styles.addSectionContainer}
        >
          <List
            data={categories[category].selectors}
            style={styles.amountContainer}
            keyExtractor={item => item.toString()}
            renderItem={({ item }) => (
              <AmountSelector
                value={item}
                isSelected={selectedAmount === item}
                onPress={() => actions.selectAmount(item)}
              />
            )}
          />
          <BarterComponents.ModButtons />
        </Section>
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
