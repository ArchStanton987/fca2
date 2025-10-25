import { useState } from "react"
import { ScrollView, TouchableOpacityProps, View } from "react-native"

import { useLocalSearchParams } from "expo-router"

import { useCharInfo } from "lib/character/info/info-provider"
import { useDatetime, useSquadMembers, useSquadNpcs } from "lib/squad/use-cases/sub-squad"
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
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

type Form = {
  location?: string
  title: string
  description?: string
  players: Record<string, string>
  npcs: Record<string, string>
}
const defaultForm: Form = {
  location: "",
  title: "",
  description: "",
  players: {},
  npcs: {}
}

function SelectableChar({
  charId,
  isSelected,
  ...rest
}: {
  charId: string
  isSelected: boolean
} & TouchableOpacityProps) {
  const { data: name } = useCharInfo(charId, info => info.fullname)
  return <SelectorButton isSelected={isSelected} label={name} {...rest} />
}

function NpcListElement({
  isSelected,
  charId,
  onPress
}: {
  isSelected: boolean
  charId: string
  onPress: () => void
}) {
  const { data: name } = useCharInfo(charId, info => info.fullname)
  return (
    <Txt
      style={isSelected && { backgroundColor: colors.terColor, color: colors.secColor }}
      onPress={onPress}
    >
      {name}
    </Txt>
  )
}

export default function CombatCreation() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const useCases = useGetUseCases()
  const { data: players } = useSquadMembers(squadId)
  const { data: npcs } = useSquadNpcs(squadId)
  const { data: datetime } = useDatetime(squadId)

  const [form, setForm] = useState<Form>({ ...defaultForm, players })
  const [isStartingNow, setIsStartingNow] = useState(true)

  const handleSetForm = (key: keyof Form, value: string) => {
    setForm({ ...form, [key]: value })
  }

  const toggleChar = (type: "players" | "npcs", id: string) => {
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
    const hasEnemies = Object.keys(form.npcs).length > 0
    const hasTitle = form.title.length > 0

    if (!hasPlayers || !hasEnemies || !hasTitle) {
      Toast.show({ type: "error", text1: "Veuillez remplir tous les champs requis" })
      return
    }

    const contenders = Object.keys({ ...form.players, ...form.npcs })
    const payload = { ...form, date: datetime.toJSON(), isStartingNow, gameId: squadId, contenders }
    try {
      await useCases.combat.create(payload)
      Toast.show({ type: "custom", text1: "Le combat a été créé" })
      setForm({ ...defaultForm, players })
    } catch (err) {
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
            data={Object.keys(players)}
            keyExtractor={item => item}
            separator={<Spacer x={layout.globalPadding} />}
            renderItem={({ item }) => (
              <SelectableChar
                onPress={() => toggleChar("players", item)}
                isSelected={item in form.npcs}
                charId={item}
              />
            )}
          />
        </ScrollView>

        <Spacer y={layout.globalPadding} />

        <Txt>PNJs</Txt>
        <Spacer y={5} />
        <List
          horizontal
          data={Object.keys(form.npcs)}
          keyExtractor={item => item}
          separator={<Spacer x={layout.globalPadding} />}
          renderItem={({ item }) => (
            <SelectableChar
              onPress={() => toggleChar("npcs", item)}
              isSelected={item in form.npcs}
              charId={item}
            />
          )}
        />

        <Spacer y={80} />
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <View style={{ width: 160 }}>
        <ScrollSection style={{ flex: 1 }} title="PNJs">
          <List
            data={Object.keys(npcs)}
            keyExtractor={e => e}
            separator={<Spacer y={10} />}
            renderItem={({ item }) => {
              const isSelected = Object.keys(form.npcs).some(e => e === item)
              return (
                <NpcListElement
                  charId={item}
                  isSelected={isSelected}
                  onPress={() => toggleChar("npcs", item)}
                />
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
