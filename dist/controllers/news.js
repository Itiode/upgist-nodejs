"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNews = exports.getNewsAsAdmin = void 0;
const news_1 = __importDefault(require("../models/news"));
const news_2 = require("../services/news");
const getNewsAsAdmin = async (req, res, next) => {
    const { category, searchQuery } = req.query;
    try {
        const newsRes = await news_2.fetchNews(category, searchQuery);
        let savedNewsCount = 0;
        for (const article of newsRes.data.articles) {
            if ((article.author || article.source.name) &&
                (article.description || article.content)) {
                const fetchedNews = await news_1.default.findOne({ title: article.title });
                if (!fetchedNews) {
                    await new news_1.default({
                        source: article.source.name,
                        author: article.author,
                        title: article.title,
                        description: article.description === null
                            ? article.content.slice(0, 100)
                            : article.description.slice(0, 100),
                        content: article.content === null ? article.description : article.content,
                        category,
                        url: article.url,
                        urlToImage: article.urlToImage === null ? '' : article.urlToImage,
                        publishedAt: article.publishedAt,
                    }).save();
                    savedNewsCount++;
                }
            }
        }
        res.send({
            message: savedNewsCount === 0
                ? `No ${category} news saved`
                : `${category} news fetched and saved successfully`,
            count: savedNewsCount,
        });
    }
    catch (err) {
        next(new Error(`Error in fetching and saving ${category} news as admin: ${err}`));
    }
};
exports.getNewsAsAdmin = getNewsAsAdmin;
const getNews = async (req, res, next) => {
    const pageNumber = +req.query.pageNumber;
    const pageSize = +req.query.pageSize;
    const category = req.query.category;
    try {
        const news = await news_1.default.find({ category })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .select('-_id -__v -content');
        if (news.length === 0)
            return res.send({
                message: `No ${category} news found`,
                count: 0,
                data: [],
            });
        res.send({
            message: `${category} news fetched successfully`,
            count: news.length,
            data: news,
        });
    }
    catch (err) {
        next(new Error(`Error in getting ${category} news: ${err}`));
    }
};
exports.getNews = getNews;
