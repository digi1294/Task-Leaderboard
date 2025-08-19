import { useState, useEffect } from 'react';

interface Performer {
  id: string;
  name: string;
  score: number;
  completed: number;
  revisions: number;
  overdue: number;
  completionRate: number;
  streak: number;
  badges: any[];
}

export const useTeamPagination = (performers: Performer[], itemsPerPage: number = 6) => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const topThree = performers.slice(0, 3);
  const remaining = performers.slice(3);
  const totalPages = Math.ceil(remaining.length / itemsPerPage);

  useEffect(() => {
    if (totalPages <= 1) return;

    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 8000); // Change page every 8 seconds

    return () => clearInterval(interval);
  }, [totalPages]);

  const getCurrentPageItems = () => {
    const startIndex = currentPage * itemsPerPage;
    return remaining.slice(startIndex, startIndex + itemsPerPage);
  };

  return {
    topThree,
    currentPageItems: getCurrentPageItems(),
    currentPage,
    totalPages,
    hasMultiplePages: totalPages > 1
  };
};