export function numberToCurrency(x: number | string, decimals: number = 2): string {
  x = Number(x).toFixed(decimals).toString()
  const pattern = /(-?\d+)(\d{3})/
  while (pattern.test(x)) x = x.replace(pattern, "$1,$2") as string
  return x
}
