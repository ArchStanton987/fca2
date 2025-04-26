const dbKeys = {
  squads: "/v2/squads",
  squad: (squadId: string) => ({
    index: `/v2/squads/${squadId}`,
    members: `/v2/squads/${squadId}/members`,
    datetime: `/v2/squads/${squadId}/datetime`
  }),
  char: (charType: "enemies" | "characters", charId: string) => ({
    index: `/v2/${charType}/${charId}`,
    abilities: {
      index: `/v2/${charType}/${charId}/abilities`,
      baseSPECIAL: `/v2/${charType}/${charId}/abilities/baseSPECIAL`,
      knowledges: `/v2/${charType}/${charId}/abilities/knowledges`,
      upSkills: `/v2/${charType}/${charId}/abilities/upSkills`,
      perks: `/v2/${charType}/${charId}/abilities/perks`,
      traits: `/v2/${charType}/${charId}/abilities/traits`
    },
    knowledges: `/v2/${charType}/${charId}/abilities/knowledges`,
    baseSpecial: `/v2/${charType}/${charId}/abilities/baseSPECIAL`,
    effects: `/v2/${charType}/${charId}/effects`,
    inventory: {
      index: `/v2/${charType}/${charId}/inventory`,
      ammo: `/v2/${charType}/${charId}/inventory/ammo`,
      caps: `/v2/${charType}/${charId}/status/caps`,
      weapons: `/v2/${charType}/${charId}/inventory/weapons`,
      clothings: `/v2/${charType}/${charId}/inventory/clothings`,
      consumables: `/v2/${charType}/${charId}/inventory/consumables`,
      miscObjects: `/v2/${charType}/${charId}/inventory/miscObjects`
    },
    equipedObjects: {
      index: `/v2/${charType}/${charId}/equipedObj`,
      weapons: `/v2/${charType}/${charId}/equipedObj/weapons`,
      clothings: `/v2/${charType}/${charId}/equipedObj/clothings`
    },
    status: {
      index: `/v2/${charType}/${charId}/status`
    }
  })
}

export default dbKeys
