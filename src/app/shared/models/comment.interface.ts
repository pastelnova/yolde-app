import { ProfileInterface } from './profile.interface';

export interface CommentInterface {
  id: number;
  body: string;
  author: ProfileInterface;
  createdAt: string;
  updatedAt: string;
}
