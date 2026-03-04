import moment from "moment";

export function getCurrenDateUtil(): string {
  const now = new Date()
  const date = `${now.getFullYear()}-${(now.getUTCMonth() + 1)
    .toString()
    .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`
  return date
}

export function getCurrentDateTime({endDate} : {endDate: boolean}): string {
  if(endDate) {
    return moment().endOf('day').format("YYYY-MM-DDTHH:mm");
  } 
  return moment().startOf('day').format("YYYY-MM-DDTHH:mm");
}

export function dateTimeToQuery(date: string): string {
  return moment(date, "YYYY-MM-DDTHH:mm").format("YYYY-MM-DD HH:mm:ss");
}

export function dateUTCToFriendly(date: string, justDate: boolean = false): string {
  if(date == null) return ""
  const dateSplitted = date.split("T")
  const dates = dateSplitted[0]
  const time = dateSplitted[1]
  const timeSplitted = time.split(":")
  const dateFriend = dates.split("-").reverse().join("/");
  const timeFriend = `${timeSplitted[0]}:${ timeSplitted[1] }:${timeSplitted[2].split(".")[0]}`
  if(justDate) return dateFriend
  return `${dateFriend} ${timeFriend}`
}

export function dateToInputDate(date: string): string {
  return date.split("T")[0]
}

export function dateSplitted(d: string): { date: string; time: string } {
  const [date, time] = dateUTCToFriendly(d).split(" ")
  return { date, time }
}

export function numberToTime(n: number): string {
  let time = n.toString()
  const timeSplitted = time.split(".")
  if(timeSplitted.length === 1) return `${timeSplitted[0]}:00`
  const minutes = timeSplitted[1].length === 1 ? `${timeSplitted[1]}0` : timeSplitted[1]
  time = `${timeSplitted[0]}:${minutes}`
  console.log({time});
  return time
}

export const convertNumberToTime = (openTime?: number) => {
  if(openTime === undefined) return "00:00"
  const time = openTime.toString().padStart(4, '0')
  const hours = time.slice(0, 2)
  const minutes = time.slice(2)
  return `${hours}:${minutes}`
}

export const isOlderThan3Days = (date: string | Date): boolean => {
  return moment(date).isBefore(moment().subtract(3, "days"), "day");
};