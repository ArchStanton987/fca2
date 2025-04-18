import { StyleSheet, TouchableOpacity, View } from "react-native"

import { Perk } from "lib/character/abilities/perks/perks.types"
import { Trait } from "lib/character/abilities/traits/traits.types"
import { changeableAttributesMap } from "lib/character/effects/changeable-attr"
import { Symptom } from "lib/character/effects/symptoms.type"

import Txt from "components/Txt"
import colors from "styles/colors"

type TraitPerkRowProps = {
  trait: Trait | Perk
  onPress: (trait: Trait | Perk) => void
  isSelected: boolean
}

const getSymptomDisplayValue = (symptom: Symptom) => {
  switch (symptom.operation) {
    case "add": {
      if (symptom.value > 0) return `+${symptom.value}`
      return symptom.value.toString()
    }
    case "mult": {
      const percent = Math.round((symptom.value - 1) * 100)
      return `${percent > 0 ? "+" : ""}${percent}%`
    }
    case "abs": {
      return symptom.value.toString()
    }
    default: {
      return "Unknown"
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 5
  },
  selected: {
    backgroundColor: colors.terColor
  },
  label: {
    flex: 1
  },
  symptoms: {
    width: 80,
    alignItems: "flex-end"
  },
  symptom: {
    fontSize: 12,
    textAlign: "right"
  }
})

export default function TraiPerktRow({ trait, onPress, isSelected }: TraitPerkRowProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(trait)}
      style={[styles.container, isSelected && styles.selected]}
    >
      <Txt style={styles.label}>{trait.label}</Txt>
      <View style={styles.symptoms}>
        {trait.symptoms.map(symptom => (
          <Txt key={symptom.id} style={styles.symptom}>
            {changeableAttributesMap[symptom.id].short}: {getSymptomDisplayValue(symptom)}
          </Txt>
        ))}
      </View>
    </TouchableOpacity>
  )
}
