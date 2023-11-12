import { ChangeableAttribute } from "./changeable-attr"
import { OperationType } from "./operation-type"

export type Symptom = {
  id: ChangeableAttribute
  operation: OperationType
  value: number
}

export type Modifier = {
  id: ChangeableAttribute
  operation: OperationType
  value: number
}
