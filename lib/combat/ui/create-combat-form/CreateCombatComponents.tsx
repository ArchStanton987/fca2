import { useCharInfo, usePlayablesCharInfo } from "lib/character/info/info-provider"
import {
  useCreateCombatActions,
  useCreateCombatContenders,
  useCreateCombatDescription,
  useCreateCombatIsCharSelected,
  useCreateCombatIsStartingNow,
  useCreateCombatLocation,
  useCreateCombatPayload,
  useCreateCombatTitle
} from "lib/combat/create-combat-store"
import { useSquad } from "lib/squad/use-cases/sub-squad"
import Toast from "react-native-toast-message"

import CheckBox from "components/CheckBox/CheckBox"
import List from "components/List"
import SelectorButton from "components/SelectorButton"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import TxtInput from "components/TxtInput"
import PlusIcon from "components/icons/PlusIcon"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

function IsStartingNowInput() {
  const actions = useCreateCombatActions()
  const isStartingNow = useCreateCombatIsStartingNow()
  return (
    <>
      <Txt>Débuter maintenant ?</Txt>
      <Spacer x={20} />
      <CheckBox isChecked={isStartingNow} onPress={() => actions.toggleIsStartingNow()} />
    </>
  )
}

function Title() {
  const actions = useCreateCombatActions()
  const title = useCreateCombatTitle()
  return (
    <>
      <Txt>TITRE</Txt>
      <TxtInput value={title} onChangeText={e => actions.setField("title", e)} />
    </>
  )
}
function Location() {
  const actions = useCreateCombatActions()
  const location = useCreateCombatLocation()
  return (
    <>
      <Txt>LIEU</Txt>
      <TxtInput value={location} onChangeText={e => actions.setField("location", e)} />
    </>
  )
}
function Description() {
  const actions = useCreateCombatActions()
  const description = useCreateCombatDescription()
  return (
    <>
      <Txt>DESCRIPTION</Txt>
      <TxtInput
        multiline
        value={description}
        onChangeText={e => actions.setField("description", e)}
      />
    </>
  )
}
function SelectableChar({ charId }: { charId: string }) {
  const { data: name } = useCharInfo(charId, info => info.fullname)
  const isSelected = useCreateCombatIsCharSelected(charId)
  const actions = useCreateCombatActions()
  return (
    <SelectorButton
      isSelected={isSelected}
      label={name}
      onPress={() => actions.toggleChar(charId)}
    />
  )
}
function NpcListElement({ charId }: { charId: string }) {
  const { data: name } = useCharInfo(charId, info => info.fullname)
  const isSelected = useCreateCombatIsCharSelected(charId)
  const actions = useCreateCombatActions()
  return (
    <Txt
      style={isSelected && { backgroundColor: colors.terColor, color: colors.secColor }}
      onPress={() => actions.toggleChar(charId)}
    >
      {name}
    </Txt>
  )
}
function PlayersList({ squadId }: { squadId: string }) {
  const { data: members } = useSquad(squadId, squad => Object.keys(squad.members))
  return (
    <List
      horizontal
      data={members}
      keyExtractor={item => item}
      separator={<Spacer x={layout.globalPadding} />}
      renderItem={({ item }) => <SelectableChar charId={item} />}
    />
  )
}
function NpcContendersList() {
  const contenders = useCreateCombatContenders()
  const infos = usePlayablesCharInfo(contenders)
  const data = Object.entries(infos)
    .filter(([, value]) => value.isNpc)
    .map(([id]) => id)
  return (
    <List
      horizontal
      data={data}
      keyExtractor={item => item}
      separator={<Spacer x={layout.globalPadding} />}
      renderItem={({ item }) => <SelectableChar charId={item} />}
    />
  )
}
function NpcList({ squadId }: { squadId: string }) {
  const { data: npcs } = useSquad(squadId, squad => Object.keys(squad.npcs))
  return (
    <List
      data={npcs}
      keyExtractor={e => e}
      separator={<Spacer y={10} />}
      renderItem={({ item }) => <NpcListElement charId={item} />}
    />
  )
}
function Submit({ squadId }: { squadId: string }) {
  const useCases = useGetUseCases()

  const actions = useCreateCombatActions()
  const payload = useCreateCombatPayload(squadId)

  const playablesInfos = usePlayablesCharInfo(payload.contenders)

  const submit = async () => {
    const hasAlly = Object.values(playablesInfos).some(info => !info.isEnemy)
    const hasEnemy = Object.values(playablesInfos).some(info => info.isEnemy)
    const hasTitle = payload.title.length > 0
    const isDisabled = !hasAlly || !hasEnemy || !hasTitle
    if (isDisabled) {
      Toast.show({ type: "error", text1: "Veuillez remplir tous les champs requis" })
      return
    }
    try {
      await useCases.combat.create(payload)
      actions.reset()
      Toast.show({ type: "custom", text1: "Le combat a été créé" })
    } catch (err) {
      Toast.show({ type: "error", text1: "Erreur lors de la création du combat" })
    }
  }
  return <PlusIcon onPress={submit} />
}

const CreateCombatComponents = {
  IsStartingNowInput,
  Title,
  Location,
  Description,
  SelectableChar,
  NpcListElement,
  NpcContendersList,
  PlayersList,
  NpcList,
  Submit
}

export default CreateCombatComponents
