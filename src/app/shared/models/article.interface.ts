import { ProfileInterface } from './profile.interface';

export interface ArticleInterface {
  slug: string;
  title: string;
  description: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  tagList: string[];
  author: ProfileInterface;
  favorited: boolean;
  favoritesCount: number;
}
