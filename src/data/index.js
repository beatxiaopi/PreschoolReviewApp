/**
 * Data Import Module
 * 
 * This module imports and processes data from our data warehouse for use in the app.
 * It serves as a bridge between the ETL pipeline and the app's services.
 */

import californiaPreschools from './california_preschools.json';

/**
 * Get all preschools from the data warehouse.
 * 
 * @returns {Array} An array of preschool objects.
 */
export const getAllPreschools = () => {
  try {
    return californiaPreschools.preschools || [];
  } catch (error) {
    console.error('Error loading preschools data:', error);
    return [];
  }
};

/**
 * Get preschools in a specific county.
 * 
 * @param {string} county - The name of the county.
 * @returns {Array} An array of preschool objects in the specified county.
 */
export const getPreschoolsByCounty = (county) => {
  try {
    const preschools = getAllPreschools();
    return preschools.filter(
      p => p.county && p.county.toLowerCase() === county.toLowerCase()
    );
  } catch (error) {
    console.error(`Error getting preschools in ${county} county:`, error);
    return [];
  }
};

/**
 * Get preschools near a specific location.
 * 
 * @param {number} latitude - The latitude coordinate.
 * @param {number} longitude - The longitude coordinate.
 * @param {number} maxDistance - Maximum distance in miles.
 * @returns {Array} An array of preschool objects near the specified location.
 */
export const getPreschoolsNearLocation = (latitude, longitude, maxDistance = 5) => {
  try {
    const preschools = getAllPreschools();
    
    // Calculate distances and filter by maxDistance
    return preschools
      .filter(p => p.latitude && p.longitude)
      .map(p => {
        // Calculate distance using the Haversine formula
        const distance = calculateDistance(
          latitude, longitude, 
          parseFloat(p.latitude), parseFloat(p.longitude)
        );
        
        return {
          ...p,
          distance: parseFloat(distance.toFixed(1))
        };
      })
      .filter(p => p.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.error('Error getting nearby preschools:', error);
    return [];
  }
};

/**
 * Calculate the distance between two coordinates using the Haversine formula.
 * 
 * @param {number} lat1 - Latitude of the first point.
 * @param {number} lon1 - Longitude of the first point.
 * @param {number} lat2 - Latitude of the second point.
 * @param {number} lon2 - Longitude of the second point.
 * @returns {number} The distance in miles.
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians.
 * 
 * @param {number} degrees - Angle in degrees.
 * @returns {number} Angle in radians.
 */
function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

/**
 * Get metadata about the imported data.
 * 
 * @returns {Object} Metadata object with source, count, and generation date.
 */
export const getDataMetadata = () => {
  try {
    return californiaPreschools.metadata || {
      source: 'Unknown',
      count: 0,
      generated_date: 'Unknown'
    };
  } catch (error) {
    console.error('Error getting data metadata:', error);
    return {
      source: 'Error',
      count: 0,
      generated_date: 'Error'
    };
  }
};

export default {
  getAllPreschools,
  getPreschoolsByCounty,
  getPreschoolsNearLocation,
  getDataMetadata
}; 