import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { aeratorId, status } = body;

    // Validate input
    if (!aeratorId || typeof status !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Invalid input. aeratorId and status (boolean) are required.' },
        { status: 400 }
      );
    }

    // Validate aeratorId is between 1 and 8
    if (aeratorId < 1 || aeratorId > 8) {
      return NextResponse.json(
        { success: false, message: 'Invalid aeratorId. Must be between 1 and 8.' },
        { status: 400 }
      );
    }

    // Simulate hardware communication delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Log the action
    console.log(`Aerator ${aeratorId} turned ${status ? 'ON' : 'OFF'}`);
    
    return NextResponse.json({
      success: true,
      message: `Aerator ${aeratorId} turned ${status ? 'ON' : 'OFF'}`,
      data: {
        aeratorId,
        status,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error toggling aerator:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}