const charSelection = "/squad/[squadId]"
export const charRoute = `${charSelection}/character/[charId]`
const main = `${charRoute}/(nav)/main`
const inventory = `${charRoute}/(nav)/inventory`
const combat = `${charRoute}/(nav)/combat`
const modal = `${charRoute}/(modal)`

const routes = {
  home: "/",
  charSelection,
  admin: {
    index: `${charSelection}/admin`
  },
  main: {
    index: `${main}/recap`,
    effects: `${main}/effects`,
    special: `${main}/special`,
    secAttr: `${main}/secAttr`,
    skills: `${main}/skills`,
    knowledges: `${main}/knowledges`,
    perks: `${main}/perks`
  },
  inventory: {
    weapons: `${inventory}/weapons`,
    clothings: `${inventory}/clothings`,
    consumables: `${inventory}/consumables`,
    miscObj: `${inventory}/misc-objects`,
    ammo: `${inventory}/ammo`
  },
  combat,
  modal: {
    updateEffects: `${modal}/update-effects`,
    updateEffectsConfirmation: `${modal}/update-effects-confirmation`,
    updateSkills: `${modal}/update-skills`,
    updateSkillsConfirmation: `${modal}/update-skills-confirmation`,
    updateHealth: `${modal}/update-health`,
    updateHealthConfirmation: `${modal}/update-health-confirmation`,
    updateStatus: `${modal}/update-status`,
    updateObjects: `${modal}/update-objects`,
    updateObjectsConfirmation: `${modal}/update-objects-confirmation`,
    updateKnowledges: `${modal}/update-knowledges`,
    updateFreeKnowledges: `${modal}/update-free-knowledges`,
    updateKnowledgesConfirmation: `${modal}/update-knowledges-confirmation`
  }
}

export default routes
