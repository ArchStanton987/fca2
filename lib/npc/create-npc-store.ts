import beasts from "lib/npc/const/beasts"
import humanTemplates from "lib/npc/const/human-templates"
import robots from "lib/npc/const/robots"
import { create } from "zustand"
import { useShallow } from "zustand/shallow"

import { TemplateId } from "../character/info/CharInfo"
import { SpeciesId } from "../character/playable.const"
import npcTemplates from "./const/npc-templates"

type NpcTemplate = Exclude<TemplateId, "player">

export type CreateNpcForm = {
  speciesId: SpeciesId
  templateId: NpcTemplate
  firstname: string
  lastname: string
  description?: string
  level: string
  isEnemy: boolean
}

type CreateNpcActions = {
  actions: {
    toggleType: () => void
    setFirstname: (string: string) => void
    setLastname: (string: string) => void
    setLevel: (string: string) => void
    setDescription: (string: string) => void
    toggleHostile: () => void
    selectTemplate: (t: NpcTemplate) => void
    reset: () => void
  }
}
type CreateNpcStore = CreateNpcForm & CreateNpcActions

const getRandomTemplate = (speciesId: SpeciesId) => {
  let templateKeys = Object.keys(humanTemplates)
  if (speciesId === "robot") templateKeys = Object.keys(robots)
  if (speciesId === "beast") templateKeys = Object.keys(beasts)
  const randomIndex = Math.floor(Math.random() * templateKeys.length)
  return templateKeys[randomIndex] as keyof typeof npcTemplates
}

const readySpecies: Partial<SpeciesId>[] = ["beast", "human", "robot"]

export const useCreateNpcStore = create<CreateNpcStore>()((set, _, store) => ({
  speciesId: "human" as SpeciesId,
  templateId: getRandomTemplate("human"),
  firstname: "",
  lastname: "",
  description: "",
  level: "1",
  isEnemy: true,
  actions: {
    toggleType: () =>
      set(state => {
        const currIndex = readySpecies.indexOf(state.speciesId)
        const newIndex = (currIndex + 1) % readySpecies.length
        const speciesId = readySpecies[newIndex]
        const templateId = getRandomTemplate(speciesId)
        return { ...state, speciesId, templateId, lastname: "" }
      }),
    setFirstname: (firstname: string) => set(() => ({ firstname })),
    setLastname: (lastname: string) => set(() => ({ lastname })),
    setDescription: (description: string) => set(() => ({ description })),
    setLevel: (level: string) => set(() => ({ level })),
    toggleHostile: () => set(state => ({ isEnemy: !state.isEnemy })),
    selectTemplate: (templateId: NpcTemplate) => set(() => ({ templateId })),
    reset: () => set(() => store.getInitialState())
  }
}))

export const useCreateNpcActions = () => useCreateNpcStore(state => state.actions)
export const useCreateNpcSpeciesId = () => useCreateNpcStore(state => state.speciesId)
export const useCreateNpcTemplateId = () => useCreateNpcStore(state => state.templateId)
export const useCreateNpcFirstname = () => useCreateNpcStore(state => state.firstname)
export const useCreateNpcLastname = () => useCreateNpcStore(state => state.lastname)
export const useCreateNpcDescription = () => useCreateNpcStore(state => state.description)
export const useCreateNpcLevel = () => useCreateNpcStore(state => state.level.toString())
export const useCreateNpcIsHostile = () => useCreateNpcStore(state => state.isEnemy)
export const useCreateNpcPayload = () =>
  useCreateNpcStore(
    useShallow(state => ({
      speciesId: state.speciesId,
      templateId: state.templateId,
      firstname: state.firstname,
      lastname: state.lastname,
      description: state.description,
      level: state.level,
      isEnemy: state.isEnemy
    }))
  )
