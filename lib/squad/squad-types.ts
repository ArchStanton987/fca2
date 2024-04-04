export type DbSquadMember = {
  exp: number
  firstname: string
  lastname: string
}

export type DbSquad = {
  datetime: string
  isInFight: boolean
  label: string
  members: Record<string, DbSquadMember>
}

export type SquadMember = {
  id: string
  exp: number
  firstname: string
  lastname: string
}
