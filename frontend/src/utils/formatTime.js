export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  
  return date.toLocaleString(undefined, {  // 'undefined' uses browser's locale/timezone
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  });
};