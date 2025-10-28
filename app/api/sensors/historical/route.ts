import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface WhereClause {
  created_at?: {
    gte?: Date;
    lte?: Date;
  };
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '30');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    
    const where: WhereClause = {};
    
    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) {
        where.created_at.gte = new Date(startDate);
      }
      if (endDate) {
        where.created_at.lte = new Date(endDate + 'T23:59:59.999Z');
      }
    }
    
    const historicalData = await prisma.sensors.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: limit,
    });
    
    return NextResponse.json({
      success: true,
      data: historicalData
    });
  } catch (error) {
    console.error('Error fetching historical sensor data:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}