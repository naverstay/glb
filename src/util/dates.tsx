export function dateDiffInDays(day1: string, day2: string) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const a = new Date(day1);
  const b = new Date(day2);
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc2 - utc1) / MS_PER_DAY);
}

export const today = new Date('2022-11-15').toLocaleDateString("en-CA");
