import Field from '../../ui/Field'
import { getLimit } from '../../../utils/limits'

export default function SummaryEditor({ section, template, actions }) {
  return (
    <Field
      label="Paragraph"
      multiline
      rows={7}
      value={section.text}
      limit={getLimit(template, 'summary', 'text')}
      placeholder="Write 3–4 sentences about your profile, strengths and focus areas."
      hint="Line breaks are preserved. Staying inside the budget keeps the column balanced."
      onChange={(text) => actions.updateSection({ text })}
    />
  )
}
