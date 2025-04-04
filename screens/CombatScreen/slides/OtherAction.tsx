import Section from "components/Section"
import TxtInput from "components/TxtInput"
import { useActionApi, useActionForm } from "providers/ActionProvider"

export default function OtherAction() {
  const { actionSubtype } = useActionForm()
  const { setForm } = useActionApi()

  return (
    <Section style={{ width: 180 }} title="action">
      <TxtInput value={actionSubtype} onChangeText={e => setForm({ actionSubtype: e })} />
    </Section>
  )
}
