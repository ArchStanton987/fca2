const dbKeys = {
  squads: "/v3/squads",
  squad: (squadId: string) => ({
    index: `/v3/squads/${squadId}`,
    members: `/v3/squads/${squadId}/members`,
    datetime: `/v3/squads/${squadId}/datetime`
  }),
  char: (charId: string) => ({
    index: `/v3/playables/${charId}`,
    abilities: {
      index: `/v3/playables/${charId}/abilities`,
      baseSPECIAL: `/v3/playables/${charId}/abilities/baseSPECIAL`,
      knowledges: `/v3/playables/${charId}/abilities/knowledges`,
      upSkills: `/v3/playables/${charId}/abilities/upSkills`,
      perks: `/v3/playables/${charId}/abilities/perks`,
      traits: `/v3/playables/${charId}/abilities/traits`
    },
    knowledges: `/v3/playables/${charId}/abilities/knowledges`,
    baseSpecial: `/v3/playables/${charId}/abilities/baseSPECIAL`,
    effects: `/v3/playables/${charId}/effects`,
    inventory: {
      index: `/v3/playables/${charId}/inventory`,
      ammo: `/v3/playables/${charId}/inventory/ammo`,
      caps: `/v3/playables/${charId}/status/caps`,
      weapons: `/v3/playables/${charId}/inventory/weapons`,
      clothings: `/v3/playables/${charId}/inventory/clothings`,
      consumables: `/v3/playables/${charId}/inventory/consumables`,
      miscObjects: `/v3/playables/${charId}/inventory/miscObjects`
    },
    equipedObjects: {
      index: `/v3/playables/${charId}/equipedObj`,
      weapons: `/v3/playables/${charId}/equipedObj/weapons`,
      clothings: `/v3/playables/${charId}/equipedObj/clothings`
    },
    status: {
      index: `/v3/playables/${charId}/status`
    }
  })
}

export default dbKeys
