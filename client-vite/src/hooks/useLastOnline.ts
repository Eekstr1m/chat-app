export default function useLastOnline(lastOnlineDate: Date) {
  const currentDate = new Date();
  const date = new Date(lastOnlineDate);

  const convertedTime = date.toLocaleTimeString("en-EN", {
    hourCycle: "h24",
    hour: "2-digit",
    minute: "2-digit",
  });

  const convertedDay = date.toLocaleDateString("en-EN", {
    day: "numeric",
    month: "long",
  });

  const isToday =
    currentDate.getUTCDate() === date.getUTCDate() &&
    currentDate.getUTCMonth() === date.getUTCMonth() &&
    currentDate.getUTCFullYear === date.getUTCFullYear;

  return {
    convertedDay,
    convertedTime,
    isToday: isToday,
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
  };
}
