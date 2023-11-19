const charSelection = "/squad/[squadId]"
export const charRoute = `${charSelection}/character/[charId]`
const main = `${charRoute}/main`
const inventory = `${charRoute}/inventory`
const combat = `${charRoute}/combat`

const routes = {
  home: "/",
  charSelection,
  main: {
    index: `${main}/recap`,
    effects: `${main}/effects`,
    special: `${main}/special`,
    secAttr: `${main}/secAttr`,
    skills: `${main}/skills`,
    knowledges: `${main}/knowledges`
  },
  inventory: {
    weapons: `${inventory}/weapons`,
    clothings: `${inventory}/clothings`,
    consumables: `${inventory}/consumables`,
    miscObj: `${inventory}/misc-objects`,
    ammo: `${inventory}/ammo`
  },
  combat
}

export default routes
