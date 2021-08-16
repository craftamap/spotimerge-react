const difference = (a, b) => {
  return [...a].filter(x => !b.has(x))
}

export {
  difference,
}
