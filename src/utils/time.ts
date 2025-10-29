export const getTimezone = (): string => {
  try {
    return (
      Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Ho_Chi_Minh"
    );
  } catch {
    return "Asia/Ho_Chi_Minh";
  }
};
