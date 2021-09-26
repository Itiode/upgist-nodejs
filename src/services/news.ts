import axios from 'axios';
import config from 'config';

import Article from '../models/article';

export interface GetNewsResponse {
  message: string;
  status: string;
  data?: { status: string; articles: Article[] };
  errorMsg?: string | null;
}

// TODO: Change to getting API key from environment variable.
export async function fetchNews(
  category: string,
  searchQuery: string
): Promise<GetNewsResponse> {
  try {
    const res = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=ng&category=${category}&q=${searchQuery}&pageSize=5&apiKey=${config.get(
        'newsApiKey'
      )}`
    );

    console.log(res.data);

    return {
      message: res.data.message,
      data: { status: res.data.status, articles: res.data.articles },
      status: '0',
    };
  } catch (err: any) {
    console.log(err.response.data);

    return {
      message: err.response.data.message,
      status: '1',
    };
  }
}
