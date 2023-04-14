export const formatTime = (time: number): string => {
  const minutes: number = Math.floor(time / 60);
  const seconds: number = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
