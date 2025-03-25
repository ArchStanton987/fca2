import database from "config/firebase-env"
import { child, push, ref, update } from "firebase/database"

import { BaseParams, DbEntity, Repository } from "./Repository"
import rtdb from "./api-rtdb"
import { RtdbReturnTypes } from "./api-rtdb.types"
import getSub from "./get-sub"
import updateValue from "./update-value"

export default abstract class RtdbRepository<Db extends DbEntity, BP extends BaseParams>
  implements Repository<Db, BP>
{
  rtdb = rtdb
  abstract getPath(params: BP & { childKey?: keyof Db }): RtdbReturnTypes

  subGetValue = null

  get = (params: BP) => getSub<Db>(this.getPath(params)).getSnapshot()

  getChild = <K extends keyof Db>(params: BP & { childKey: K }) =>
    getSub<Db[K]>(this.getPath(params)).getSnapshot()

  sub = (params: BP) => getSub<Db>(this.getPath(params))

  subChild = <K extends keyof Db>(params: BP & { childKey: K }) =>
    getSub<Db[K]>(this.getPath(params))

  set = (params: BP, data: Db) => updateValue(this.getPath(params), data)

  add = <K extends keyof Db | undefined = undefined>(
    params: K extends keyof Db ? BP & { childKey: K } : BP & { childKey?: never },
    data: K extends keyof Db ? Db[K] : Db
  ) => push(child(ref(database), this.getPath(params)), data)

  setChild = <K extends keyof Db>(params: BP & { childKey: K }, data: Db[K]) =>
    updateValue(this.getPath(params), data)

  setChildren = (params: BP, data: Partial<Db>) => {
    const updatesObj: Record<RtdbReturnTypes, any> = {}
    Object.entries(data).forEach(([key, value]) => {
      updatesObj[this.getPath({ ...params, childKey: key })] = value
    })
    return update(ref(database), updatesObj)
  }

  delete = (params: BP) => updateValue(this.getPath(params), null)

  deleteChild = <K extends keyof Db>(params: BP & { childKey: K }) =>
    updateValue(this.getPath(params), null)

  deleteChildren = <K extends keyof Db>(params: BP, keys: K[]) => {
    const updatesObj: Record<RtdbReturnTypes, any> = {}
    keys.forEach(key => {
      updatesObj[this.getPath({ ...params, childKey: key })] = null
    })
    return update(ref(database), updatesObj)
  }
}
