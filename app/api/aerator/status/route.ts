import { NextRequest, NextResponse } from 'next/server';
import { readAeratorStates, writeAeratorStates } from '@/lib/aeratorStorage';

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

    // Read current states
    let aerators = readAeratorStates();
    
    // Update aerators based on mode
    if (isAutoMode) {
      // In auto mode, turn all aerators on
      aerators = aerators.map(aerator => ({ ...aerator, status: true }));
    } else {
      // In manual mode, set the specified number of aerators to active
      aerators = aerators.map((aerator, index) => ({
        ...aerator,
        status: index < activeCount
      }));
    }
    
    // Save to file
    const saved = writeAeratorStates(aerators);
    if (!saved) {
      return NextResponse.json(
        { success: false, message: 'Failed to save aerator states' },
        { status: 500 }
      );
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    console.log(`Aerator mode changed to: ${isAutoMode ? 'Automatic' : 'Manual'}`);
    console.log(`Active aerators: ${activeCount}`);
    
    return NextResponse.json({
      success: true,
      message: `Aerator mode set to ${isAutoMode ? 'Automatic' : 'Manual'}`,
      data: {
        isAutoMode,
        activeCount,
        allStates: aerators,
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

export async function GET() {
  try {
    const aerators = readAeratorStates();
    return NextResponse.json({
      success: true,
      data: {
        aerators,
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