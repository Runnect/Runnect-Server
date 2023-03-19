export const randomInitialNickname = () => {
  return `임시${Math.random().toString(36).substring(2, 11)}`;
};
