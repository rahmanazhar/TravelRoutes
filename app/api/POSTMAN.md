# Testing Travel Routes API with Postman

## Setup

1. Import the `postman_collection.json` file into Postman
2. Set up an environment variable:
   - Name: `base_url`
   - Value: Your API base URL (e.g., `http://localhost:3000`)

## Available Endpoints

### 1. Search Places
```http
GET {{base_url}}/api/places?query=Johor Bahru
```

Example Response:
```json
{
  "places": [
    {
      "name": "Johor Bahru",
      "formatted_address": "Johor Bahru, Johor, Malaysia",
      "location": {
        "lat": 1.4927,
        "lng": 103.7414
      },
      "place_id": "ChIJkX5IZqzR2jER5HFDh1x3yc4"
    }
  ]
}
```

### 2. Get Directions
```http
POST {{base_url}}/api/directions
Content-Type: application/json

{
  "origin": {
    "lat": 1.4927,
    "lng": 103.7414
  },
  "destination": {
    "lat": 6.4414,
    "lng": 100.1986
  }
}
```

Example Response (Standard Google Directions API format):
```json
{
  "geocoded_waypoints": [...],
  "routes": [
    {
      "bounds": {
        "northeast": {
          "lat": 6.4414,
          "lng": 103.7414
        },
        "southwest": {
          "lat": 1.4927,
          "lng": 100.1986
        }
      },
      "legs": [
        {
          "distance": {
            "text": "817 km",
            "value": 817000
          },
          "duration": {
            "text": "11 hours 30 mins",
            "value": 41400
          },
          "end_address": "Kangar, Perlis, Malaysia",
          "start_address": "Johor Bahru, Johor, Malaysia",
          "steps": [...]
        }
      ],
      "overview_polyline": {
        "points": "..."
      },
      "summary": "North-South Expressway/E1"
    }
  ],
  "status": "OK"
}
```

### 3. Get Directions with Waypoints
```http
POST {{base_url}}/api/directions
Content-Type: application/json

{
  "origin": {
    "lat": 1.4927,
    "lng": 103.7414
  },
  "destination": {
    "lat": 6.4414,
    "lng": 100.1986
  },
  "waypoints": [
    {
      "lat": 3.1390,
      "lng": 101.6869
    }
  ]
}
```

## Quick Start Guide

1. **Import Collection**
   - Open Postman
   - Click "Import" button
   - Select `postman_collection.json`

2. **Set Environment**
   - Create new environment
   - Add variable `base_url`
   - Set value to your API URL
   - Select the environment

3. **Test Search Places**
   - Select "Search Places" request
   - Modify query parameter if needed
   - Click Send
   - View results in standard Google Places format

4. **Test Get Directions**
   - Select "Get Directions" request
   - Review/modify coordinates in body
   - Click Send
   - View results in standard Google Directions format

## Notes

- All responses are in standard Google API format
- No additional formatting or modification is applied
- Error responses will include standard HTTP status codes
- Make sure your Google Maps API key is properly configured in the backend
