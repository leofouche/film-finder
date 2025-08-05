import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Slider,
  Paper,
  Chip,
  IconButton,
  Stack,
  Autocomplete,
} from '@mui/material';
import { Clear } from '@mui/icons-material';

interface FiltersProps {
  title: string;
  setTitle: (title: string) => void;
  genre: string;
  setGenre: (genre: string) => void;
  director: string;
  setDirector: (director: string) => void;
  yearRange: [number, number];
  setYearRange: (range: [number, number]) => void;
  ratingRange: [number, number];
  setRatingRange: (range: [number, number]) => void;
  runtimeRange: [number, number];
  setRuntimeRange: (range: [number, number]) => void;
  availableGenres: string[];
  availableDirectors: string[];
  onClearFilters: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  title,
  setTitle,
  genre,
  setGenre,
  director,
  setDirector,
  yearRange,
  setYearRange,
  ratingRange,
  setRatingRange,
  runtimeRange,
  setRuntimeRange,
  availableGenres,
  availableDirectors,
  onClearFilters,
}) => {
  const activeFiltersCount = [
    title,
    genre !== 'All' ? genre : '',
    director !== 'All' ? director : '',
    yearRange[0] !== 1900 || yearRange[1] !== 2024,
    ratingRange[0] !== 0 || ratingRange[1] !== 10,
    runtimeRange[0] !== 0 || runtimeRange[1] !== 300,
  ].filter(Boolean).length;

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 4, 
        mb: 4,
        backgroundColor: '#ffffff',
        border: '2px solid #1a1a1a',
        borderRadius: 0,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600, 
              color: '#1a1a1a',
              mb: 0.5,
            }}
          >
            Search & Filter
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#666666',
              fontStyle: 'italic',
            }}
          >
            Narrow your exploration of cinematic works
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {activeFiltersCount > 0 && (
            <Chip 
              label={`${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active`} 
              size="small" 
              sx={{
                backgroundColor: '#1a1a1a',
                color: 'white',
                fontFamily: '"Source Sans Pro", sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderRadius: 0,
              }}
            />
          )}
          <IconButton 
            onClick={onClearFilters} 
            size="small"
            sx={{ 
              color: '#666666',
              border: '1px solid #e0e0e0',
              borderRadius: 0,
              '&:hover': {
                backgroundColor: '#f5f5f5',
              }
            }}
          >
            <Clear />
          </IconButton>
        </Box>
      </Box>

      <Stack spacing={4}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <TextField
            fullWidth
            label="Search by title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            size="medium"
            sx={{
              '& .MuiInputLabel-root': {
                fontFamily: '"Source Sans Pro", sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.875rem',
              },
              '& .MuiOutlinedInput-input': {
                fontFamily: '"Crimson Text", serif',
                fontSize: '1.1rem',
              }
            }}
          />

          <Autocomplete
            fullWidth
            value={genre === 'All' ? null : genre}
            onChange={(_, newValue) => setGenre(newValue || 'All')}
            options={availableGenres}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Genre"
                placeholder="All Genres"
                variant="outlined"
                size="medium"
                sx={{
                  '& .MuiInputLabel-root': {
                    fontFamily: '"Source Sans Pro", sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: '0.875rem',
                  },
                  '& .MuiOutlinedInput-input': {
                    fontFamily: '"Crimson Text", serif',
                    fontSize: '1.1rem',
                  }
                }}
              />
            )}
            sx={{
              '& .MuiAutocomplete-listbox': {
                fontFamily: '"Crimson Text", serif',
              },
            }}
            clearOnEscape
            clearText="Clear"
            noOptionsText="No genres found"
          />

          <Autocomplete
            fullWidth
            value={director === 'All' ? null : director}
            onChange={(_, newValue) => setDirector(newValue || 'All')}
            options={availableDirectors}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Director"
                placeholder="All Directors"
                variant="outlined"
                size="medium"
                sx={{
                  '& .MuiInputLabel-root': {
                    fontFamily: '"Source Sans Pro", sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: '0.875rem',
                  },
                  '& .MuiOutlinedInput-input': {
                    fontFamily: '"Crimson Text", serif',
                    fontSize: '1.1rem',
                  }
                }}
              />
            )}
            sx={{
              '& .MuiAutocomplete-listbox': {
                fontFamily: '"Crimson Text", serif',
              },
            }}
            clearOnEscape
            clearText="Clear"
            noOptionsText="No directors found"
          />
        </Stack>

        <Box sx={{ 
          p: 3, 
          backgroundColor: '#f9f9f9', 
          border: '1px solid #e0e0e0',
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: '"Playfair Display", serif',
              color: '#1a1a1a', 
              mb: 3,
              textAlign: 'center',
            }}
          >
            Refine by Criteria
          </Typography>
          
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
            <Box sx={{ flex: 1 }}>
              <Typography 
                gutterBottom 
                sx={{ 
                  fontFamily: '"Source Sans Pro", sans-serif',
                  fontWeight: 600, 
                  color: '#1a1a1a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontSize: '0.875rem',
                }}
              >
                Year: {yearRange[0]} — {yearRange[1]}
              </Typography>
              <Slider
                value={yearRange}
                onChange={(_, newValue) => setYearRange(newValue as [number, number])}
                valueLabelDisplay="auto"
                min={1900}
                max={2024}
                sx={{ 
                  color: '#1a1a1a',
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#1a1a1a',
                    '&:hover': {
                      boxShadow: '0 0 0 8px rgba(26, 26, 26, 0.16)',
                    },
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#1a1a1a',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: '#e0e0e0',
                  },
                }}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography 
                gutterBottom 
                sx={{ 
                  fontFamily: '"Source Sans Pro", sans-serif',
                  fontWeight: 600, 
                  color: '#1a1a1a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontSize: '0.875rem',
                }}
              >
                Rating: {ratingRange[0]} — {ratingRange[1]}
              </Typography>
              <Slider
                value={ratingRange}
                onChange={(_, newValue) => setRatingRange(newValue as [number, number])}
                valueLabelDisplay="auto"
                min={0}
                max={10}
                step={0.1}
                sx={{ 
                  color: '#1a1a1a',
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#1a1a1a',
                    '&:hover': {
                      boxShadow: '0 0 0 8px rgba(26, 26, 26, 0.16)',
                    },
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#1a1a1a',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: '#e0e0e0',
                  },
                }}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography 
                gutterBottom 
                sx={{ 
                  fontFamily: '"Source Sans Pro", sans-serif',
                  fontWeight: 600, 
                  color: '#1a1a1a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontSize: '0.875rem',
                }}
              >
                Runtime: {runtimeRange[0]} — {runtimeRange[1]} min
              </Typography>
              <Slider
                value={runtimeRange}
                onChange={(_, newValue) => setRuntimeRange(newValue as [number, number])}
                valueLabelDisplay="auto"
                min={0}
                max={300}
                sx={{ 
                  color: '#1a1a1a',
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#1a1a1a',
                    '&:hover': {
                      boxShadow: '0 0 0 8px rgba(26, 26, 26, 0.16)',
                    },
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#1a1a1a',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: '#e0e0e0',
                  },
                }}
              />
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

export default Filters;
