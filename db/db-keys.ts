const dbKeys = {
  squads: "/v2/squads",
  squad: (squadId: string) => ({
    index: `/v2/squads/${squadId}`,
    members: `/v2/squads/${squadId}/members`,
    datetime: `/v2/squads/${squadId}/datetime`
  }),
  char: (charId: string) => ({
    index: `/v2/characters/${charId}`,
    abilities: {
      index: `/v2/characters/${charId}/abilities`,
      baseSPECIAL: `/v2/characters/${charId}/abilities/baseSPECIAL`,
      knowledges: `/v2/characters/${charId}/abilities/knowledges`,
      upSkills: `/v2/characters/${charId}/abilities/upSkills`,
      perks: `/v2/characters/${charId}/abilities/perks`,
      traits: `/v2/characters/${charId}/abilities/traits`
    },
    knowledges: `/v2/characters/${charId}/abilities/knowledges`,
    baseSpecial: `/v2/characters/${charId}/abilities/baseSPECIAL`,
    effects: `/v2/characters/${charId}/effects`,
    inventory: {
      index: `/v2/characters/${charId}/inventory`,
      ammo: `/v2/characters/${charId}/inventory/ammo`,
      caps: `/v2/characters/${charId}/status/caps`,
      weapons: `/v2/characters/${charId}/inventory/weapons`,
      clothings: `/v2/characters/${charId}/inventory/clothings`,
      consumables: `/v2/characters/${charId}/inventory/consumables`,
      miscObjects: `/v2/characters/${charId}/inventory/miscObjects`
    },
    equipedObjects: {
      index: `/v2/characters/${charId}/equipedObj`,
      weapons: `/v2/characters/${charId}/equipedObj/weapons`,
      clothings: `/v2/characters/${charId}/equipedObj/clothings`
    },
    status: {
      index: `/v2/characters/${charId}/status`
    }
  })
}

export default dbKeys
