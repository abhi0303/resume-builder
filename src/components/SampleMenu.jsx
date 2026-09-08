import MenuButton from './ui/MenuButton'
import { SAMPLES } from '../data/samples'

export default function SampleMenu({ onPick, className = 'tb-btn' }) {
  return (
    <MenuButton className={className} title="Load a ready-made CV" label={<>Samples ▾</>}>
      {SAMPLES.map((sample) => (
        <button type="button" key={sample.id} className="menu__item" role="menuitem" onClick={() => onPick(sample.id)}>
          <span className="menu__title">{sample.person}</span>
          <span className="menu__hint">
            {sample.label} · {sample.template}
          </span>
        </button>
      ))}
    </MenuButton>
  )
}
