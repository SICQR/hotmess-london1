# SQL Scripts Directory

This directory contains various SQL scripts for database management, testing, and maintenance.

## Directory Structure

### `/testing/`
Test and verification scripts for development and debugging:
- `CHECK_*.sql` - Schema and data validation scripts
- `VERIFY_*.sql` - Verification scripts for specific features
- `GET_TEST_*.sql` - Scripts to retrieve test data
- `RLS_TEST_*.sql` - Row Level Security testing scripts
- `DEBUG_*.sql` - Debugging utilities

### `/legacy/`
Archive of old migration files and deprecated schemas:
- `OLD_*.sql` - Deprecated or superseded scripts
- `MIGRATION_*.sql` - Old migration files (use `/supabase/migrations/` for current migrations)
- `DATABASE_SCHEMA_*.sql` - Historical schema snapshots
- `supabase_*.sql` - Legacy Supabase setup scripts

### Root `/scripts/`
One-off maintenance and fix scripts:
- `FIX_*.sql` - Scripts to fix specific issues
- `ADD_*.sql` - Scripts to add missing data or columns
- `RUN_THIS_*.sql` - Manual execution scripts
- `PASTE_INTO_SUPABASE.sql` - Quick setup scripts

## Current Database Migrations

**All current database migrations are maintained in `/supabase/migrations/`**

See `/supabase/migrations/README.md` for migration guidelines.

## Usage

These scripts are for manual execution in the Supabase SQL editor or via the Supabase CLI.

⚠️ **Warning**: Always review scripts before executing in production. Most scripts here are for development/testing purposes.
