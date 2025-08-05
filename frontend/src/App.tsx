import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  CssBaseline,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Chip,
  Stack,
  Pagination,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Movie as MovieIcon, LocalMovies } from '@mui/icons-material';
import { Movie } from './types/Movie';
import { loadMoviesFromCSV, getUniqueGenres, getUniqueDirectors, filterMovies } from './utils/movieUtils';
import MovieCard from './components/MovieCard';
import Filters from './components/Filters';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
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
      <AppBar position="static" elevation={0} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <LocalMovies sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Film Finder
          </Typography>
          <Chip 
            label={`${movies.length} movies`} 
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              textAlign: 'center', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Discover Amazing Movies
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ textAlign: 'center', mb: 3 }}
          >
            Explore our curated collection of films with advanced filtering
          </Typography>
        </Box>

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

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <MovieIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {filteredMovies.length} movies found
            </Typography>
          </Stack>
          
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
              color="primary"
              size="large"
            />
          )}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 3,
            mb: 4,
          }}
        >
          {paginatedMovies.map((movie) => (
            <MovieCard key={movie.titleId} movie={movie} />
          ))}
        </Box>

        {paginatedMovies.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
            }}
          >
            <MovieIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No movies found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your filters to see more results
            </Typography>
          </Box>
        )}

        {totalPages > 1 && paginatedMovies.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
