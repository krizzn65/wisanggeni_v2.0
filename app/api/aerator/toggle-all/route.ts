import { NextRequest, NextResponse } from 'next/server';
import { readAeratorStates, writeAeratorStates } from '@/lib/aeratorStorage';

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

    // Read current states
    let aerators = readAeratorStates();
    
    // Update all aerators
    aerators = aerators.map(aerator => ({ ...aerator, status }));
    
    // Save to file
    const saved = writeAeratorStates(aerators);
    if (!saved) {
      return NextResponse.json(
        { success: false, message: 'Failed to save aerator states' },
        { status: 500 }
      );
    }
    
    // Simulate hardware communication delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`All aerators turned ${status ? 'ON' : 'OFF'}`);
    
    return NextResponse.json({
      success: true,
      message: `All aerators turned ${status ? 'ON' : 'OFF'}`,
      data: {
        status,
        allStates: aerators,
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