export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp + 'Z'); // Force UTC interpretation
  
  return date.toLocaleString(undefined, {
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