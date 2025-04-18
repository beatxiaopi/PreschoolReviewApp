#!/usr/bin/env python3
"""
Geocoding Script for Preschool Addresses

This script retrieves ungeocoded addresses from the database and uses a geocoding service
to add latitude and longitude coordinates.
"""

import os
import sqlite3
import logging
import time
import pandas as pd
import requests
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('data/geocoding.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger('geocoder')

# Constants
DB_PATH = "data/preschool_warehouse.db"
# You would use your actual API key in a real implementation
# For demo purposes, we're using a placeholder
GEOCODING_API_KEY = os.environ.get('GEOCODING_API_KEY', 'YOUR_API_KEY')
GEOCODING_ENDPOINT = "https://maps.googleapis.com/maps/api/geocode/json"
BATCH_SIZE = 100  # Process addresses in batches
RATE_LIMIT = 0.5  # Time in seconds to wait between API calls

def get_ungeocoded_addresses(db_path=DB_PATH):
    """Retrieve preschools from the database that haven't been geocoded yet."""
    logger.info("Retrieving ungeocoded addresses from database")
    
    try:
        conn = sqlite3.connect(db_path)
        
        # Get preschools that don't have entries in the locations table
        query = """
        SELECT p.id, p.full_address
        FROM preschools p
        LEFT JOIN locations l ON p.id = l.preschool_id
        WHERE l.preschool_id IS NULL
          AND p.full_address IS NOT NULL
        LIMIT ?
        """
        
        df = pd.read_sql_query(query, conn, params=(BATCH_SIZE,))
        conn.close()
        
        logger.info(f"Retrieved {len(df)} ungeocoded addresses")
        return df
    except Exception as e:
        logger.error(f"Error retrieving ungeocoded addresses: {e}")
        raise

def geocode_address(address):
    """Geocode a single address using the Google Maps Geocoding API."""
    try:
        params = {
            'address': address,
            'key': GEOCODING_API_KEY
        }
        
        response = requests.get(GEOCODING_ENDPOINT, params=params)
        response.raise_for_status()
        
        data = response.json()
        
        if data['status'] == 'OK' and len(data['results']) > 0:
            location = data['results'][0]['geometry']['location']
            return location['lat'], location['lng']
        else:
            logger.warning(f"Could not geocode address: {address}. Status: {data['status']}")
            return None, None
    except Exception as e:
        logger.error(f"Error geocoding address {address}: {e}")
        return None, None

def batch_geocode(addresses_df):
    """Geocode a batch of addresses."""
    logger.info(f"Geocoding {len(addresses_df)} addresses")
    
    results = []
    
    for _, row in addresses_df.iterrows():
        preschool_id = row['id']
        address = row['full_address']
        
        logger.info(f"Geocoding address for preschool {preschool_id}: {address}")
        lat, lng = geocode_address(address)
        
        results.append({
            'preschool_id': preschool_id,
            'latitude': lat,
            'longitude': lng,
            'geocoding_date': datetime.now().strftime("%Y-%m-%d")
        })
        
        # Respect rate limiting
        time.sleep(RATE_LIMIT)
    
    return pd.DataFrame(results)

def update_database(geocoded_df, db_path=DB_PATH):
    """Update the database with the geocoded information."""
    logger.info(f"Updating database with {len(geocoded_df)} geocoded addresses")
    
    try:
        conn = sqlite3.connect(db_path)
        
        # Insert into locations table
        geocoded_df.to_sql('locations', conn, if_exists='append', index=False)
        
        # Update the preschools table with the lat/lng values
        cursor = conn.cursor()
        for _, row in geocoded_df.iterrows():
            if row['latitude'] is not None and row['longitude'] is not None:
                cursor.execute("""
                UPDATE preschools
                SET latitude = ?, longitude = ?
                WHERE id = ?
                """, (row['latitude'], row['longitude'], row['preschool_id']))
        
        conn.commit()
        conn.close()
        
        logger.info("Database successfully updated with geocoded information")
    except Exception as e:
        logger.error(f"Error updating database with geocoded information: {e}")
        raise

def main():
    """Main function to execute the geocoding process."""
    logger.info("Starting address geocoding process")
    
    try:
        # Get ungeocoded addresses from database
        addresses_df = get_ungeocoded_addresses()
        
        if addresses_df.empty:
            logger.info("No ungeocoded addresses found. Exiting.")
            return
        
        # Geocode addresses
        geocoded_df = batch_geocode(addresses_df)
        
        # Update database
        update_database(geocoded_df)
        
        logger.info(f"Successfully geocoded {sum(geocoded_df['latitude'].notna())} addresses")
    except Exception as e:
        logger.error(f"Geocoding process failed: {e}")

if __name__ == "__main__":
    main() 