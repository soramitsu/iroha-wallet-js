import { format } from 'date-fns'

const dateFormat = {
  filters: {
    formatDate: date => format(date, 'MMM. D, HH:mm'),
    formatDateLong: date => format(date, 'MMMM D, YYYY HH:mm:ss')
  }
}

export default dateFormat
export const filters = dateFormat.filters
