"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectIdWithTimestamp = void 0;
const mongoose_1 = require("mongoose");
/* This function returns an ObjectId embedded with a given datetime
   Accepts both Date object and string input */
function objectIdWithTimestamp(timestamp) {
    // Convert string date to Date object (otherwise assume timestamp is a date)
    if (typeof timestamp == 'string') {
        timestamp = new Date(timestamp);
    }
    // Convert date object to hex seconds since Unix epoch
    const hexSeconds = Math.floor(timestamp / 1000).toString(16);
    // Create an ObjectId with that hex timestamp
    const constructedObjectId = new mongoose_1.Schema.Types.ObjectId(hexSeconds + '0000000000000000');
    return constructedObjectId;
}
exports.objectIdWithTimestamp = objectIdWithTimestamp;
