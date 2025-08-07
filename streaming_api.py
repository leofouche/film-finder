#!/usr/bin/env python3
"""
Simple Flask API server to provide streaming service data for the React frontend.
This leverages the existing JustWatch integration from utils.py.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from utils import get_au_streaming_offers_for_film
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

@app.route('/api/streaming/<title>', methods=['GET'])
def get_streaming_services(title):
    """
    Get streaming services for a given movie title.
    
    Args:
        title (str): Movie title to search for
        
    Returns:
        JSON response with streaming services or error message
    """
    try:
        logger.info(f"Fetching streaming services for: {title}")
        offers = get_au_streaming_offers_for_film(title)
        
        if offers:
            # Convert NamedTuple to dict for JSON serialization
            services = [
                {
                    'service_name': offer.service_name,
                    'icon_url': offer.icon_url,
                    'offer_url': offer.offer_url
                }
                for offer in offers
            ]
            return jsonify({
                'success': True,
                'title': title,
                'services': services
            })
        else:
            return jsonify({
                'success': True,
                'title': title,
                'services': [],
                'message': f'No streaming services found for "{title}"'
            })
            
    except Exception as e:
        logger.error(f"Error fetching streaming services for {title}: {str(e)}")
        return jsonify({
            'success': False,
            'title': title,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint."""
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)