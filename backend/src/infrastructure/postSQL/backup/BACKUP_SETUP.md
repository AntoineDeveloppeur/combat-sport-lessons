# PostgreSQL Backup & Restore Setup Guide (Docker)

Complete guide for setting up automated backups for PostgreSQL running in
Docker.

**Note:** This setup creates uncompressed SQL backups stored locally on the VPS.

## 📋 Prerequisites

- Docker and Docker Compose installed
- PostgreSQL container running (`backend-postgres-1`)
- Root or sudo access on VPS
- Sufficient disk space for backups (SQL files are uncompressed)

## 🚀 Quick Start

### 1. Create Directory Structure on VPS

```bash
# Create backup directories
sudo mkdir -p /opt/backups/scripts
sudo mkdir -p /var/backups/postgresql/{daily,weekly,monthly}
sudo mkdir -p /var/log/backups

# Set permissions
sudo chmod 755 /opt/backups/scripts
sudo chmod 700 /var/backups/postgresql
sudo chmod 755 /var/log/backups
```

### 2. Copy Scripts to VPS

Copy these files from your project to the VPS:

```bash
# From your local machine
scp backend/src/infrastructure/postSQL/migrations/backup_config.sh user@your-vps:/opt/backups/scripts/
scp backend/src/infrastructure/postSQL/migrations/backup_database.sh user@your-vps:/opt/backups/scripts/
scp backend/src/infrastructure/postSQL/migrations/restore_database.sh user@your-vps:/opt/backups/scripts/
scp backend/src/infrastructure/postSQL/migrations/cleanup_old_backups.sh user@your-vps:/opt/backups/scripts/
```

### 3. Configure Scripts on VPS

```bash
# SSH into your VPS
ssh user@your-vps

# Make scripts executable
sudo chmod 750 /opt/backups/scripts/*.sh
sudo chmod 640 /opt/backups/scripts/backup_config.sh

# Edit configuration
sudo nano /opt/backups/scripts/backup_config.sh
```

**Important:** Update these variables in `backup_config.sh`:

- `DOCKER_CONTAINER`: Your actual container name (check with `docker ps`)
- `DB_NAME`: Your database name (from .env file)
- `DB_USER`: Your PostgreSQL user (from .env file)

### 4. Verify Docker Container Name

```bash
# List running containers
docker ps --format "{{.Names}}"

# If your container name is different, update backup_config.sh
# Common names: backend-postgres-1, backend_postgres_1, postgres
```

### 5. Test Backup Manually

```bash
# Run a test backup
sudo /opt/backups/scripts/backup_database.sh

# Check if backup was created
ls -lh /var/backups/postgresql/daily/

# Check logs
tail -f /var/log/backups/backup_*.log
```

### 6. Setup Automated Backups with Cron

```bash
# Edit root crontab (or user with Docker access)
sudo crontab -e

# Add this line for daily backups at 2 AM
0 2 * * * /opt/backups/scripts/backup_database.sh >> /var/log/backups/cron.log 2>&1
```

## 📁 Backup Structure

Each backup is stored in a dated directory:

```
/var/backups/postgresql/daily/20260521_020000/
├── full_backup.sql             # Complete SQL dump (uncompressed)
└── full_backup.dump            # Custom format dump (uncompressed, fast restore)
```

## 🔄 Restore Procedures

### Restore from Backup

```bash
# Basic restore from backup directory
sudo /opt/backups/scripts/restore_database.sh /var/backups/postgresql/daily/20260521_020000

# Restore from SQL file directly
sudo /opt/backups/scripts/restore_database.sh /var/backups/postgresql/daily/20260521_020000/full_backup.sql

# Restore from dump file (faster)
sudo /opt/backups/scripts/restore_database.sh /var/backups/postgresql/daily/20260521_020000/full_backup.dump

# Restore to different database
sudo /opt/backups/scripts/restore_database.sh --database test_db /var/backups/postgresql/daily/20260521_020000

# Non-interactive restore (for scripts)
sudo /opt/backups/scripts/restore_database.sh --no-confirm /var/backups/postgresql/daily/20260521_020000
```

### Manual Restore (without script)

