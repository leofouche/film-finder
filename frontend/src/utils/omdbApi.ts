const OMDB_API_KEY = "SHHHH, IT'S A SECRET!!";
const OMDB_BASE_URL = 'http://www.omdbapi.com/';

export interface OMDbResponse {
  Title: string;
  Year: string;
  Poster: string;
  Plot: string;
  imdbRating: string;
  Response: string;
  Error?: string;
}

export const fetchMoviePoster = async (imdbId: string): Promise<string | null> => {
  try {
    const response = await fetch(`${OMDB_BASE_URL}?i=${imdbId}&apikey=${OMDB_API_KEY}`);
    const data: OMDbResponse = await response.json();
    
    if (data.Response === 'True' && data.Poster && data.Poster !== 'N/A') {
      return data.Poster;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching poster for', imdbId, error);
    return null;
  }
};

export const fetchMovieDetails = async (imdbId: string): Promise<OMDbResponse | null> => {
  try {
    const response = await fetch(`${OMDB_BASE_URL}?i=${imdbId}&apikey=${OMDB_API_KEY}`);
    const data: OMDbResponse = await response.json();
    
    if (data.Response === 'True') {
      return data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching movie details for', imdbId, error);
    return null;
  }
};
