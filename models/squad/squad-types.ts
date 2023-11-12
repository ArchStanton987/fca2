export type SquadMember = {
  id: string
  exp: number
  firstname: string
  lastname: string
}

export type Squad = {
  id: string
  label: string
  members: Record<string, SquadMember>
  datetime: number
}
