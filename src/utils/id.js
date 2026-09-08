/** Stable, collision-free ids for every editable node in the resume tree. */
let counter = 0

export function uid(prefix = 'n') {
  counter += 1
  const rand = Math.random().toString(36).slice(2, 8)
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}${rand}`
}

/** Immutably replace the item with `id` inside `list` using `updater`. */
export function updateById(list, id, updater) {
  return list.map((item) => (item.id === id ? updater(item) : item))
}

/** Move the element at `index` by `delta` positions, clamped to the array. */
export function move(list, index, delta) {
  const next = index + delta
  if (next < 0 || next >= list.length) return list
  const copy = [...list]
  const [item] = copy.splice(index, 1)
  copy.splice(next, 0, item)
  return copy
}
