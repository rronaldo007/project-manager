#!/usr/bin/env python3
"""
Database Initialization Script for Django + MariaDB
Run this script to set up the database for your Django project
Uses existing user credentials - no sudo required
"""

import os
import sys
import subprocess
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration from .env
DB_NAME = os.getenv('DB_NAME', 'projects')
DB_USER = os.getenv('DB_USER', 'ronaldo')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'ronaldo')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '3306')

def create_database():
    """Create database using existing user credentials"""
    
    sql_command = f"CREATE DATABASE IF NOT EXISTS {DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    
    print("="*60)
    print("MariaDB Database Initialization")
    print("="*60)
    print(f"\nCreating database: {DB_NAME}")
    print(f"Using user: {DB_USER}@{DB_HOST}")
    print("-"*60 + "\n")
    
    try:
        # Execute database creation
        process = subprocess.Popen(
            ['mysql', '-u', DB_USER, f'-p{DB_PASSWORD}', '-h', DB_HOST, '-P', DB_PORT, '-e', sql_command],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        stdout, stderr = process.communicate()
        
        if process.returncode == 0:
            print(f"✓ Database '{DB_NAME}' created successfully!\n")
            return True
        else:
            # Filter out password warning
            if "Using a password on the command line" not in stderr:
                print(f"✗ Error occurred:\n{stderr}")
                return False
            else:
                print(f"✓ Database '{DB_NAME}' created successfully!\n")
                return True
            
    except FileNotFoundError:
        print("✗ Error: 'mysql' command not found.")
        print("Make sure MariaDB client is installed.")
        return False
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
        return False

def show_databases():
    """Show all databases to confirm creation"""
    
    print("Fetching database list...")
    print("-"*60 + "\n")
    
    try:
        process = subprocess.Popen(
            ['mysql', '-u', DB_USER, f'-p{DB_PASSWORD}', '-h', DB_HOST, '-P', DB_PORT, '-e', 'SHOW DATABASES;'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        stdout, stderr = process.communicate()
        
        if process.returncode == 0:
            print("Available databases:")
            for line in stdout.split('\n'):
                if line.strip() and line.strip() != 'Database':
                    if line.strip() == DB_NAME:
                        print(f"  → {line.strip()} ✓")
                    else:
                        print(f"    {line.strip()}")
            print()
            return True
        else:
            return False
            
    except Exception as e:
        print(f"Could not list databases: {e}")
        return False

def test_connection():
    """Test database connection"""
    
    print("\n" + "-"*60)
    print("Testing connection to database...")
    print("-"*60 + "\n")
    
    try:
        process = subprocess.Popen(
            ['mysql', '-u', DB_USER, f'-p{DB_PASSWORD}', '-h', DB_HOST, '-P', DB_PORT, DB_NAME, '-e', 'SELECT DATABASE(), USER(), VERSION();'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        stdout, stderr = process.communicate()
        
        if process.returncode == 0:
            print("✓ Connection test successful!\n")
            print(stdout)
            return True
        else:
            if "Using a password on the command line" not in stderr:
                print(f"✗ Connection test failed:\n{stderr}")
                return False
            else:
                print("✓ Connection test successful!\n")
                return True
                
    except Exception as e:
        print(f"✗ Connection test error: {e}")
        return False

def print_summary():
    """Print configuration summary and next steps"""
    
    print("\n" + "="*60)
    print("Database Setup Complete!")
    print("="*60)
    print(f"""
Configuration:
  Database: {DB_NAME}
  User: {DB_USER}@{DB_HOST}
  Port: {DB_PORT}

Django Configuration (settings.py):
  DATABASES = {{
      'default': {{
          'ENGINE': 'django.db.backends.mysql',
          'NAME': '{DB_NAME}',
          'USER': '{DB_USER}',
          'PASSWORD': '{DB_PASSWORD}',
          'HOST': '{DB_HOST}',
          'PORT': '{DB_PORT}',
          'OPTIONS': {{
              'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
              'charset': 'utf8mb4',
          }},
      }}
  }}

Next Steps:
  1. Install Django MySQL client:
     pip install mysqlclient

  2. Run Django migrations:
     python manage.py makemigrations
     python manage.py migrate

  3. Create Django superuser:
     python manage.py createsuperuser

  4. Start development server:
     python manage.py runserver
""")
    print("="*60 + "\n")

def main():
    """Main execution function"""
    
    print("\n" + "="*60)
    print("MariaDB Database Initialization Script")
    print("="*60)
    print(f"\nThis will create the database '{DB_NAME}'")
    print(f"Using existing user: {DB_USER}@{DB_HOST}\n")
    
    confirm = input("Continue? (yes/no): ").lower().strip()
    
    if confirm not in ['yes', 'y']:
        print("\nOperation cancelled.")
        sys.exit(0)
    
    print()
    
    # Create database
    if create_database():
        show_databases()
        
        # Test connection
        if test_connection():
            print_summary()
            sys.exit(0)
        else:
            print("\n⚠ Database created but connection test failed.")
            print("Try connecting manually:")
            print(f"  mysql -u {DB_USER} -p {DB_NAME}")
            sys.exit(1)
    else:
        print("\n✗ Database creation failed.")
        print("\nTroubleshooting:")
        print("  1. Verify MariaDB is running")
        print("  2. Check user credentials in .env file")
        print("  3. Ensure user has CREATE DATABASE privileges")
        print(f"  4. Try manually: mysql -u {DB_USER} -p")
        sys.exit(1)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nOperation cancelled by user.")
        sys.exit(0)