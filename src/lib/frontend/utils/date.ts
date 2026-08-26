const toDateStr = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split("T")[0];

export const getToday = () => toDateStr(new Date());

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("pt-BR");
};

export const formatFullDate = (date: Date | string = new Date()) => {
  const resolved = typeof date === "string" ? new Date(`${date}T12:00`) : date;
  return resolved.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

export const getDayOfWeek = (dateStr: string) =>
  new Date(`${dateStr}T12:00`).toLocaleDateString("pt-BR", { weekday: "long" });

export const getShortDayOfWeek = (dateStr: string) =>
  new Date(`${dateStr}T12:00`).toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");

export const getLastNDates = (n: number) => {
  return Array.from({ length: n }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (n - 1 - index));
    return toDateStr(date);
  });
};

export const getDayOfMonth = (dateStr: string) => new Date(`${dateStr}T12:00`).getDate();
