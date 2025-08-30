// utils/format.ts

export const formatDuration = (seconds?: number | string): string => {
  const parsedSeconds = Number(seconds);
  if (!parsedSeconds || isNaN(parsedSeconds)) return '';
  const mins = Math.floor(parsedSeconds / 60);
  const secs = parsedSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
