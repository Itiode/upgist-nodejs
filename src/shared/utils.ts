import { Schema } from 'mongoose';

/* This function returns an ObjectId embedded with a given datetime
   Accepts both Date object and string input */
export function objectIdWithTimestamp(timestamp) {
  // Convert string date to Date object (otherwise assume timestamp is a date)
  if (typeof timestamp == 'string') {
    timestamp = new Date(timestamp);
  }

  // Convert date object to hex seconds since Unix epoch
  const hexSeconds = Math.floor(timestamp / 1000).toString(16);

  // Create an ObjectId with that hex timestamp
  const constructedObjectId = new Schema.Types.ObjectId(
    hexSeconds + '0000000000000000'
  );

  return constructedObjectId;
}
