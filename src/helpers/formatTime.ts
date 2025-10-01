import moment from "moment";

export const formatTime = (date?: Date) => {
  return date ? moment(date).format("hh:mmA") : "";
};

export const formatDuration = (minutes: number): string => {
  const d = moment.duration(minutes, "minutes");
  const hours = Math.floor(d.asHours());
  const mins = d.minutes();

  return hours > 0 ? `${hours}h${mins.toString().padStart(2, "0")}` : `${mins}min`;
}

export const getTravelMinutes = (distance: number, speed: number) => {
  return (distance / speed) * 60;
}

export const getDurationBetween = (start: Date, end: Date) => {
  return moment(end).diff(moment(start), "minutes");
}
