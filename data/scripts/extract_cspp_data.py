#!/usr/bin/env python3
"""
California State Preschool Program (CSPP) Data Extractor

This script downloads the latest CSPP data from the California Student Aid Commission website,
processes it, and stores it in a structured format in the data warehouse.
"""

import os
import requests
import pandas as pd
import sqlite3
import logging
from datetime import datetime
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('data/cspp_data_extract.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger('cspp_extractor')

# Constants
CSPP_DATA_URL = "https://www.csac.ca.gov/sites/default/files/file-attachments/gstg_cspp_list.xlsx"
RAW_DATA_DIR = "data/raw"
PROCESSED_DATA_DIR = "data/processed"
DB_PATH = "data/preschool_warehouse.db"

def ensure_directories():
    """Ensure all necessary directories exist."""
    for directory in [RAW_DATA_DIR, PROCESSED_DATA_DIR]:
        os.makedirs(directory, exist_ok=True)

def download_data(url=CSPP_DATA_URL):
    """Download the CSPP data from the specified URL."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{RAW_DATA_DIR}/cspp_data_{timestamp}.xlsx"
    
    logger.info(f"Downloading data from {url}")
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors
        
        with open(filename, 'wb') as f:
            f.write(response.content)
        
        logger.info(f"Data successfully downloaded to {filename}")
        return filename
    except Exception as e:
        logger.error(f"Error downloading data: {e}")
        raise

def process_data(input_file):
    """Process the downloaded Excel file and return a cleaned DataFrame."""
    logger.info(f"Processing data from {input_file}")
    
    try:
        # Read the Excel file
        df = pd.read_excel(input_file)
        
        # Basic data cleaning and preprocessing
        # Rename columns to standardized format
        # This may need adjustment based on the actual structure of the file
        df.columns = [col.lower().replace(' ', '_') for col in df.columns]
        
        # Remove duplicates
        df_clean = df.drop_duplicates()
        
        # Convert location data to proper format if needed
        if 'address' in df_clean.columns and 'city' in df_clean.columns:
            df_clean['full_address'] = df_clean['address'] + ', ' + df_clean['city'] + ', CA'
        
        # Create a unique ID for each preschool if not already present
        if 'id' not in df_clean.columns:
            df_clean['id'] = 'CSPP_' + df_clean.index.astype(str)
        
        # Add source and date information
        df_clean['data_source'] = 'CSAC'
        df_clean['extraction_date'] = datetime.now().strftime("%Y-%m-%d")
        
        # Save processed data to CSV
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = f"{PROCESSED_DATA_DIR}/cspp_processed_{timestamp}.csv"
        df_clean.to_csv(output_file, index=False)
        
        logger.info(f"Data successfully processed and saved to {output_file}")
        return df_clean
    except Exception as e:
        logger.error(f"Error processing data: {e}")
        raise

def load_to_database(df, db_path=DB_PATH):
    """Load the processed data into the SQLite database."""
    logger.info(f"Loading data to database at {db_path}")
    
    try:
        # Ensure the database directory exists
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        
        # Connect to the database
        conn = sqlite3.connect(db_path)
        
        # Create tables if they don't exist
        create_tables(conn)
        
        # Load data into the preschools table
        df.to_sql('preschools', conn, if_exists='append', index=False)
        
        # Commit changes and close connection
        conn.commit()
        conn.close()
        
        logger.info(f"Data successfully loaded to database")
    except Exception as e:
        logger.error(f"Error loading data to database: {e}")
        raise

def create_tables(conn):
    """Create the necessary tables in the database if they don't exist."""
    cursor = conn.cursor()
    
    # Create preschools table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS preschools (
        id TEXT PRIMARY KEY,
        name TEXT,
        address TEXT,
        city TEXT,
        zip_code TEXT,
        county TEXT,
        phone TEXT,
        license_number TEXT,
        capacity INTEGER,
        program_type TEXT,
        full_address TEXT,
        data_source TEXT,
        extraction_date TEXT,
        latitude REAL,
        longitude REAL
    )
    ''')
    
    # Create a location table for geocoded data
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS locations (
        preschool_id TEXT PRIMARY KEY,
        latitude REAL,
        longitude REAL,
        geocoding_date TEXT,
        FOREIGN KEY (preschool_id) REFERENCES preschools(id)
    )
    ''')
    
    # Create a data_sources table to track updates
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS data_sources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_name TEXT,
        source_url TEXT,
        extraction_date TEXT,
        record_count INTEGER,
        status TEXT
    )
    ''')
    
    conn.commit()

def update_data_source_record(record_count, status="Completed", db_path=DB_PATH):
    """Update the data_sources table with information about this extraction."""
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
        INSERT INTO data_sources (source_name, source_url, extraction_date, record_count, status)
        VALUES (?, ?, ?, ?, ?)
        ''', ('CSAC CSPP List', CSPP_DATA_URL, datetime.now().strftime("%Y-%m-%d"), record_count, status))
        
        conn.commit()
        conn.close()
    except Exception as e:
        logger.error(f"Error updating data source record: {e}")

def main():
    """Main function to execute the ETL process."""
    logger.info("Starting CSPP data extraction process")
    
    try:
        # Ensure directories exist
        ensure_directories()
        
        # Download data
        input_file = download_data()
        
        # Process data
        df = process_data(input_file)
        
        # Load data to database
        load_to_database(df)
        
        # Update data source record
        update_data_source_record(len(df))
        
        logger.info("CSPP data extraction process completed successfully")
    except Exception as e:
        logger.error(f"CSPP data extraction process failed: {e}")
        update_data_source_record(0, status="Failed")

if __name__ == "__main__":
    main() 