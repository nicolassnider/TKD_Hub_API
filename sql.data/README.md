# TKD Hub SQL Data Files

This directory contains SQL scripts for populating the TKD Hub database with sample data and dashboard functionality.

## 📁 Files Overview

### 🚀 **RECOMMENDED: Complete Database Population**

- **`Complete_Database_Population.sql`** - **✅ START HERE** - Master execution guide and base system setup
- **`Ranks_Complete.sql`** - **✅ NEW** - Complete belt ranking system (White Belt to 9th Dan)
- **`Techniques_Sample.sql`** - **✅ NEW** - Comprehensive Taekwondo techniques database  
- **`Tuls_Sample.sql`** - **✅ NEW** - Traditional ITF forms with technique sequences
- **`Tournaments_Sample.sql`** - **✅ NEW** - Tournament structure with matches and registrations
- **`EventAttendance_Sample.sql`** - **✅ NEW** - Comprehensive attendance tracking system

### 🎛️ Dashboard & Analytics

- **`Initialize_Dashboard_Sample_Data_Final.sql`** - Complete dashboard sample data initialization
- **`Add_Attendance_Records.sql`** - Supplements attendance data for dashboard testing  
- **`Working_Dashboard_Analytics.sql`** - Verified analytics queries matching current database schema

### 🇦🇷 Argentine Sample Data (UPDATED)

- **`Argentine_Coaches.sql`** - **✅ FIXED** - 16 coaches with proper UserUserRoles (no Id column)
- **`Argentine_Students.sql`** - **✅ FIXED** - 30 students with proper role assignments
- **`Argentine_Dojangs.sql`** - 12 dojangs across Argentina with Korean names and locations
- **`Argentine_Classes.sql`** - Training classes with schedules and student assignments
- **`Master_Argentine_Data.sql`** - Complete Argentine data insertion script

### 🔧 Database Structure

- **`Add_TrainingClass_Columns.sql`** - Database schema updates for training classes

### 📊 Individual Data Files (LEGACY - FIXED)

- **`Coaches.sql`** - **✅ FIXED** - Individual coach data (UserUserRoles corrected)
- **`Students.sql`** - **✅ FIXED** - Individual student data (UserUserRoles corrected)
- **`Dojaangs.sql`** - Individual dojaang data

## 🚀 Quick Start Guide

### 🎯 **COMPLETE DATABASE SETUP (RECOMMENDED)**

**Option 1: Full Automated Setup**

```bash
# Execute complete population in correct order
sqlcmd -S "(localdb)\MSSQLLocalDB" -d TKDHubDb -i "Complete_Database_Population.sql"
sqlcmd -S "(localdb)\MSSQLLocalDB" -d TKDHubDb -i "Argentine_Dojangs.sql"
sqlcmd -S "(localdb)\MSSQLLocalDB" -d TKDHubDb -i "Argentine_Coaches.sql"
sqlcmd -S "(localdb)\MSSQLLocalDB" -d TKDHubDb -i "Argentine_Students.sql"
sqlcmd -S "(localdb)\MSSQLLocalDB" -d TKDHubDb -i "Techniques_Sample.sql"
sqlcmd -S "(localdb)\MSSQLLocalDB" -d TKDHubDb -i "Tuls_Sample.sql"
sqlcmd -S "(localdb)\MSSQLLocalDB" -d TKDHubDb -i "Argentine_Classes.sql"
sqlcmd -S "(localdb)\MSSQLLocalDB" -d TKDHubDb -i "Tournaments_Sample.sql"
sqlcmd -S "(localdb)\MSSQLLocalDB" -d TKDHubDb -i "EventAttendance_Sample.sql"
sqlcmd -S "(localdb)\MSSQLLocalDB" -d TKDHubDb -i "Initialize_Dashboard_Sample_Data_Final.sql"
```

**This gives you:**
- ✅ Complete belt ranking system (via SeedData.cs - automatic)
- ✅ 28+ Taekwondo techniques with difficulty progression
- ✅ 18 traditional ITF forms (Tuls) with technique sequences
- ✅ 30+ Argentine students and 16+ coaches with proper roles
- ✅ 12 dojangs across Argentina
- ✅ Comprehensive training classes and schedules
- ✅ Tournament system with matches and registrations
- ✅ Event attendance tracking
- ✅ Dashboard configurations for all user roles

### For Dashboard Development Only

1. **Initialize Dashboard Data**:

   ```sql
   sqlcmd -S "(localdb)\MSSQLLocalDB" -d TKDHubDb -E -i "Initialize_Dashboard_Sample_Data_Final.sql"
   ```

2. **Add Attendance Records**:

   ```sql
   sqlcmd -S "(localdb)\MSSQLLocalDB" -d TKDHubDb -E -i "Add_Attendance_Records.sql"
   ```

3. **Test Analytics**:

   ```sql
   sqlcmd -S "(localdb)\MSSQLLocalDB" -d TKDHubDb -E -i "Working_Dashboard_Analytics.sql"
   ```

### For Full Argentine Sample Data (Alternative)

```sql
sqlcmd -S "(localdb)\MSSQLLocalDB" -d TKDHubDb -E -i "Master_Argentine_Data.sql"
```

## 📊 Dashboard Sample Data Features

### Current Database Content
- **👥 33 Active Students** - Various belt ranks and age groups
- **🥋 5 Training Classes** - Including sample age-specific programs
- **📅 3 Upcoming Events** - Belt tests, tournaments, seminars
- **⭐ 10 Recent Promotions** - Student advancement tracking
- **📝 4 Blog Posts** - Sample announcements and updates
- **🎛️ 3 Dashboard Layouts** - Admin, Coach, Student role-specific views

### Analytics Support
- Student distribution by rank and age group
- Class enrollment and capacity tracking  
- Attendance patterns and trends
- Promotion history and progress tracking
- Event management and participation

