import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  CssBaseline,
  CircularProgress,
  Alert,
  Stack,
  Pagination,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { Movie } from './types/Movie';
import { loadMoviesFromCSV, getUniqueGenres, getUniqueDirectors, filterMovies } from './utils/movieUtils';
import MovieCard from './components/MovieCard';
import Filters from './components/Filters';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a1a1a',
    },
    secondary: {
      main: '#666666',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Crimson Text", "Times New Roman", "Georgia", serif',
    h1: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontWeight: 600,
      fontSize: '2.5rem',
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    body1: {
      fontFamily: '"Crimson Text", "Times New Roman", serif',
      fontSize: '1.1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: '"Crimson Text", "Times New Roman", serif',
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    caption: {
      fontFamily: '"Source Sans Pro", "Helvetica", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.4,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: 'none',
          border: '1px solid #e0e0e0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'none',
          fontFamily: '"Source Sans Pro", "Helvetica", sans-serif',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
  },
});

const MOVIES_PER_PAGE = 12;

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('All');
  const [director, setDirector] = useState('All');
  const [yearRange, setYearRange] = useState<[number, number]>([1900, 2024]);
  const [ratingRange, setRatingRange] = useState<[number, number]>([0, 10]);
  const [runtimeRange, setRuntimeRange] = useState<[number, number]>([0, 300]);
  const [currentPage, setCurrentPage] = useState(1);

  // Load movies on component mount
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const movieData = await loadMoviesFromCSV();
        setMovies(movieData);
      } catch (err) {
        setError('Failed to load movie data. Please try again.');
        console.error('Error loading movies:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  // Get unique values for filters
  const availableGenres = useMemo(() => getUniqueGenres(movies), [movies]);
  const availableDirectors = useMemo(() => getUniqueDirectors(movies), [movies]);

  // Filter movies based on current filters
  const filteredMovies = useMemo(() => {
    return filterMovies(movies, {
      title,
      genre,
      director,
      yearRange,
      ratingRange,
      runtimeRange,
    });
  }, [movies, title, genre, director, yearRange, ratingRange, runtimeRange]);

  // Paginate filtered movies
  const paginatedMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
    return filteredMovies.slice(startIndex, startIndex + MOVIES_PER_PAGE);
  }, [filteredMovies, currentPage]);

  const totalPages = Math.ceil(filteredMovies.length / MOVIES_PER_PAGE);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [title, genre, director, yearRange, ratingRange, runtimeRange]);

  const clearFilters = () => {
    setTitle('');
    setGenre('All');
    setDirector('All');
    setYearRange([1900, 2024]);
    setRatingRange([0, 10]);
    setRuntimeRange([0, 300]);
  };

  const handleGenreClick = (selectedGenre: string) => {
    setGenre(selectedGenre);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleDirectorClick = (selectedDirector: string) => {
    setDirector(selectedDirector);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleYearClick = (selectedYear: number) => {
    setYearRange([selectedYear, selectedYear]);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          flexDirection="column"
          gap={2}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading movie database...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        borderBottom: '3px solid #1a1a1a',
        backgroundColor: '#ffffff',
        py: 3,
        mb: 4,
      }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h1" 
              component="h1"
              sx={{ 
                color: '#1a1a1a',
                mb: 1,
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}
            >
              The Film Chronicle
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              gap: 2,
              mb: 2,
            }}>
              <Box sx={{ height: '1px', backgroundColor: '#1a1a1a', flex: 1, maxWidth: '200px' }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#666666',
                  fontFamily: '"Source Sans Pro", sans-serif',
                  letterSpacing: '1px',
                }}
              >
                EST. 2025 • DISCOVER • EXPLORE • CRITIQUE
              </Typography>
              <Box sx={{ height: '1px', backgroundColor: '#1a1a1a', flex: 1, maxWidth: '200px' }} />
            </Box>
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#666666',
                fontStyle: 'italic',
                fontWeight: 400,
              }}
            >
              Fouche's Fantastic Film Archive
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 0 }}>
        <Filters
          title={title}
          setTitle={setTitle}
          genre={genre}
          setGenre={setGenre}
          director={director}
          setDirector={setDirector}
          yearRange={yearRange}
          setYearRange={setYearRange}
          ratingRange={ratingRange}
          setRatingRange={setRatingRange}
          runtimeRange={runtimeRange}
          setRuntimeRange={setRuntimeRange}
          availableGenres={availableGenres}
          availableDirectors={availableDirectors}
          onClearFilters={clearFilters}
        />

        <Box sx={{ 
          mb: 4, 
          py: 3,
          borderTop: '1px solid #e0e0e0',
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#ffffff',
        }}>
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={2} 
            justifyContent="space-between" 
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 500,
                  color: '#1a1a1a',
                  mb: 0.5,
                }}
              >
                Cinema Collection
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#666666',
                  fontStyle: 'italic',
                }}
              >
                {filteredMovies.length} films currently on display
              </Typography>
            </Box>
            
            {totalPages > 1 && (
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 0,
                    fontFamily: '"Source Sans Pro", sans-serif',
                  },
                }}
              />
            )}
          </Stack>
        </Box>

        <Box
          sx={{
            columnCount: {
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 5,
            },
            columnGap: 3,
            mb: 4,
          }}
        >
          {paginatedMovies.map((movie) => (
            <Box 
              key={movie.titleId} 
              sx={{ 
                breakInside: 'avoid',
                mb: 3,
                display: 'inline-block',
                width: '100%',
              }}
            >
              <MovieCard 
                movie={movie} 
                onGenreClick={handleGenreClick}
                onDirectorClick={handleDirectorClick}
                onYearClick={handleYearClick}
              />
            </Box>
          ))}
        </Box>

        {paginatedMovies.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              backgroundColor: '#ffffff',
              border: '1px solid #e0e0e0',
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: '"Playfair Display", serif',
                color: '#666666', 
                mb: 2,
                fontWeight: 400,
              }}
            >
              No Films Found
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666666',
                fontStyle: 'italic',
              }}
            >
              Perhaps adjust your search criteria to discover more cinematic treasures
            </Typography>
          </Box>
        )}

        {totalPages > 1 && paginatedMovies.length > 0 && (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 6, 
              py: 4,
              borderTop: '1px solid #e0e0e0',
              backgroundColor: '#ffffff',
            }}
          >
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 0,
                  fontFamily: '"Source Sans Pro", sans-serif',
                  border: '1px solid #e0e0e0',
                  '&.Mui-selected': {
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#333333',
                    },
                  },
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                },
              }}
            />
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
