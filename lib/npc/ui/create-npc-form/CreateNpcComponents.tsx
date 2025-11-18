import { species } from "lib/character/playable.const"
import { HumanTemplate } from "lib/npc/const/human-templates"
import npcTemplates from "lib/npc/const/npc-templates"
import {
  useCreateNpcActions,
  useCreateNpcDescription,
  useCreateNpcFirstname,
  useCreateNpcIsHostile,
  useCreateNpcLastname,
  useCreateNpcLevel,
  useCreateNpcPayload,
  useCreateNpcSpeciesId,
  useCreateNpcTemplateId
} from "lib/npc/create-npc-store"
import { NonHumanNpcTemplate } from "lib/npc/npc.types"
import Toast from "react-native-toast-message"

import List from "components/List"
import Selectable from "components/Selectable"
import SelectorButton from "components/SelectorButton"
import Txt from "components/Txt"
import TxtInput from "components/TxtInput"
import PlusIcon from "components/icons/PlusIcon"
import { useGetUseCases } from "providers/UseCasesProvider"

function SpeciesSelector() {
  const speciesId = useCreateNpcSpeciesId()
  const actions = useCreateNpcActions()
  return (
    <>
      <Txt>TYPE</Txt>
      <SelectorButton
        isSelected={false}
        onPress={() => actions.toggleType()}
        label={species[speciesId]}
      />
    </>
  )
}
function FirstnamteInput() {
  const firstname = useCreateNpcFirstname()
  const actions = useCreateNpcActions()
  return (
    <>
      <Txt>FIRSTNAME</Txt>
      <TxtInput value={firstname} onChangeText={e => actions.setFirstname(e)} />
    </>
  )
}
function LastnameInput() {
  const lastname = useCreateNpcLastname()
  const speciesId = useCreateNpcSpeciesId()
  const actions = useCreateNpcActions()
  const isCritter = speciesId === "robot" || speciesId === "beast"
  if (isCritter) return null
  return (
    <>
      <Txt>FIRSTNAME</Txt>
      <TxtInput value={lastname} onChangeText={e => actions.setLastname(e)} />
    </>
  )
}
function Template() {
  const speciesId = useCreateNpcSpeciesId()
  const templateId = useCreateNpcTemplateId()
  const speciesRef = speciesId !== "beast" && speciesId !== "robot" ? "human" : speciesId
  const { label } = npcTemplates[speciesRef][templateId]
  return (
    <>
      <Txt>TEMPLATE</Txt>
      <Txt>{label}</Txt>
    </>
  )
}
function Hostile() {
  const actions = useCreateNpcActions()
  const isEnemy = useCreateNpcIsHostile()
  return (
    <>
      <Txt>HOSTILE</Txt>
      <SelectorButton
        isSelected={false}
        onPress={() => actions.toggleHostile()}
        label={isEnemy ? "ENEMY" : "ALLY"}
      />
    </>
  )
}
function Level() {
  const actions = useCreateNpcActions()
  const level = useCreateNpcLevel()
  const speciesId = useCreateNpcSpeciesId()
  const hasLevel = speciesId !== "robot" && speciesId !== "beast"
  if (!hasLevel) return null
  return (
    <>
      <Txt>LEVEL</Txt>
      <TxtInput value={level} onChangeText={e => actions.setLevel(e)} />
    </>
  )
}
function Description() {
  const actions = useCreateNpcActions()
  const description = useCreateNpcDescription()
  return (
    <>
      <Txt>DESCRIPTION</Txt>
      <TxtInput value={description} onChangeText={e => actions.setDescription(e)} multiline />
    </>
  )
}

type TemplateType = HumanTemplate | NonHumanNpcTemplate

function TemplateList() {
  const actions = useCreateNpcActions()
  const speciesId = useCreateNpcSpeciesId()
  const templateId = useCreateNpcTemplateId()
  const templateType = speciesId === "robot" || speciesId === "beast" ? speciesId : "human"
  const templates: TemplateType[] = Object.values(npcTemplates[templateType])
  return (
    <List
      data={templates}
      keyExtractor={t => t.templateId}
      renderItem={({ item }) => (
        <Selectable
          isSelected={templateId === item.templateId}
          onPress={() => actions.selectTemplate(item.templateId)}
        >
          <Txt>{item.label}</Txt>
        </Selectable>
      )}
    />
  )
}

function Submit({ squadId }: { squadId: string }) {
  const useCases = useGetUseCases()
  const actions = useCreateNpcActions()
  const npc = useCreateNpcPayload()

  const submit = async () => {
    try {
      await useCases.npc.create({ npc, squadId })
      Toast.show({ type: "custom", text1: "Le PNJ a été créé" })
      actions.reset()
    } catch (err) {
      console.log("err", err)
      Toast.show({ type: "error", text1: "Erreur lors de la création du PNJ" })
    }
  }

  return <PlusIcon onPress={() => submit()} />
}

const createNpcComponents = {
  SpeciesSelector,
  FirstnamteInput,
  LastnameInput,
  Template,
  Hostile,
  Level,
  Description,
  TemplateList,
  Submit
}
export default createNpcComponents