## 🇦🇷 Argentine Sample Data Features (LEGACY)

### Names

- **Surnames**: Common Argentine family names (Fernández, Rodríguez, González, López, etc.)
- **First Names**: Popular Argentine given names across generations
- **Regional Variations**: Names reflecting different provinces and cultural backgrounds

### Locations

- **Buenos Aires**: Capital Federal neighborhoods and Greater Buenos Aires
- **Provinces**: Major cities including Córdoba, Mendoza, Rosario, Tucumán
- **Addresses**: Realistic street names and locations (Av. Corrientes, Av. Santa Fe, etc.)
- **Phone Numbers**: Authentic Argentine phone number formats (+54 area codes)

### Dojang Names

- **Spanish Names**: "Tigre Dorado", "Dragón Azul", "Halcón del Sur"
- **Korean Elements**: Authentic Korean characters (한글) with phonetic translations
- **Cultural Fusion**: Names that blend Argentine and Korean martial arts traditions

## 📞 Contact Information

- **Coaches**: Professional emails with @tkdhub.com.ar domain
- **Students**: Personal emails with @gmail.com domain
- **Phone Numbers**: Authentic Argentine formats by region
  - Buenos Aires: +54 11 xxxx-xxxx
  - Córdoba: +54 351 xxx-xxxx
  - Mendoza: +54 261 xxx-xxxx
  - Rosario: +54 341 xxx-xxxx
  - Tucumán: +54 381 xxx-xxxx

## 🚀 Usage Instructions

### Quick Setup (Recommended)

```sql
-- Execute the master script for complete data insertion
EXEC (SELECT BulkColumn FROM OPENROWSET(BULK 'path\to\Master_Argentine_Data.sql', SINGLE_CLOB) AS x);
```

### Individual Scripts

If you prefer to run scripts separately:

1. **First**: `Argentine_Coaches.sql` - Creates coaches and assigns roles
2. **Second**: `Argentine_Dojangs.sql` - Creates dojangs and assigns coaches
3. **Third**: `Argentine_Students.sql` - Creates students and assigns to dojangs
4. **Fourth**: `Argentine_Classes.sql` - Creates training classes with schedules and student assignments

### Prerequisites

Ensure the following tables are populated before running scripts:

- `UserRoles` (must have ID 2 = Coach, ID 3 = Student)
- `Ranks` (must have ranks 1-20 for belt progression)

## 📊 Data Statistics

- **Total Records**: 106+ records (16 coaches + 30 students + 12 dojangs + 48+ classes)
- **Age Distribution**: 8-50 years across all users
- **Geographic Coverage**: 8 provinces and 15+ cities
- **Belt Ranks**: Complete progression from White (1) to 6th Dan (20)
- **Active Users**: 100% active status for realistic testing scenarios
- **Class Schedules**: 96+ weekly time slots across all dojangs
- **Student Assignments**: Age-appropriate class placement with 80-90% attendance rates

## 🔄 Data Relationships

- **Coach-Dojang**: Each dojang assigned to one master coach
- **Student-Dojang**: Students distributed across multiple dojangs
- **Family Ties**: Related users (siblings, parent-child) in same dojangs
- **Regional Clustering**: Users grouped by geographic proximity

## 🛠️ Technical Notes

- **Password Hashes**: Dummy hashes for development (`$2a$11$dummy.hash.for.development`)
- **Timestamps**: Realistic join dates spanning 2008-2024
- **Phone Validation**: All numbers follow Argentine telecommunications format
- **Email Validation**: Valid email formats with appropriate domains
- **Unicode Support**: Korean characters properly encoded (N'한글')

## 🎯 Testing Scenarios

This data enables testing of:

- **Multi-dojang Management**: Coaches managing multiple locations
- **Family Account Handling**: Related users in the system
- **Regional Operations**: Different provinces and time zones
- **Rank Progression**: Students advancing through belt levels
- **Coach Assignment**: Automatic and manual coach-dojang relationships
- **Class Scheduling**: Multiple time slots and age-based class assignment
- **Attendance Tracking**: Realistic attendance patterns and reporting
- **Student-Class Management**: Enrollment, transfers, and class capacity planning

Perfect for demonstrating the TKD Hub application with realistic, culturally authentic data that reflects the Argentine Taekwondo community.

## 🔧 File Cleanup & Maintenance

### ✅ Current Active Files (Recommended for Use)

- **`Initialize_Dashboard_Sample_Data_Final.sql`** - Verified dashboard initialization
- **`Add_Attendance_Records.sql`** - Attendance data supplement  
- **`Working_Dashboard_Analytics.sql`** - Tested analytics queries

### 🗑️ Removed Files (Cleaned Up)

The following files were removed due to schema mismatches or being outdated:

- ~~`Initialize_Dashboard_Sample_Data.sql`~~ - Original version with schema errors
- ~~`Initialize_Dashboard_Sample_Data_Corrected.sql`~~ - Partial correction attempt
- ~~`Dashboard_Sample_Data.sql`~~ - Incorrect dashboard structure
- ~~`Events_Attendance_Sample_Data.sql`~~ - Schema mismatch issues
- ~~`Analytics_Dashboard_Queries.sql`~~ - Column name errors

### 📋 Usage Guidelines

**For Dashboard Development:**
1. Use `Initialize_Dashboard_Sample_Data_Final.sql` first
2. Supplement with `Add_Attendance_Records.sql` 
3. Test with `Working_Dashboard_Analytics.sql`

**For Legacy/Full Data:**
- Use `Master_Argentine_Data.sql` for complete Argentine dataset
- Individual files (Coaches.sql, Students.sql, etc.) for selective loading

All active files have been verified against the current database schema and are ready for use.
