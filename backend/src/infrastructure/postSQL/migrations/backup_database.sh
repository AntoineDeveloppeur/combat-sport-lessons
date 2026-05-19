#!/bin/bash

# Database Backup Script (Docker version)
# Usage: ./backup_database.sh [backup_name]

set -e  # Exit on error

# Configuration
DOCKER_CONTAINER="combat_lesson_db_prod"
DB_NAME="${POSTGRES_DB:-combat_sport_lessons}"
DB_USER="${POSTGRES_USER:-postgres}"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME=${1:-"backup_${TIMESTAMP}"}

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Database Backup Script ===${NC}"
echo "Database: $DB_NAME"
echo "Backup name: $BACKUP_NAME"
echo ""

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Full database backup
echo -e "${YELLOW}Creating full database backup...${NC}"
docker exec "$DOCKER_CONTAINER" pg_dump -U "$DB_USER" -d "$DB_NAME" -F c > "$BACKUP_DIR/${BACKUP_NAME}_full.dump"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Full backup created: ${BACKUP_DIR}/${BACKUP_NAME}_full.dump${NC}"
else
    echo -e "${RED}✗ Full backup failed${NC}"
    exit 1
fi

# SQL format backup (human-readable)
echo -e "${YELLOW}Creating SQL backup...${NC}"
docker exec "$DOCKER_CONTAINER" pg_dump -U "$DB_USER" -d "$DB_NAME" > "$BACKUP_DIR/${BACKUP_NAME}.sql"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ SQL backup created: ${BACKUP_DIR}/${BACKUP_NAME}.sql${NC}"
else
    echo -e "${RED}✗ SQL backup failed${NC}"
    exit 1
fi

# Individual table backups
echo -e "${YELLOW}Creating individual table backups...${NC}"

tables=("users" "lessons" "instructions")
for table in "${tables[@]}"; do
    docker exec "$DOCKER_CONTAINER" pg_dump -U "$DB_USER" -d "$DB_NAME" --data-only --table="$table" > "$BACKUP_DIR/${BACKUP_NAME}_${table}.sql"
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Table backup created: ${table}${NC}"
    else
        echo -e "${RED}✗ Table backup failed: ${table}${NC}"
    fi
done

# Get file sizes
echo ""
echo -e "${YELLOW}=== Backup Summary ===${NC}"
ls -lh "$BACKUP_DIR/${BACKUP_NAME}"* | awk '{print $9, "-", $5}'

# Calculate total size
total_size=$(du -sh "$BACKUP_DIR/${BACKUP_NAME}"* | awk '{sum+=$1} END {print sum}')
echo ""
echo -e "${GREEN}Backup completed successfully!${NC}"
echo "Location: $BACKUP_DIR"
echo "Files: ${BACKUP_NAME}*"

# Cleanup old backups (keep last 10)
echo ""
echo -e "${YELLOW}Cleaning up old backups (keeping last 10)...${NC}"
cd "$BACKUP_DIR"
ls -t backup_*.sql 2>/dev/null | tail -n +11 | xargs -r rm
ls -t backup_*.dump 2>/dev/null | tail -n +11 | xargs -r rm
echo -e "${GREEN}✓ Cleanup completed${NC}"

echo ""
echo -e "${GREEN}=== All done! ===${NC}"
