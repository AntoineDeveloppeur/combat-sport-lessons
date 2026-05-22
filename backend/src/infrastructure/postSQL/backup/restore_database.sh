#!/bin/bash
set -euo pipefail

# Professional Database Restore Script for Docker PostgreSQL
# Usage: ./restore_database.sh [OPTIONS] <backup_file>
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

LOG_FILE="${LOG_DIR}/restore_$(date +%Y%m%d_%H%M%S).log"
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

# Usage function
usage() {
    cat << EOF
Usage: $0 [OPTIONS] <backup_file_or_directory>

Restore PostgreSQL database from SQL backup in Docker container.

OPTIONS:
    -d, --database NAME     Target database name (default: $DB_NAME)
    --no-confirm            Skip confirmation prompt
    -h, --help              Show this help message

EXAMPLES:
    # Restore from backup directory
    $0 /var/backups/postgresql/daily/20260521_020000

    # Restore from SQL file directly
    $0 /var/backups/postgresql/daily/20260521_020000/full_backup.sql

    # Restore to different database
    $0 --database test_db /var/backups/postgresql/daily/20260521_020000

    # Non-interactive restore
    $0 --no-confirm /var/backups/postgresql/daily/20260521_020000
EOF
    exit 1
}

# Parse arguments
BACKUP_FILE=""
RESTORE_TYPE="sql"
TARGET_DB="$DB_NAME"
NO_CONFIRM=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--database)
            TARGET_DB="$2"
            shift 2
            ;;
        --no-confirm)
            NO_CONFIRM=true
            shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            BACKUP_FILE="$1"
            shift
            ;;
    esac
done

# Validate backup file
if [ -z "$BACKUP_FILE" ]; then
    echo "ERROR: Backup file not specified"
    usage
fi

if [ ! -f "$BACKUP_FILE" ]; then
    error_exit "Backup file not found: $BACKUP_FILE"
fi

# Check if Docker container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${DOCKER_CONTAINER}$"; then
    error_exit "Docker container '$DOCKER_CONTAINER' is not running"
fi

log "=========================================="
log "Starting database restore"
log "=========================================="
log "Backup file: $BACKUP_FILE"
log "Target database: $TARGET_DB"
log "Container: $DOCKER_CONTAINER"

# Create temporary directory
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Determine work directory
if [ -d "$BACKUP_FILE" ]; then
    # Backup file is a directory
    WORK_DIR="$BACKUP_FILE"
    log "Using backup directory: $WORK_DIR"
elif [ -f "$BACKUP_FILE" ]; then
    # Backup file is a file
    WORK_DIR="$(dirname "$BACKUP_FILE")"
    BACKUP_FILENAME="$(basename "$BACKUP_FILE")"
    
    # If it's a SQL file directly, use it
    if [[ "$BACKUP_FILENAME" == "full_backup.sql" ]]; then
        WORK_DIR="$WORK_DIR"
    fi
    log "Using backup file: $BACKUP_FILE"
else
    error_exit "Backup path is neither a file nor a directory"
fi

# Detect backup type if auto
if [ "$RESTORE_TYPE" = "auto" ]; then
    if [ -f "$WORK_DIR/full_backup.sql" ]; then
        RESTORE_TYPE="sql"
    elif [ -f "$WORK_DIR/full_backup.dump" ]; then
        RESTORE_TYPE="dump"
    elif [ -f "$BACKUP_FILE" ] && [[ "$BACKUP_FILE" == *.sql ]]; then
        RESTORE_TYPE="sql"
    elif [ -f "$BACKUP_FILE" ] && [[ "$BACKUP_FILE" == *.dump ]]; then
        RESTORE_TYPE="dump"
    else
        error_exit "Cannot detect backup type. Expected full_backup.sql or full_backup.dump file."
    fi
    log "Auto-detected backup type: $RESTORE_TYPE"
fi

# Confirmation prompt
if [ "$NO_CONFIRM" = false ]; then
    log "=========================================="
    log "WARNING: This will restore to database '$TARGET_DB'"
    log "WARNING: Existing data may be affected"
    log "=========================================="
    read -p "Continue? (yes/no): " -r
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        log "Restore cancelled by user"
        exit 0
    fi
fi

# Perform restore
case $RESTORE_TYPE in
    sql)
        log "Restoring from SQL dump..."
        
        # Determine SQL file path
        if [ -f "$WORK_DIR/full_backup.sql" ]; then
            SQL_FILE="$WORK_DIR/full_backup.sql"
        elif [ -f "$BACKUP_FILE" ] && [[ "$BACKUP_FILE" == *.sql ]]; then
            SQL_FILE="$BACKUP_FILE"
        else
            error_exit "SQL file not found"
        fi
        
        log "Using SQL file: $SQL_FILE"
        cat "$SQL_FILE" | docker exec -i "$DOCKER_CONTAINER" psql -U "$DB_USER" -d "$TARGET_DB" \
            2>> "$LOG_FILE" || error_exit "SQL restore failed"
        
        log "✓ SQL restore completed"
        ;;
        
    dump)
        log "Restoring from custom format dump..."
        
        # Determine dump file path
        if [ -f "$WORK_DIR/full_backup.dump" ]; then
            DUMP_FILE="$WORK_DIR/full_backup.dump"
        elif [ -f "$BACKUP_FILE" ] && [[ "$BACKUP_FILE" == *.dump ]]; then
            DUMP_FILE="$BACKUP_FILE"
        else
            error_exit "Dump file not found"
        fi
        
        log "Using dump file: $DUMP_FILE"
        cat "$DUMP_FILE" | docker exec -i "$DOCKER_CONTAINER" \
            pg_restore -U "$DB_USER" -d "$TARGET_DB" --no-owner --no-privileges \
            2>> "$LOG_FILE" || error_exit "Dump restore failed"
        
        log "✓ Custom dump restore completed"
        ;;
        
    *)
        error_exit "Unknown restore type: $RESTORE_TYPE. Supported types: sql, dump"
        ;;
esac

# Verify restore
log "Verifying restore..."
TABLE_COUNT=$(docker exec "$DOCKER_CONTAINER" psql -U "$DB_USER" -d "$TARGET_DB" \
    -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" \
    2>> "$LOG_FILE" | tr -d ' ')

log "✓ Verification completed. Tables found: $TABLE_COUNT"

# Analyze database
log "Running VACUUM ANALYZE..."
docker exec "$DOCKER_CONTAINER" psql -U "$DB_USER" -d "$TARGET_DB" \
    -c "VACUUM ANALYZE;" 2>> "$LOG_FILE" || log "WARNING: VACUUM ANALYZE failed"

log "=========================================="
log "Restore completed successfully!"
log "Database: $TARGET_DB"
log "Tables: $TABLE_COUNT"
log "Log file: $LOG_FILE"
log "=========================================="