```bash
# Restore SQL dump directly
cat /var/backups/postgresql/daily/20260521_020000/full_backup.sql | \
  docker exec -i backend-postgres-1 psql -U postgres -d combat_sport_lessons

# Or restore custom dump (faster)
cat /var/backups/postgresql/daily/20260521_020000/full_backup.dump | \
  docker exec -i backend-postgres-1 pg_restore -U postgres -d combat_sport_lessons --no-owner --no-privileges
```

## ⚙️ Configuration

### Retention Policy

Edit `/opt/backups/scripts/backup_config.sh`:

```bash
export DAILY_RETENTION=7      # Keep 7 days
export WEEKLY_RETENTION=28    # Keep 4 weeks
export MONTHLY_RETENTION=365  # Keep 12 months
```

## 🔍 Monitoring

### Check Backup Status

```bash
# List recent backups
ls -lht /var/backups/postgresql/daily/ | head -10

# Check backup sizes
du -sh /var/backups/postgresql/*

# View latest backup log
tail -50 /var/log/backups/backup_*.log | tail -1
```

### Verify Backup Integrity

```bash
# Check if SQL file exists and is not empty
ls -lh /var/backups/postgresql/daily/*/full_backup.sql | tail -1

# Test restore to temporary database
sudo /opt/backups/scripts/restore_database.sh \
  --database test_restore \
  --no-confirm \
  /var/backups/postgresql/daily/LATEST_BACKUP_DIR
```

## 🚨 Troubleshooting

### Container Not Found

```bash
# Error: Docker container 'backend-postgres-1' is not running

# Solution: Check actual container name
docker ps --format "{{.Names}}"

# Update backup_config.sh with correct name
sudo nano /opt/backups/scripts/backup_config.sh
```

### Permission Denied

```bash
# Error: Permission denied

# Solution: Ensure user has Docker access
sudo usermod -aG docker $USER
# Log out and back in

# Or run as root
sudo /opt/backups/scripts/backup_database.sh
```

### Disk Space Issues

```bash
# Check disk usage
df -h /var/backups

# Clean old backups manually
sudo /opt/backups/scripts/cleanup_old_backups.sh

# Adjust retention policy
sudo nano /opt/backups/scripts/backup_config.sh
```

### Cron Not Running

```bash
# Check cron service
sudo systemctl status cron

# Check cron logs
grep CRON /var/log/syslog | tail -20

# Verify crontab
sudo crontab -l

# Test PATH in cron
# Add to crontab: PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

## 📊 Backup Schedule

| Type    | Frequency | Retention | Storage Path                       |
| ------- | --------- | --------- | ---------------------------------- |
| Daily   | Every day | 7 days    | `/var/backups/postgresql/daily/`   |
| Weekly  | Sunday    | 4 weeks   | `/var/backups/postgresql/weekly/`  |
| Monthly | 1st day   | 12 months | `/var/backups/postgresql/monthly/` |

## 🔐 Security Best Practices

1. **Restrict permissions:**

   ```bash
   chmod 700 /var/backups/postgresql
   chmod 640 /opt/backups/scripts/backup_config.sh
   ```

2. **Test restores regularly:**
   - Monthly restore test to temporary database
   - Verify data integrity
   - Document restore time

3. **Monitor backup failures:**
   - Setup email alerts
   - Use monitoring tools (Prometheus, Grafana)

## 📝 Maintenance Tasks

### Weekly

- Check backup logs for errors
- Verify latest backup exists

### Monthly

- Test restore procedure
- Review disk space usage
- Update retention policy if needed

### Quarterly

- Test disaster recovery procedure
- Review and update documentation

## 🆘 Emergency Restore

In case of data loss:

```bash
# 1. Stop the application
docker-compose down

# 2. Find latest backup
ls -lt /var/backups/postgresql/daily/ | head -5

# 3. Restore database
sudo /opt/backups/scripts/restore_database.sh \
  --no-confirm \
  /var/backups/postgresql/daily/LATEST_BACKUP_DIR

# 4. Verify data
docker exec -it backend-postgres-1 psql -U postgres -d combat_sport_lessons
# Run: SELECT COUNT(*) FROM users;

# 5. Restart application
docker-compose up -d
```

## 📞 Support

For issues or questions:

- Check logs: `/var/log/backups/`
- Review this documentation
- Test in development environment first

## 🔗 Related Files

- `backup_config.sh` - Configuration
- `backup_database.sh` - Backup script
- `restore_database.sh` - Restore script
- `cleanup_old_backups.sh` - Cleanup script
- `docker-compose.yml` - Docker configuration
