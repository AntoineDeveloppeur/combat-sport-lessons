#!/bin/bash

# Docker configuration
export DOCKER_CONTAINER="combat_lesson_db_prod"

# Database configuration (from docker-compose environment variables)
export DB_NAME="combat_sport_lessons"  # Adjust to match POSTGRES_DB in .env
export DB_USER="postgres"              # Adjust to match POSTGRES_USER in .env

# Retention policy (in days)
export DAILY_RETENTION=7      # Keep 7 days
export WEEKLY_RETENTION=28    # Keep 4 weeks
export MONTHLY_RETENTION=365  # Keep 12 months

# Backup storage paths (on VPS host, not in container)
export BACKUP_BASE_DIR="/var/backups/postgresql"
export LOG_DIR="/var/log/backups"
