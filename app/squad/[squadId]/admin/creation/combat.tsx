import { useState } from "react"
import { ScrollView, View } from "react-native"

import Toast from "react-native-toast-message"

import CheckBox from "components/CheckBox/CheckBox"
import Col from "components/Col"
import DrawerPage from "components/DrawerPage"
import List from "components/List"
import Row from "components/Row"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import SelectorButton from "components/SelectorButton"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import TxtInput from "components/TxtInput"
import PlusIcon from "components/icons/PlusIcon"
import { useSquad } from "contexts/SquadContext"
import useRtdbSub from "hooks/db/useRtdbSub"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"
import { getDDMMYYYY, getHHMM } from "utils/date"

type Challenger = {
  id: string
  combatStatus?: "active" | "inactive" | "dead" | undefined
  currentCombatId?: string
}

type Form = {
  location?: string
  title: string
  description?: string
  players: Record<string, Challenger>
  enemies: Record<string, Challenger>
}
const defaultForm: Form = {
  location: "",
  title: "",
  description: "",
  players: {},
  enemies: {}
}

export default function CombatCreation() {
  const useCases = useGetUseCases()
  const squad = useSquad()
  const squadPlayers: Form["players"] = {}
  Object.values(squad.membersRecord).forEach(s => {
    squadPlayers[s.id] = { id: s.id }
  })
  const enemies = useRtdbSub(useCases.enemy.subAll())
  const enemyList = Object.entries(enemies ?? {}).map(([id, enemy]) => ({ id, ...enemy }))

  const [form, setForm] = useState<Form>({ ...defaultForm, players: squadPlayers })
  const [isStartingNow, setIsStartingNow] = useState(true)

  const handleSetForm = (key: keyof Form, value: string) => {
    setForm({ ...form, [key]: value })
  }

  const toggleChar = (type: "players" | "enemies", id: string) => {
    if (id in form[type]) {
      setForm(prev => {
        const prevType = { ...prev[type] }
        delete prevType[id]
        return { ...prev, [type]: prevType }
      })
      return
    }
    setForm(prev => ({ ...prev, [type]: { ...prev[type], [id]: id } }))
  }

  const submit = async () => {
    const hasPlayers = Object.keys(form.players).length > 0
    const hasEnemies = Object.keys(form.enemies).length > 0
    const hasTitle = form.title.length > 0

    if (!hasPlayers || !hasEnemies || !hasTitle) {
      Toast.show({ type: "error", text1: "Veuillez remplir tous les champs requis" })
      return
    }

    const { date, squadId } = squad
    const d = getDDMMYYYY(date, "-")
    const h = getHHMM(date, "-")
    const id = `${squad.squadId}_${d}_${h}`
    const payload = { id, ...form, timestamp: date.getTime().toString(), isStartingNow, squadId }
    if (isStartingNow) {
      Object.entries(payload.enemies).forEach(([key, value]) => {
        payload.enemies[key] = { ...value, combatStatus: "active", currentCombatId: id }
      })
      Object.entries(payload.players).forEach(([key, value]) => {
        payload.players[key] = { ...value, combatStatus: "active", currentCombatId: id }
      })
    }

    try {
      await useCases.combat.create(payload)
      Toast.show({ type: "custom", text1: "Le combat a été créé" })
      setForm({ ...defaultForm, players: squadPlayers })
    } catch (err) {
      console.error(err)
      Toast.show({ type: "error", text1: "Erreur lors de la création du combat" })
    }
  }

  return (
    <DrawerPage>
      <ScrollSection style={{ flex: 1 }} title="combat">
        <Row>
          <Txt>Débuter maintenant ?</Txt>
          <Spacer x={20} />
          <CheckBox isChecked={isStartingNow} onPress={() => setIsStartingNow(!isStartingNow)} />
        </Row>

        <Spacer y={layout.globalPadding} />

        <Row>
          <Col style={{ flex: 1 }}>
            <Txt>TITRE</Txt>
            <TxtInput value={form.title} onChangeText={e => handleSetForm("title", e)} />
          </Col>
          <Spacer x={layout.globalPadding} />
          <Col style={{ flex: 1 }}>
            <Txt>LIEU</Txt>
            <TxtInput value={form.location} onChangeText={e => handleSetForm("location", e)} />
          </Col>
        </Row>

        <Spacer y={layout.globalPadding} />

        <Txt>DESCRIPTION</Txt>
        <TxtInput
          value={form.description}
          onChangeText={e => handleSetForm("description", e)}
          multiline
        />

        <Spacer y={layout.globalPadding} />

        <Txt>JOUEURS</Txt>
        <Spacer y={5} />
        <ScrollView horizontal>
          <List
            horizontal
            data={Object.values(squadPlayers)}
            keyExtractor={item => item.id}
            separator={<Spacer x={layout.globalPadding} />}
            renderItem={({ item }) => (
              <SelectorButton
                onPress={() => toggleChar("players", item.id)}
                isSelected={item.id in form.players}
                label={item.id}
              />
            )}
          />
        </ScrollView>

        <Spacer y={layout.globalPadding} />

        <Txt>ENNEMIS</Txt>
        <Spacer y={5} />
        <List
          horizontal
          data={Object.keys(form.enemies)}
          keyExtractor={item => item}
          separator={<Spacer x={layout.globalPadding} />}
          renderItem={({ item }) => (
            <SelectorButton
              onPress={() => toggleChar("enemies", item)}
              isSelected={item in form.enemies}
              label={enemyList?.find(e => e.id === item)?.name ?? item}
            />
          )}
        />

        <Spacer y={80} />
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <View style={{ width: 160 }}>
        <ScrollSection style={{ flex: 1 }} title="enemis">
          <List
            data={enemyList}
            keyExtractor={item => item.id}
            separator={<Spacer y={10} />}
            renderItem={({ item }) => {
              const isSelected = Object.keys(form.enemies).some(e => e === item.id)
              return (
                <Txt
                  style={isSelected && { backgroundColor: colors.terColor, color: colors.secColor }}
                  onPress={() => toggleChar("enemies", item.id)}
                >
                  {item.name}
                </Txt>
              )
            }}
          />
        </ScrollSection>

        <Spacer y={layout.globalPadding} />

        <Section title="enregistrer">
          <View style={{ alignItems: "center" }}>
            <PlusIcon onPress={() => submit()} />
          </View>
        </Section>
      </View>
    </DrawerPage>
  )
}
