import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { status } = body;

    // Validate input
    if (typeof status !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Invalid input. status (boolean) is required.' },
        { status: 400 }
      );
    }

    // Simulate hardware communication delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Log the action
    console.log(`All aerators turned ${status ? 'ON' : 'OFF'}`);
    
    return NextResponse.json({
      success: true,
      message: `All aerators turned ${status ? 'ON' : 'OFF'}`,
      data: {
        status,
        count: 8,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error toggling all aerators:', error);
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