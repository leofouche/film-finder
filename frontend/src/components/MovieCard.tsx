import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Rating,
  CardMedia,
  Skeleton,
} from '@mui/material';
import {
  AccessTime,
} from '@mui/icons-material';
import { Movie } from '../types/Movie';
import { fetchMoviePoster } from '../utils/omdbApi';

interface MovieCardProps {
  movie: Movie;
  onGenreClick?: (genre: string) => void;
  onDirectorClick?: (director: string) => void;
  onYearClick?: (year: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  onGenreClick, 
  onDirectorClick, 
  onYearClick 
}) => {
  const genres = movie.genres ? movie.genres.split(',').map(g => g.trim()) : [];
  
  const [posterUrl, setPosterUrl] = useState<string | null>(movie.posterUrl || null);
  const [posterLoading, setPosterLoading] = useState(false);
  const [posterError, setPosterError] = useState(false);

  // Fetch poster if not already available
  useEffect(() => {
    if (!posterUrl && !posterError && !posterLoading) {
      setPosterLoading(true);
      fetchMoviePoster(movie.titleId)
        .then((url) => {
          if (url) {
            setPosterUrl(url);
          } else {
            setPosterError(true);
          }
        })
        .catch(() => {
          setPosterError(true);
        })
        .finally(() => {
          setPosterLoading(false);
        });
    }
  }, [movie.titleId, posterUrl, posterError, posterLoading]);
  
  return (
    <Card 
      sx={{ 
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: 0,
      }}
    >
      {/* Movie Poster */}
      {posterLoading ? (
        <Skeleton variant="rectangular" height={200} />
      ) : posterUrl && !posterError ? (
        <CardMedia
          component="img"
          image={posterUrl}
          alt={`${movie.primaryTitle} poster`}
          sx={{
            height: 200,
            objectFit: 'cover',
            borderBottom: '1px solid #e0e0e0',
          }}
        />
      ) : (
        <Box
          sx={{
            height: 200,
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#999999',
              fontStyle: 'italic',
              textAlign: 'center',
              px: 2,
            }}
          >
            No poster available
          </Typography>
        </Box>
      )}
      
      <CardContent sx={{ p: 3 }}>
        {/* Movie Title - Newspaper Headline Style */}
        <Typography 
          variant="h6" 
          component="h2" 
          gutterBottom
          sx={{ 
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600,
            fontSize: '1.3rem',
            lineHeight: 1.3,
            mb: 2,
            color: '#1a1a1a',
            borderBottom: '1px solid #e0e0e0',
            pb: 1,
          }}
        >
          {movie.primaryTitle}
        </Typography>
        
        {/* Subtitle with year and director */}
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontFamily: '"Crimson Text", serif',
              fontStyle: 'italic',
              color: '#666666',
              fontSize: '1rem',
              lineHeight: 1.4,
            }}
          >
            Directed by{' '}
            <Box
              component="span"
              onClick={() => onDirectorClick?.(movie.primaryName)}
              sx={{
                cursor: onDirectorClick ? 'pointer' : 'default',
                textDecoration: onDirectorClick ? 'underline' : 'none',
                '&:hover': onDirectorClick ? {
                  color: '#1a1a1a',
                  fontWeight: 600,
                } : {},
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {movie.primaryName}
            </Box>
            {' • '}
            <Box
              component="span"
              onClick={() => onYearClick?.(movie.startYear)}
              sx={{
                cursor: onYearClick ? 'pointer' : 'default',
                textDecoration: onYearClick ? 'underline' : 'none',
                '&:hover': onYearClick ? {
                  color: '#1a1a1a',
                  fontWeight: 600,
                } : {},
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {movie.startYear}
            </Box>
          </Typography>
        </Box>

        {/* Rating section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating 
            value={movie.averageRating / 2} 
            precision={0.1} 
            readOnly 
            size="small"
            sx={{ 
              color: '#1a1a1a',
              '& .MuiRating-iconEmpty': {
                color: '#e0e0e0',
              }
            }}
          />
          <Typography 
            variant="caption" 
            sx={{ 
              ml: 1, 
              fontFamily: '"Source Sans Pro", sans-serif',
              fontWeight: 600,
              color: '#1a1a1a',
            }}
          >
            {movie.averageRating.toFixed(1)}/10
          </Typography>
        </Box>

        {/* Technical details */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: 1,
          mb: 2,
          p: 2,
          backgroundColor: '#f9f9f9',
          border: '1px solid #e8e8e8',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', color: '#666666' }}>
              <AccessTime sx={{ fontSize: 14, mr: 0.5 }} />
              <Typography variant="caption" sx={{ fontFamily: '"Source Sans Pro", sans-serif' }}>
                {movie.runtimeMinutes} min
              </Typography>
            </Box>
            <Typography 
              variant="caption" 
              sx={{ 
                fontFamily: '"Source Sans Pro", sans-serif',
                color: '#666666',
              }}
            >
              {movie.numVotes.toLocaleString()} reviews
            </Typography>
          </Box>
        </Box>

        {/* Genres as tags */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {genres.slice(0, 3).map((genre, index) => (
            <Chip
              key={index}
              label={genre}
              size="small"
              onClick={() => onGenreClick?.(genre)}
              sx={{
                backgroundColor: '#1a1a1a',
                color: 'white',
                fontSize: '0.7rem',
                height: 20,
                fontFamily: '"Source Sans Pro", sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderRadius: 0,
                cursor: onGenreClick ? 'pointer' : 'default',
                transition: 'all 0.2s ease-in-out',
                '&:hover': onGenreClick ? {
                  backgroundColor: '#333333',
                  transform: 'translateY(-1px)',
                } : {},
              }}
            />
          ))}
          {genres.length > 3 && (
            <Chip
              label={`+${genres.length - 3}`}
              size="small"
              sx={{
                backgroundColor: '#666666',
                color: 'white',
                fontSize: '0.7rem',
                height: 20,
                fontFamily: '"Source Sans Pro", sans-serif',
                borderRadius: 0,
                cursor: 'default',
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
