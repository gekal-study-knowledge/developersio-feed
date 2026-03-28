import { useState, useEffect, useCallback } from 'react';

const VISITED_KEY = 'visited_posts';
const VISITED_TIMESTAMPS_KEY = 'visited_posts_timestamps';

interface VisitedPostData {
  counter: number;
  timestamp: number;
}

const cleanupOldVisitedPosts = () => {
  if (typeof window === 'undefined') return;

  try {
    const now = new Date();
    const firstOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const timestampsData = localStorage.getItem(VISITED_TIMESTAMPS_KEY);
    if (!timestampsData) return;

    const timestamps: Record<string, number> = JSON.parse(timestampsData);
    const filteredTimestamps: Record<string, number> = {};

    let hasChanges = false;
    for (const [key, timestamp] of Object.entries(timestamps)) {
      if (timestamp >= firstOfPreviousMonth.getTime()) {
        filteredTimestamps[key] = timestamp;
      } else {
        hasChanges = true;
      }
    }

    if (hasChanges) {
      localStorage.setItem(VISITED_TIMESTAMPS_KEY, JSON.stringify(filteredTimestamps));
    }
  } catch (error) {
    console.error('Failed to cleanup old visited posts:', error);
  }
};

const getVisitedPosts = (): Record<string, VisitedPostData> => {
  if (typeof window === 'undefined') return {};

  let visitedPosts: Record<string, VisitedPostData> = {};
  try {
    const parsedData = JSON.parse(localStorage.getItem(VISITED_KEY) || '{}');
    const timestampsData = JSON.parse(localStorage.getItem(VISITED_TIMESTAMPS_KEY) || '{}');

    if (Array.isArray(parsedData)) {
      parsedData.forEach((postId) => {
        if (typeof postId === 'string') {
          visitedPosts[postId] = { counter: -1, timestamp: 0 };
        }
      });
    } else if (parsedData !== null && typeof parsedData === 'object') {
      for (const [key, counter] of Object.entries(parsedData)) {
        visitedPosts[key] = {
          counter: counter as number,
          timestamp: timestampsData[key] || 0,
        };
      }
    }
  } catch (error) {
    console.error('Failed to parse visited_posts:', error);
  }

  cleanupOldVisitedPosts();
  return visitedPosts;
};

interface UseVisitedPostProps {
  year: string;
  month: string;
  day: string;
  slug: string;
  newsCounter: number;
}

export const useVisitedPost = ({ year, month, day, slug, newsCounter }: UseVisitedPostProps) => {
  const [isVisited, setIsVisited] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<string>('');

  const currentPostId = `${year}/${month}/${day}/${slug}`;

  useEffect(() => {
    const visitedPosts = getVisitedPosts();
    const postData = visitedPosts[currentPostId];

    if (postData !== undefined) {
      setIsVisited(true);
      const isPostUpdated = postData.counter !== newsCounter;
      setIsUpdated(isPostUpdated);

      if (isPostUpdated && postData.timestamp > 0) {
        const now = Date.now();
        const diffMs = now - postData.timestamp;
        setElapsedTime(formatElapsedTime(diffMs));
      }
    } else {
      setIsVisited(false);
      setIsUpdated(false);
      setElapsedTime('');
    }
  }, [currentPostId, newsCounter]);

  const markAsVisited = useCallback(() => {
    const visitedPosts = getVisitedPosts();
    const postData = visitedPosts[currentPostId];

    if (postData === undefined || postData.counter !== newsCounter) {
      const counters: Record<string, number> = {};
      const timestamps: Record<string, number> = {};

      for (const [key, data] of Object.entries(visitedPosts)) {
        counters[key] = data.counter;
        timestamps[key] = data.timestamp;
      }

      counters[currentPostId] = newsCounter;
      timestamps[currentPostId] = Date.now();

      localStorage.setItem(VISITED_KEY, JSON.stringify(counters));
      localStorage.setItem(VISITED_TIMESTAMPS_KEY, JSON.stringify(timestamps));

      setIsVisited(true);
      setIsUpdated(false);
      setElapsedTime('');
    }
  }, [currentPostId, newsCounter]);

  return { isVisited, isUpdated, elapsedTime, markAsVisited };
};

const formatElapsedTime = (diffMs: number): string => {
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}日前`;
  } else if (hours > 0) {
    return `${hours}時間前`;
  } else if (minutes > 0) {
    return `${minutes}分前`;
  } else {
    return `${seconds}秒前`;
  }
};
