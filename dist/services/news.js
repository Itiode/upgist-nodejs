"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchNews = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("config"));
// TODO: Change to getting API key from environment variable.
async function fetchNews(category, searchQuery) {
    try {
        const res = await axios_1.default.get(`https://newsapi.org/v2/top-headlines?country=ng&category=${category}&q=${searchQuery}&pageSize=5&apiKey=${config_1.default.get('newsApiKey')}`);
        console.log(res.data);
        return {
            message: res.data.message,
            data: { status: res.data.status, articles: res.data.articles },
            status: '0',
        };
    }
    catch (err) {
        console.log(err.response.data);
        return {
            message: err.response.data.message,
            status: '1',
        };
    }
}
exports.fetchNews = fetchNews;
