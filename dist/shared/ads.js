"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = exports.getQueryDate = void 0;
const getQueryDate = (date) => {
    let queryDate;
    let currDate = new Date();
    if (date.day !== '0' && date.month !== '0' && date.year !== '0') {
        // Get clicks for that particular day.
        queryDate = `${date.day}-${date.month}-${date.year}`;
    }
    else if (date.day === '0' && date.month !== '0' && date.year !== '0') {
        // Get clicks for that whole month
        queryDate = `${date.month}-${date.year}`;
    }
    else {
        // Get clicks for that whole year
        queryDate = `${currDate.getFullYear()}`;
    }
    return `${queryDate}`;
};
exports.getQueryDate = getQueryDate;
const generateId = (userId) => {
    const currDate = new Date();
    const clickDate = `${currDate.getDate()}-${currDate.getMonth() + 1}-${currDate.getFullYear()}`;
    return `${userId}:${clickDate}`;
};
exports.generateId = generateId;
