export const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export const getRoomId = (userId1, userId2) => {
  const sortedIds = [userId1, userId2].sort();
  const roomId = sortedIds.join("-");
  return roomId;
};

export const formatEpoch = (epoch) => {
  const date = new Date(epoch * 1000);
  const now = new Date();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Format time
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const timeString = `${hours}:${minutes}${ampm}`;

  // Check if it's today
  if (
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate()
  ) {
    return timeString; // Return only the time
  }

  // Check if it's yesterday
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (
    yesterday.getFullYear() === date.getFullYear() &&
    yesterday.getMonth() === date.getMonth() &&
    yesterday.getDate() === date.getDate()
  ) {
    return `Yesterday`;
    // return `Yesterday ${timeString}`;
  }

  // Otherwise, return formatted date (Month and Date)
  return `${monthNames[date.getMonth()]} ${date.getDate()}`;
};
