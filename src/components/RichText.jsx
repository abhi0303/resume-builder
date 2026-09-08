import { runStyle, toRuns } from '../utils/richText'

/** Renders a rich-text value inside a template. Marks are relative, so they
 *  compose with whatever size and colour the template gives the field. */
export default function RichText({ value }) {
  return (
    <>
      {toRuns(value).map((run, index) => (
        <span key={index} style={runStyle(run)}>
          {run.text}
        </span>
      ))}
    </>
  )
}
