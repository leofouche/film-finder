import Papa from 'papaparse';
import { Movie } from '../types/Movie';

export const loadMoviesFromCSV = async (): Promise<Movie[]> => {
  try {
    const response = await fetch('/movies.csv');
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const movies: Movie[] = results.data.map((row: any) => ({
            titleId: row.titleId || '',
            primaryTitle: row.primaryTitle || '',
            originalTitle: row.originalTitle || '',
            averageRating: parseFloat(row.averageRating) || 0,
            numVotes: parseInt(row.numVotes) || 0,
            startYear: parseInt(row.startYear) || 0,
            runtimeMinutes: parseInt(row.runtimeMinutes) || 0,
            genres: row.genres || '',
            foreignFlag: row.foreignFlag === 'true',
            directors: row.directors || '',
            primaryName: row.primaryName || '',
          }));
          resolve(movies);
        },
        error: (error: any) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Failed to load movies CSV:', error);
    throw error;
  }
};

export const getUniqueGenres = (movies: Movie[]): string[] => {
  const genreSet = new Set<string>();
  movies.forEach(movie => {
    if (movie.genres) {
      const genres = movie.genres.split(',').map(g => g.trim());
      genres.forEach(genre => genreSet.add(genre));
    }
  });
  return Array.from(genreSet).sort();
};

export const getUniqueDirectors = (movies: Movie[]): string[] => {
  const directorSet = new Set<string>();
  movies.forEach(movie => {
    if (movie.primaryName) {
      directorSet.add(movie.primaryName);
    }
  });
  return Array.from(directorSet).sort();
};

export const filterMovies = (movies: Movie[], filters: {
  title?: string;
  genre?: string;
  director?: string;
  yearRange?: [number, number];
  ratingRange?: [number, number];
  runtimeRange?: [number, number];
}): Movie[] => {
  return movies.filter(movie => {
    // Title filter
    if (filters.title && !movie.primaryTitle.toLowerCase().includes(filters.title.toLowerCase())) {
      return false;
    }
    
    // Genre filter
    if (filters.genre && filters.genre !== 'All' && !movie.genres.includes(filters.genre)) {
      return false;
    }
    
    // Director filter
    if (filters.director && filters.director !== 'All' && movie.primaryName !== filters.director) {
      return false;
    }
    
    // Year range filter
    if (filters.yearRange && (movie.startYear < filters.yearRange[0] || movie.startYear > filters.yearRange[1])) {
      return false;
    }
    
    // Rating range filter
    if (filters.ratingRange && (movie.averageRating < filters.ratingRange[0] || movie.averageRating > filters.ratingRange[1])) {
      return false;
    }
    
    // Runtime range filter
    if (filters.runtimeRange && (movie.runtimeMinutes < filters.runtimeRange[0] || movie.runtimeMinutes > filters.runtimeRange[1])) {
      return false;
    }
    
    return true;
  });
};
