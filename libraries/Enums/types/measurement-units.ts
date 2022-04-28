export enum MeasurementUnitsEnum {
  DAY = 'day',
  MINUTES = 'minutes',
}

export type MeasurementUnits = keyof typeof MeasurementUnitsEnum
