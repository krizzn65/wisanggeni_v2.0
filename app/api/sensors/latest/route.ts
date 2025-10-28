import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const latest = await prisma.sensors.findFirst({
      orderBy: { created_at: "desc" },
    });
    
    if (!latest) {
      return NextResponse.json({
        success: false,
        message: 'No sensor data found'
      });
    }
    
    return NextResponse.json({
      success: true,
      data: latest
    });
  } catch (error) {
    console.error('Error fetching latest sensor data:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}