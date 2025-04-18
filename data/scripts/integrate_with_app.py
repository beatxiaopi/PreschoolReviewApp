#!/usr/bin/env python3
"""
Data Integration Script

This script exports data from the warehouse database in a format that can be used by the React Native app.
It generates a JSON file that can be imported by the RecommendationService.
"""

import os
import json
import sqlite3
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('data/integration.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger('integrator')

# Constants
DB_PATH = "data/preschool_warehouse.db"
APP_DATA_DIR = "../src/data"
OUTPUT_FILE = f"{APP_DATA_DIR}/california_preschools.json"

def ensure_app_data_dir():
    """Ensure the app data directory exists."""
    os.makedirs(APP_DATA_DIR, exist_ok=True)

def get_preschool_data(db_path=DB_PATH):
    """Retrieve processed preschool data from the database."""
    logger.info("Retrieving preschool data from database")
    
    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row  # This enables column access by name
        
        cursor = conn.cursor()
        cursor.execute("""
        SELECT 
            p.id,
            p.name,
            p.address,
            p.city,
            p.zip_code,
            p.county,
            p.phone,
            p.license_number,
            p.capacity,
            p.program_type,
            p.full_address,
            p.latitude,
            p.longitude,
            p.data_source,
            p.extraction_date
        FROM preschools p
        WHERE p.latitude IS NOT NULL AND p.longitude IS NOT NULL
        """)
        
        rows = cursor.fetchall()
        conn.close()
        
        # Convert to list of dictionaries
        preschools = [dict(row) for row in rows]
        
        logger.info(f"Retrieved {len(preschools)} preschools with location data")
        return preschools
    except Exception as e:
        logger.error(f"Error retrieving preschool data: {e}")
        raise

def format_for_app(preschools):
    """Format the preschool data for the app."""
    logger.info("Formatting preschool data for app integration")
    
    formatted_preschools = []
    
    for p in preschools:
        # Create a standardized format that matches what the app expects
        formatted = {
            "id": p["id"],
            "name": p["name"],
            "description": f"A California State Preschool Program located in {p['city']}. License number: {p['license_number']}",
            "address": p["address"],
            "city": p["city"],
            "state": "CA",
            "zip_code": p["zip_code"],
            "county": p["county"],
            "phone": p["phone"],
            "website": "",  # Placeholder, not available in source data
            "rating": 0,    # Placeholder, not available in source data
            "reviewCount": 0,  # Placeholder, not available in source data
            "license_number": p["license_number"],
            "capacity": p["capacity"],
            "program_type": p["program_type"],
            "full_address": p["full_address"],
            "ageRange": "2-5 years",  # Default for CSPP, adjust as needed
            "curriculum": "California State Preschool Program",
            "tuition": "Subsidized",  # Most CSPPs are subsidized
            "hours": "Varies",  # Placeholder, not available in source data
            "latitude": p["latitude"],
            "longitude": p["longitude"],
            "data_source": p["data_source"],
            "images": [
                "https://example.com/images/generic_preschool1.jpg",
                "https://example.com/images/generic_preschool2.jpg"
            ],
            "features": [
                "California State Preschool Program",
                "State-funded"
            ],
            "reviews": []  # Placeholder, no reviews in source data
        }
        
        formatted_preschools.append(formatted)
    
    return formatted_preschools

def save_to_json(data, output_file=OUTPUT_FILE):
    """Save the formatted data to a JSON file."""
    logger.info(f"Saving {len(data)} preschools to {output_file}")
    
    try:
        ensure_app_data_dir()
        
        # Add metadata
        output_data = {
            "metadata": {
                "generated_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "source": "California Student Aid Commission",
                "count": len(data)
            },
            "preschools": data
        }
        
        with open(output_file, 'w') as f:
            json.dump(output_data, f, indent=2)
        
        logger.info(f"Data successfully saved to {output_file}")
    except Exception as e:
        logger.error(f"Error saving data to JSON: {e}")
        raise

def main():
    """Main function to execute the integration process."""
    logger.info("Starting data integration process")
    
    try:
        # Get preschool data from database
        preschools = get_preschool_data()
        
        if not preschools:
            logger.info("No preschool data found. Exiting.")
            return
        
        # Format data for the app
        formatted_data = format_for_app(preschools)
        
        # Save to JSON file
        save_to_json(formatted_data)
        
        logger.info("Data integration process completed successfully")
    except Exception as e:
        logger.error(f"Data integration process failed: {e}")

if __name__ == "__main__":
    main() 