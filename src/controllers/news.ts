import { RequestHandler } from 'express';

import NewsModel, { News } from '../models/news';
import { fetchNews } from '../services/news';

interface GetNewsAsAdminQueryParams {
  category: string;
  searchQuery: string;
}

interface GetNewsAsAdminRes {
  message: string;
  count?: number;
}

export const getNewsAsAdmin: RequestHandler<
  any,
  GetNewsAsAdminRes,
  any,
  GetNewsAsAdminQueryParams
> = async (req, res, next) => {
  const { category, searchQuery } = req.query;

  try {
    const newsRes = await fetchNews(category, searchQuery);

    let savedNewsCount = 0;

    for (const article of newsRes.data!.articles) {
      if (
        (article.author || article.source.name) &&
        (article.description || article.content)
      ) {
        const fetchedNews = await NewsModel.findOne({ title: article.title });
        if (!fetchedNews) {
          await new NewsModel({
            source: article.source.name,
            author: article.author,
            title: article.title,
            description:
              article.description === null
                ? article.content.slice(0, 100)
                : article.description.slice(0, 100),
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
      message:
        savedNewsCount === 0
          ? `No ${category} news saved`
          : `${category} news fetched and saved successfully`,
      count: savedNewsCount,
    });
  } catch (err) {
    next(
      new Error(
        `Error in fetching and saving ${category} news as admin: ${err}`
      )
    );
  }
};

interface GetNewsRes {
  message: string;
  count: number;
  data: News[];
}

interface GetNewsQueryParams {
  category: string;
  pageSize: string;
  pageNumber: string;
}

export const getNews: RequestHandler<any, GetNewsRes, any, GetNewsQueryParams> =
  async (req, res, next) => {
    const pageNumber = +req.query.pageNumber;
    const pageSize = +req.query.pageSize;
    const category = req.query.category;

    try {
      let news: News[];

      if (category) {
        news = await NewsModel.find({ category })
          .skip((pageNumber - 1) * pageSize)
          .limit(pageSize)
          .select('-_id -__v -content')
          .sort({ _id: -1 });
      } else {
        news = await NewsModel.find()
          .skip((pageNumber - 1) * pageSize)
          .limit(pageSize)
          .select('-_id -__v -content')
          .sort({ _id: -1 });
      }

      if (news.length === 0)
        return res.send({
          message: 'No news found',
          count: 0,
          data: [],
        });

      res.send({
        message: 'News fetched successfully',
        count: news.length,
        data: news,
      });
    } catch (err) {
      next(new Error(`Error in getting news: ${err}`));
    }
  };
