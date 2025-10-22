import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'aerators.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dir = path.dirname(dataFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Read aerator states from file
export const readAeratorStates = () => {
  try {
    ensureDataDir();
    if (fs.existsSync(dataFilePath)) {
      const fileContents = fs.readFileSync(dataFilePath, 'utf8');
      const data = JSON.parse(fileContents);
      return data.aerators || [];
    }
  } catch (error) {
    console.error('Error reading aerator states:', error);
  }
  
  // Return default states if file doesn't exist or error occurs
  return [
    { id: 1, name: 'Aerator 1', status: false },
    { id: 2, name: 'Aerator 2', status: false },
    { id: 3, name: 'Aerator 3', status: false },
    { id: 4, name: 'Aerator 4', status: false },
    { id: 5, name: 'Aerator 5', status: false },
    { id: 6, name: 'Aerator 6', status: false },
    { id: 7, name: 'Aerator 7', status: false },
    { id: 8, name: 'Aerator 8', status: false },
  ];
};

// Write aerator states to file
export const writeAeratorStates = (aerators: any[]) => {
  try {
    ensureDataDir();
    const data = {
      aerators,
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing aerator states:', error);
    return false;
  }
};