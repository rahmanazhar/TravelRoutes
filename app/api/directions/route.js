import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { origin, destination, waypoints } = body;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!origin || !destination) {
      return NextResponse.json(
        { error: 'Origin and destination are required' },
        { status: 400 }
      );
    }

    // Construct waypoints string if provided
    let waypointsString = '';
    if (waypoints && waypoints.length > 0) {
      waypointsString = `&waypoints=${waypoints
        .map(point => `via:${point.lat},${point.lng}`)
        .join('|')}`;
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}${waypointsString}&key=${apiKey}`
    );

    const data = await response.json();

    // Return the raw Google Directions API response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Directions API Error:', error);
    return NextResponse.json(
      { error: 'Failed to get directions' },
      { status: 500 }
    );
  }
}
