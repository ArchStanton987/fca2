import { StyleSheet } from "react-native"

import Animated, { FadingTransition } from "react-native-reanimated"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCombat } from "providers/CombatProvider"
import colors from "styles/colors"

type OrderRowProps = {
  name?: string
  ap?: number
  initiative?: number
  isWaiting?: boolean
  isPlaying?: boolean
  isDone?: boolean
}

const styles = StyleSheet.create({
  row: {
    borderWidth: 2,
    borderColor: "transparent",
    padding: 5,
    flexDirection: "row"
  },
  nameCol: {
    flex: 1
  },
  dataCol: {
    width: 90
  },
  playing: {
    borderColor: colors.secColor
  },
  waiting: {
    color: colors.terColor
  },
  done: {
    textDecorationLine: "line-through"
  }
})

function OrderRow(props: OrderRowProps) {
  const { name, ap, initiative, isPlaying, isDone, isWaiting } = props
  return (
    <Animated.View layout={FadingTransition} style={[styles.row, isPlaying && styles.playing]}>
      {name && (
        <Txt
          style={[
            styles.nameCol,
            isPlaying && styles.playing,
            isWaiting && styles.waiting,
            isDone && styles.done
          ]}
        >
          {name}
        </Txt>
      )}
      <Txt
        style={[
          styles.dataCol,
          isPlaying && styles.playing,
          isWaiting && styles.waiting,
          isDone && styles.done
        ]}
      >
        {ap ?? 0}
      </Txt>
      {initiative && (
        <Txt
          style={[
            styles.dataCol,
            isPlaying && styles.playing,
            isWaiting && styles.waiting,
            isDone && styles.done
          ]}
        >
          {initiative ?? 1000}
        </Txt>
      )}
    </Animated.View>
  )
}

export default function GMCombatScreen() {
  const { combat, players, npcs } = useCombat()

  if (!combat || !players || !npcs) return <Txt>Impossible de récupérer le combat</Txt>

  const contenders = Object.values({ ...players, ...npcs }).sort((a, b) => {
    const aCurrAp = a.char.status.currAp
    const bCurrAp = b.char.status.currAp
    const aInit = a.combatData.initiative
    const bInit = b.combatData.initiative
    if (aCurrAp === bCurrAp) {
      if (aInit === bInit) return 0
      return aInit > bInit ? -1 : 1
    }
    return aCurrAp > bCurrAp ? -1 : 1
  })

  return (
    <DrawerPage>
      <ScrollSection title="ordre" style={{ flex: 1 }}>
        <List
          data={contenders}
          keyExtractor={item => item.char.charId}
          separator={<Spacer y={10} />}
          renderItem={({ item }) => (
            <OrderRow
              name={item.char.meta.firstname}
              ap={item.char.status.currAp}
              initiative={item.combatData.initiative}
            />
          )}
        />
      </ScrollSection>
    </DrawerPage>
  )
}
