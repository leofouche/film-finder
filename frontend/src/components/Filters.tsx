import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Slider,
  Paper,
  Chip,
  IconButton,
  Stack,
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
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 3,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
          Filter Movies
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {activeFiltersCount > 0 && (
            <Chip 
              label={`${activeFiltersCount} active`} 
              size="small" 
              color="primary"
            />
          )}
          <IconButton 
            onClick={onClearFilters} 
            size="small"
            sx={{ color: '#e74c3c' }}
          >
            <Clear />
          </IconButton>
        </Box>
      </Box>

      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label="Search by title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            size="small"
          />

          <FormControl fullWidth size="small">
            <InputLabel>Genre</InputLabel>
            <Select
              value={genre}
              label="Genre"
              onChange={(e) => setGenre(e.target.value)}
            >
              <MenuItem value="All">All Genres</MenuItem>
              {availableGenres.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Director</InputLabel>
            <Select
              value={director}
              label="Director"
              onChange={(e) => setDirector(e.target.value)}
            >
              <MenuItem value="All">All Directors</MenuItem>
              {availableDirectors.slice(0, 100).map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
          <Box sx={{ flex: 1 }}>
            <Typography gutterBottom sx={{ fontWeight: 500, color: '#2c3e50' }}>
              Year: {yearRange[0]} - {yearRange[1]}
            </Typography>
            <Slider
              value={yearRange}
              onChange={(_, newValue) => setYearRange(newValue as [number, number])}
              valueLabelDisplay="auto"
              min={1900}
              max={2024}
              sx={{ color: '#3498db' }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography gutterBottom sx={{ fontWeight: 500, color: '#2c3e50' }}>
              Rating: {ratingRange[0]} - {ratingRange[1]}
            </Typography>
            <Slider
              value={ratingRange}
              onChange={(_, newValue) => setRatingRange(newValue as [number, number])}
              valueLabelDisplay="auto"
              min={0}
              max={10}
              step={0.1}
              sx={{ color: '#e74c3c' }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography gutterBottom sx={{ fontWeight: 500, color: '#2c3e50' }}>
              Runtime: {runtimeRange[0]} - {runtimeRange[1]} min
            </Typography>
            <Slider
              value={runtimeRange}
              onChange={(_, newValue) => setRuntimeRange(newValue as [number, number])}
              valueLabelDisplay="auto"
              min={0}
              max={300}
              sx={{ color: '#9b59b6' }}
            />
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Filters;
