import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { StreamingService, fetchStreamingServices } from '../utils/streamingApi';

interface StreamingServicesProps {
  movieTitle: string;
  compact?: boolean;
}

const StreamingServices: React.FC<StreamingServicesProps> = ({ 
  movieTitle, 
  compact = false 
}) => {
  const [services, setServices] = useState<StreamingService[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!hasLoaded && movieTitle) {
      setLoading(true);
      setError(null);
      
      fetchStreamingServices(movieTitle)
        .then((response) => {
          if (response.success) {
            setServices(response.services);
          } else {
            setError(response.error || response.message || 'Failed to load streaming services');
          }
        })
        .catch((err) => {
          setError(err.message || 'Failed to load streaming services');
        })
        .finally(() => {
          setLoading(false);
          setHasLoaded(true);
        });
    }
  }, [movieTitle, hasLoaded]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
        <CircularProgress size={16} />
        <Typography variant="caption" color="text.secondary">
          Loading streaming options...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return compact ? null : (
      <Alert severity="info" sx={{ mt: 1, fontSize: '0.75rem' }}>
        No streaming info available
      </Alert>
    );
  }

  if (services.length === 0) {
    return compact ? null : (
      <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
        No streaming services found
      </Typography>
    );
  }

  if (compact) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
        <PlayArrow sx={{ fontSize: 14, color: '#666666' }} />
        <Typography variant="caption" sx={{ color: '#666666' }}>
          Available on {services.length} service{services.length > 1 ? 's' : ''}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography 
        variant="caption" 
        sx={{ 
          display: 'block',
          mb: 1,
          fontFamily: '"Source Sans Pro", sans-serif',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: '#1a1a1a',
        }}
      >
        Watch on:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {services.map((service, index) => (
          <Tooltip key={index} title={`Watch on ${service.service_name}`} arrow>
            <Chip
              label={service.service_name}
              size="small"
              onClick={() => window.open(service.offer_url, '_blank')}
              icon={
                <img 
                  src={service.icon_url} 
                  alt={service.service_name}
                  style={{ width: 16, height: 16 }}
                  onError={(e) => {
                    // Hide image if it fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              }
              sx={{
                backgroundColor: '#e8f4fd',
                color: '#1976d2',
                fontSize: '0.7rem',
                height: 24,
                fontFamily: '"Source Sans Pro", sans-serif',
                borderRadius: 1,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#1976d2',
                  color: 'white',
                  transform: 'translateY(-1px)',
                },
                '& .MuiChip-icon': {
                  marginRight: '4px',
                  marginLeft: '8px',
                },
              }}
            />
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default StreamingServices;