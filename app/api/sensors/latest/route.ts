// app/api/sensors/latest/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

// GET /api/sensors/latest - Get latest sensor data
// GET /api/sensors/latest?history=true - Get history with optional date filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const isHistory = searchParams.get('history') === 'true';
    
    // If history parameter is present, return history data
    if (isHistory) {
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');

      // Build where clause for date filtering
      const whereClause: any = {};
      
      if (startDate || endDate) {
        whereClause.created_at = {};
        
        if (startDate) {
          // Set time to start of day
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          whereClause.created_at.gte = start;
        }
        
        if (endDate) {
          // Set time to end of day
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          whereClause.created_at.lte = end;
        }
      }

      // Fetch history data from database
      const sensors = await prisma.sensors.findMany({
        where: whereClause,
        orderBy: {
          created_at: 'desc'
        },
        take: 1000 // Limit to last 1000 records
      });

      return NextResponse.json({
        success: true,
        data: sensors,
        count: sensors.length
      });
    }
    
    // Otherwise, return latest sensor data
    const latestSensor = await prisma.sensors.findFirst({
      orderBy: {
        created_at: 'desc'
      }
    });

    if (!latestSensor) {
      return NextResponse.json({
        success: false,
        message: 'No sensor data found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: latestSensor
    });

  } catch (error) {
    console.error('Error fetching sensor data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch sensor data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}