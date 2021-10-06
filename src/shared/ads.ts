export interface QueryDate {
  day: string;
  month: string;
  year: string;
}

export const getQueryDate = (date: QueryDate): string => {
  let queryDate: string;

  let currDate = new Date();

  if (date.day !== '0' && date.month !== '0' && date.year !== '0') {
    // Get clicks for that particular day.
    queryDate = `${date.day}-${date.month}-${date.year}`;
  } else if (date.day === '0' && date.month !== '0' && date.year !== '0') {
    // Get clicks for that whole month
    queryDate = `${date.month}-${date.year}`;
  } else {
    // Get clicks for that whole year
    queryDate = `${currDate.getFullYear()}`;
  }

  return `${queryDate}`;
};

export const generateId = (userId: string): string => {
  const currDate = new Date();

  const clickDate = `${currDate.getDate()}-${
    currDate.getMonth() + 1
  }-${currDate.getFullYear()}`;

  return `${userId}:${clickDate}`;
};
