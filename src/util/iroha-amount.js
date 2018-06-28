/*
 * modify an amount object to a string like '123.45'
 */
export function amountToString ({ value, precision }) {
  // TODO: use all values from 'first' to 'fourth'
  return String(value.fourth)
    .padStart(precision, '0')
    .replace(RegExp(`(\\d{${precision}})$`), '.$1')
    .replace(/^\./, '0.')
    .replace(/\.$/, '')
}
