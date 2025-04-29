export type DbSquadMember = {
  exp: number
  firstname: string
  lastname: string
}

export type DbSquad = {
  datetime: string
  label: string
  members: Record<string, DbSquadMember>
  npc: Record<string, string>
  combats?: Record<string, string>
}

export type SquadMember = {
  id: string
  exp: number
  firstname: string
  lastname: string
}
