import Section from "components/Section"
import TxtInput from "components/TxtInput"
import { useActionApi, useActionSubtype } from "providers/ActionFormProvider"

export default function OtherAction() {
  const actionSubtype = useActionSubtype()
  const { setForm } = useActionApi()

  return (
    <Section style={{ flex: 1 }} title="action">
      <TxtInput value={actionSubtype} onChangeText={e => setForm({ actionSubtype: e })} />
    </Section>
  )
}
