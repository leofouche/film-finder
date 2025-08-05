import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Rating,
  Divider,
} from '@mui/material';
import {
  AccessTime,
  CalendarToday,
  Person,
  ThumbUp,
} from '@mui/icons-material';
import { Movie } from '../types/Movie';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const genres = movie.genres ? movie.genres.split(',').map(g => g.trim()) : [];
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Typography 
          variant="h6" 
          component="h2" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            fontSize: '1.1rem',
            lineHeight: 1.3,
            mb: 1.5,
            minHeight: '2.6em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {movie.primaryTitle}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Rating 
            value={movie.averageRating / 2} 
            precision={0.1} 
            readOnly 
            size="small"
            sx={{ 
              color: '#ffd700',
              '& .MuiRating-iconEmpty': {
                color: 'rgba(255, 255, 255, 0.3)',
              }
            }}
          />
          <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
            {movie.averageRating.toFixed(1)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'rgba(255, 255, 255, 0.9)' }}>
          <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
          <Typography variant="body2" sx={{ mr: 2 }}>
            {movie.startYear}
          </Typography>
          <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
          <Typography variant="body2">
            {movie.runtimeMinutes} min
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, color: 'rgba(255, 255, 255, 0.9)' }}>
          <Person sx={{ fontSize: 16, mr: 0.5 }} />
          <Typography 
            variant="body2" 
            sx={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {movie.primaryName}
          </Typography>
        </Box>

        <Divider sx={{ my: 1.5, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
          {genres.slice(0, 3).map((genre, index) => (
            <Chip
              key={index}
              label={genre}
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '0.75rem',
                height: 24,
              }}
            />
          ))}
          {genres.length > 3 && (
            <Chip
              label={`+${genres.length - 3}`}
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '0.75rem',
                height: 24,
              }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', color: 'rgba(255, 255, 255, 0.8)' }}>
          <ThumbUp sx={{ fontSize: 14, mr: 0.5 }} />
          <Typography variant="caption">
            {movie.numVotes.toLocaleString()} votes
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
