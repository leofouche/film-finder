// Streaming service API utilities

export interface StreamingService {
  service_name: string;
  icon_url: string;
  offer_url: string;
}

export interface StreamingResponse {
  success: boolean;
  title: string;
  services: StreamingService[];
  message?: string;
  error?: string;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const fetchStreamingServices = async (title: string): Promise<StreamingResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/streaming/${encodeURIComponent(title)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: StreamingResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching streaming services for', title, error);
    return {
      success: false,
      title,
      services: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};