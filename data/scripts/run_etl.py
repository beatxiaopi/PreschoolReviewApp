#!/usr/bin/env python3
"""
ETL Orchestration Script

This script orchestrates the entire ETL process for the preschool data warehouse:
1. Extract data from the California Student Aid Commission website
2. Transform and load it into the SQLite database
3. Geocode addresses to add latitude and longitude
4. Integrate with the app by generating JSON files
"""

import os
import sys
import logging
import subprocess
from datetime import datetime

# Configure logging
log_dir = 'data/logs'
os.makedirs(log_dir, exist_ok=True)

log_file = f"{log_dir}/etl_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger('etl_orchestrator')

# Make the scripts directory accessible
sys.path.append(os.path.join(os.path.dirname(__file__)))

def run_script(script_name):
    """Run a Python script and log the output."""
    script_path = os.path.join(os.path.dirname(__file__), script_name)
    
    logger.info(f"Running {script_name}...")
    
    try:
        result = subprocess.run(
            [sys.executable, script_path],
            capture_output=True,
            text=True,
            check=True
        )
        
        logger.info(f"{script_name} completed successfully")
        logger.debug(f"Output: {result.stdout}")
        
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"{script_name} failed with error code {e.returncode}")
        logger.error(f"Error output: {e.stderr}")
        
        return False

def main():
    """Main function to run the ETL process."""
    logger.info("Starting preschool data ETL process")
    
    # Step 1: Extract data from source and load into database
    if not run_script("extract_cspp_data.py"):
        logger.error("Data extraction failed. Exiting.")
        return
    
    # Step 2: Geocode addresses
    if not run_script("geocode_addresses.py"):
        logger.warning("Geocoding process failed or was incomplete. Continuing with available data.")
    
    # Step 3: Integrate with app
    if not run_script("integrate_with_app.py"):
        logger.error("App integration failed. Exiting.")
        return
    
    logger.info("ETL process completed successfully")

if __name__ == "__main__":
    main() 