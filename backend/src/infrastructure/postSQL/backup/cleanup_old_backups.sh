#!/bin/bash
set -euo pipefail

# Cleanup Old Backups Script
# Usage: ./cleanup_old_backups.sh
# This script removes old backups according to retention policy

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load configuration
if [ -f "$SCRIPT_DIR/backup_config.sh" ]; then
    source "$SCRIPT_DIR/backup_config.sh"
else
    echo "ERROR: backup_config.sh not found"
    exit 1
fi

LOG_FILE="${LOG_DIR}/cleanup_$(date +%Y%m%d).log"
mkdir -p "$LOG_DIR"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Starting backup cleanup..."

# Cleanup daily backups
if [ -d "${BACKUP_BASE_DIR}/daily" ]; then
    DAILY_COUNT=$(find "${BACKUP_BASE_DIR}/daily" -type d -mtime +$DAILY_RETENTION 2>/dev/null | wc -l)
    if [ "$DAILY_COUNT" -gt 0 ]; then
        log "Removing $DAILY_COUNT daily backup directories older than $DAILY_RETENTION days..."
        find "${BACKUP_BASE_DIR}/daily" -type d -mtime +$DAILY_RETENTION -exec rm -rf {} +
    else
        log "No daily backups to clean up"
    fi
fi

# Cleanup weekly backups
if [ -d "${BACKUP_BASE_DIR}/weekly" ]; then
    WEEKLY_COUNT=$(find "${BACKUP_BASE_DIR}/weekly" -type d -mtime +$WEEKLY_RETENTION 2>/dev/null | wc -l)
    if [ "$WEEKLY_COUNT" -gt 0 ]; then
        log "Removing $WEEKLY_COUNT weekly backup directories older than $WEEKLY_RETENTION days..."
        find "${BACKUP_BASE_DIR}/weekly" -type d -mtime +$WEEKLY_RETENTION -exec rm -rf {} +
    else
        log "No weekly backups to clean up"
    fi
fi

# Cleanup monthly backups
if [ -d "${BACKUP_BASE_DIR}/monthly" ]; then
    MONTHLY_COUNT=$(find "${BACKUP_BASE_DIR}/monthly" -type d -mtime +$MONTHLY_RETENTION 2>/dev/null | wc -l)
    if [ "$MONTHLY_COUNT" -gt 0 ]; then
        log "Removing $MONTHLY_COUNT monthly backup directories older than $MONTHLY_RETENTION days..."
        find "${BACKUP_BASE_DIR}/monthly" -type d -mtime +$MONTHLY_RETENTION -exec rm -rf {} +
    else
        log "No monthly backups to clean up"
    fi
fi

# Cleanup old logs (keep 30 days)
if [ -d "$LOG_DIR" ]; then
    LOG_COUNT=$(find "$LOG_DIR" -name "*.log" -mtime +30 2>/dev/null | wc -l)
    if [ "$LOG_COUNT" -gt 0 ]; then
        log "Removing $LOG_COUNT log files older than 30 days..."
        find "$LOG_DIR" -name "*.log" -mtime +30 -delete
    else
        log "No old logs to clean up"
    fi
fi

# Display current backup storage usage
log "=========================================="
log "Current backup storage usage:"
if [ -d "$BACKUP_BASE_DIR" ]; then
    du -sh "${BACKUP_BASE_DIR}"/* 2>/dev/null | while read size dir; do
        log "  $dir: $size"
    done
    TOTAL_SIZE=$(du -sh "$BACKUP_BASE_DIR" 2>/dev/null | cut -f1)
    log "Total: $TOTAL_SIZE"
else
    log "Backup directory not found: $BACKUP_BASE_DIR"
fi
log "=========================================="

log "Cleanup completed"
