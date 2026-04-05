import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow } from 'date-fns';
import { Timestamp } from './firebase';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(timestamp: Timestamp | Date | number) {
  const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatCount(count: number) {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
}
