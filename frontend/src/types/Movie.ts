export interface Movie {
  titleId: string;
  primaryTitle: string;
  originalTitle: string;
  averageRating: number;
  numVotes: number;
  startYear: number;
  runtimeMinutes: number;
  genres: string;
  foreignFlag: boolean;
  directors: string;
  primaryName: string;
}

export interface MovieFilters {
  title: string;
  genre: string;
  director: string;
  yearRange: [number, number];
  ratingRange: [number, number];
  runtimeRange: [number, number];
}
