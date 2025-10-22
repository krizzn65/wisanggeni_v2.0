import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { isAutoMode, activeCount } = body;

    // Validate input
    if (typeof isAutoMode !== 'boolean' || typeof activeCount !== 'number') {
      return NextResponse.json(
        { success: false, message: 'Invalid input. isAutoMode (boolean) and activeCount (number) are required.' },
        { status: 400 }
      );
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Log the action
    console.log(`Aerator mode changed to: ${isAutoMode ? 'Automatic' : 'Manual'}`);
    console.log(`Active aerators: ${activeCount}`);
    
    return NextResponse.json({
      success: true,
      message: `Aerator mode set to ${isAutoMode ? 'Automatic' : 'Manual'}`,
      data: {
        isAutoMode,
        activeCount,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error setting aerator status:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle GET requests to get current status
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        message: "Current status endpoint",
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error getting aerator status:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}