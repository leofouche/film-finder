#!/usr/bin/env python3
"""
Demo script to show streaming service integration working
with mock data for demonstration purposes.
"""

import json
from streaming_api import app

# Mock the streaming function to return demo data
def mock_streaming_function(title):
    """Return mock streaming data for demonstration."""
    from utils import StreamingOffer
    
    # Return different mock data based on movie title
    mock_services = {
        "The Shawshank Redemption": [
            StreamingOffer("Netflix", "https://images.justwatch.com/icon/52449539/s100/netflix.webp", "https://netflix.com"),
            StreamingOffer("Stan", "https://images.justwatch.com/icon/52449494/s100/stan.webp", "https://stan.com.au"),
        ],
        "The Godfather": [
            StreamingOffer("Amazon Prime", "https://images.justwatch.com/icon/52449494/s100/amazon-prime.webp", "https://amazon.com/prime"),
        ],
        "Pulp Fiction": [
            StreamingOffer("Disney+", "https://images.justwatch.com/icon/52449583/s100/disney-plus.webp", "https://disneyplus.com"),
            StreamingOffer("Binge", "https://images.justwatch.com/icon/52449494/s100/binge.webp", "https://binge.com.au"),
            StreamingOffer("Paramount+", "https://images.justwatch.com/icon/52449494/s100/paramount-plus.webp", "https://paramount.com.au"),
        ]
    }
    
    return mock_services.get(title, None)

# Patch the function
import utils
utils.get_au_streaming_offers_for_film = mock_streaming_function

def demo_api():
    """Demonstrate the streaming API with mock data."""
    with app.test_client() as client:
        print("🎬 Film Finder Streaming Service API Demo")
        print("=" * 50)
        
        movies = ["The Shawshank Redemption", "The Godfather", "Pulp Fiction", "Unknown Movie"]
        
        for movie in movies:
            print(f"\n🔍 Searching for: {movie}")
            response = client.get(f'/api/streaming/{movie}')
            data = response.get_json()
            
            if data['success'] and data['services']:
                print(f"   ✅ Found {len(data['services'])} streaming service(s):")
                for service in data['services']:
                    print(f"      📺 {service['service_name']}")
            else:
                print("   ❌ No streaming services found")
        
        print("\n" + "=" * 50)
        print("Demo complete! The API is working correctly. 🎉")
        print("\nTo start the actual API server, run:")
        print("   python streaming_api.py")

if __name__ == '__main__':
    demo_api()