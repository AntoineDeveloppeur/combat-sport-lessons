#!/bin/bash

# Database Restore Script (Docker version)
# Usage: ./restore_database.sh <backup_file>

set -e  # Exit on error

# Configuration
DOCKER_CONTAINER="combat_lesson_db_prod"
DB_NAME="${POSTGRES_DB:-combat_sport_lessons}"
DB_USER="${POSTGRES_USER:-postgres}"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if backup file is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: No backup file specified${NC}"
    echo "Usage: ./restore_database.sh <backup_file>"
    echo ""
    echo "Available backups:"
    ls -lh backups/ 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_FILE="$1"

# Check if file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}Error: Backup file not found: $BACKUP_FILE${NC}"
    exit 1
fi

echo -e "${YELLOW}=== Database Restore Script ===${NC}"
echo "Database: $DB_NAME"
echo "Backup file: $BACKUP_FILE"
echo ""

# Warning
echo -e "${RED}⚠️  WARNING: This will OVERWRITE the current database!${NC}"
echo -e "${YELLOW}Press Ctrl+C to cancel, or Enter to continue...${NC}"
read

# Create a safety backup before restore
echo -e "${YELLOW}Creating safety backup before restore...${NC}"
SAFETY_BACKUP="backups/before_restore_$(date +%Y%m%d_%H%M%S).sql"
docker exec "$DOCKER_CONTAINER" pg_dump -U "$DB_USER" -d "$DB_NAME" > "$SAFETY_BACKUP"
echo -e "${GREEN}✓ Safety backup created: $SAFETY_BACKUP${NC}"

# Detect backup type and restore
if [[ "$BACKUP_FILE" == *.dump ]]; then
    # Custom format backup
    echo -e "${YELLOW}Restoring from custom format backup...${NC}"
    
    # Drop and recreate database
    docker exec "$DOCKER_CONTAINER" psql -U "$DB_USER" -c "DROP DATABASE IF EXISTS $DB_NAME;"
    docker exec "$DOCKER_CONTAINER" psql -U "$DB_USER" -c "CREATE DATABASE $DB_NAME;"
    
    # Restore
    cat "$BACKUP_FILE" | docker exec -i "$DOCKER_CONTAINER" pg_restore -U "$DB_USER" -d "$DB_NAME"
    
elif [[ "$BACKUP_FILE" == *.sql ]]; then
    # SQL format backup
    echo -e "${YELLOW}Restoring from SQL backup...${NC}"
    
    # Drop and recreate database
    docker exec "$DOCKER_CONTAINER" psql -U "$DB_USER" -c "DROP DATABASE IF EXISTS $DB_NAME;"
    docker exec "$DOCKER_CONTAINER" psql -U "$DB_USER" -c "CREATE DATABASE $DB_NAME;"
    
    # Restore
    cat "$BACKUP_FILE" | docker exec -i "$DOCKER_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME"
    
else
    echo -e "${RED}Error: Unknown backup format${NC}"
    exit 1
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database restored successfully!${NC}"
    
    # Verify restore
    echo ""
    echo -e "${YELLOW}Verifying restore...${NC}"
    docker exec "$DOCKER_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -c "\dt" | head -20
    
    echo ""
    echo -e "${GREEN}=== Restore completed! ===${NC}"
    echo "Safety backup saved at: $SAFETY_BACKUP"
else
    echo -e "${RED}✗ Restore failed${NC}"
    echo "You can restore the safety backup with:"
    echo "./restore_database.sh $SAFETY_BACKUP"
    exit 1
fi
