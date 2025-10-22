import { NextRequest, NextResponse } from 'next/server';
import { readAeratorStates, writeAeratorStates } from '@/lib/aeratorStorage';

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

    // Read current states
    let aerators = readAeratorStates();
    
    // Find and update the aerator
    const aeratorIndex = aerators.findIndex(a => a.id === aeratorId);
    if (aeratorIndex === -1) {
      return NextResponse.json(
        { success: false, message: `Aerator with ID ${aeratorId} not found` },
        { status: 404 }
      );
    }
    
    // Update the status
    aerators[aeratorIndex].status = status;
    
    // Save to file
    const saved = writeAeratorStates(aerators);
    if (!saved) {
      return NextResponse.json(
        { success: false, message: 'Failed to save aerator state' },
        { status: 500 }
      );
    }
    
    // Simulate hardware communication delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log(`Aerator ${aeratorId} turned ${status ? 'ON' : 'OFF'}`);
    
    return NextResponse.json({
      success: true,
      message: `Aerator ${aeratorId} turned ${status ? 'ON' : 'OFF'}`,
      data: {
        aeratorId,
        status,
        allStates: aerators,
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
    console.error('Error getting aerator states:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}