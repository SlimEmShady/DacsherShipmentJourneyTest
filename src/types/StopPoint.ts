export interface StopPoint {
  name: string;
  distanceFromPreviousPoint: number;
  totalDistance?: number;
  stopDuration?: number;
  arrivalTime?: Date;
  departureTime?: Date;
}
