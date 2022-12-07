export type TStats = {
  hours: {
    average: {
      break: number
      work: number
      start: number
    },
    total: {
      work: number
    }
  }
}

/* eslint-disable camelcase */

export type TRawStats = {
  avg_hours_break: number
  avg_hours_worked: number
  avg_start_time: number
  hours_worked: number
}

/* eslint-enable camelcase */
