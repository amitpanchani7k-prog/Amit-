import { Timestamp } from './lib/firebase';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  subscriberCount: number;
  createdAt: Timestamp;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  type: 'long' | 'short';
  likesCount: number;
  viewsCount: number;
  createdAt: Timestamp;
}

export interface Comment {
  id: string;
  videoId: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  text: string;
  createdAt: Timestamp;
}

export interface Subscription {
  id: string;
  subscriberId: string;
  channelId: string;
  createdAt: Timestamp;
}

export interface Like {
  id: string;
  userId: string;
  videoId: string;
  createdAt: Timestamp;
}
