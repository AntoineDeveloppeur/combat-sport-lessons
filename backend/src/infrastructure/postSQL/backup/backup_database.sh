#!/bin/bash
set -euo pipefail

# Professional Database Backup Script for Docker PostgreSQL
# Usage: ./backup_database.sh
# This script should be run on the VPS host, not inside the container

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load configuration
if [ -f "$SCRIPT_DIR/backup_config.sh" ]; then
    source "$SCRIPT_DIR/backup_config.sh"
else
    echo "ERROR: backup_config.sh not found"
    exit 1
fi

# Variables
DATE=$(date +%Y%m%d_%H%M%S)
DAY_OF_WEEK=$(date +%u)
DAY_OF_MONTH=$(date +%d)
BACKUP_TYPE="daily"

# Determine backup type
if [ "$DAY_OF_MONTH" = "01" ]; then
    BACKUP_TYPE="monthly"
elif [ "$DAY_OF_WEEK" = "7" ]; then
    BACKUP_TYPE="weekly"
fi

BACKUP_DIR="${BACKUP_BASE_DIR}/${BACKUP_TYPE}/${DATE}"
LOG_FILE="${LOG_DIR}/backup_${DATE}.log"

# Create directories if they don't exist
mkdir -p "$BACKUP_DIR"
mkdir -p "$LOG_DIR"

# Logging function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Error handling
error_exit() {
    log "ERROR: $1"
    exit 1
}

# Check if Docker container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${DOCKER_CONTAINER}$"; then
    error_exit "Docker container '$DOCKER_CONTAINER' is not running"
fi

log "=========================================="
log "Starting $BACKUP_TYPE backup for database: $DB_NAME"
log "Container: $DOCKER_CONTAINER"
log "=========================================="

# 1. Full backup in SQL format (human-readable, portable)
log "Creating SQL dump (full database)..."
docker exec "$DOCKER_CONTAINER" pg_dump -U "$DB_USER" -d "$DB_NAME" \
    --clean --if-exists --no-owner --no-privileges \
    > "$BACKUP_DIR/full_backup.sql" \
    2>> "$LOG_FILE" || error_exit "SQL dump failed"

SQL_SIZE=$(du -h "$BACKUP_DIR/full_backup.sql" | cut -f1)
log "✓ SQL dump completed. Size: $SQL_SIZE"

# 2. Full backup in custom format (uncompressed, fast restore)
log "Creating custom format dump (uncompressed)..."
docker exec "$DOCKER_CONTAINER" pg_dump -U "$DB_USER" -d "$DB_NAME" \
    -Fc --clean --if-exists --no-owner --no-privileges \
    > "$BACKUP_DIR/full_backup.dump" \
    2>> "$LOG_FILE" || error_exit "Custom dump failed"

DUMP_SIZE=$(du -h "$BACKUP_DIR/full_backup.dump" | cut -f1)
log "✓ Custom format dump completed. Size: $DUMP_SIZE"

# 3. Verify backup integrity
log "Verifying backup integrity..."
if [ -s "$BACKUP_DIR/full_backup.sql" ] && [ -s "$BACKUP_DIR/full_backup.dump" ]; then
    log "✓ Backup files exist and are not empty"
else
    error_exit "One or more backup files are empty or do not exist"
fi

# 4. Cleanup old backups
log "Cleaning up old backups..."
if [ -f "$SCRIPT_DIR/cleanup_old_backups.sh" ]; then
    "$SCRIPT_DIR/cleanup_old_backups.sh"
else
    log "WARNING: cleanup_old_backups.sh not found, skipping cleanup"
fi

# 5. Summary
log "=========================================="
log "Backup completed successfully!"
log "Location: $BACKUP_DIR/"
log "Files:"
log "  - full_backup.sql (Size: $SQL_SIZE)"
log "  - full_backup.dump (Size: $DUMP_SIZE)"
log "Type: $BACKUP_TYPE"
log "Format: SQL + Custom dump (uncompressed)"
log "=========================================="
