export type SquadMember = {
  exp: number
  firstname: string
  lastname: string
}

export type Squad = {
  id: string
  datetime: number
  isInFight: boolean
  label: string
  members: SquadMember[]
}
