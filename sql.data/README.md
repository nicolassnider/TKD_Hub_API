# Argentine Sample Data for TKD Hub

This directory contains comprehensive sample data for the TKD Hub application featuring authentic Argentine names, locations, and cultural elements.

## 📁 Files Overview

### Individual Data Files

- **`Argentine_Coaches.sql`** - 16 coaches with Argentine names and realistic ranking progression
- **`Argentine_Students.sql`** - 30 students of various ages (8-25) with family relationships
- **`Argentine_Dojangs.sql`** - 12 dojangs across Argentina with Korean names and locations
- **`Argentine_Classes.sql`** - Training classes with schedules and student assignments

### Master Execution Script

- **`Master_Argentine_Data.sql`** - Complete script that executes all data insertion in proper order

## 🏆 Data Features

### Coaches (16 total)

- **Master Instructors**: 4th-6th Dan ranks (Carlos Fernández, María Rodríguez, Jorge Morales, Silvia Delgado)
- **Senior Instructors**: 2nd-3rd Dan ranks with 2-5 years experience
- **Junior Instructors**: 1st Dan ranks, newer to teaching
- **Regional Coverage**: Coaches from Buenos Aires, Córdoba, Mendoza, Rosario, and Tucumán

### Students (30 total)

- **Children & Teens** (8-17 years): White to Blue belt progression
- **Young Adults** (18-25 years): Blue to Black stripe ranks
- **Family Groups**: Siblings and parent-child relationships included
- **Regional Distribution**: Students from major Argentine cities

### Dojangs (12 total)

- **Buenos Aires Capital**: 5 dojangs in different neighborhoods (Balvanera, Recoleta, Flores, Once, Palermo)
- **Buenos Aires Province**: La Plata, Tigre, Quilmes
- **Interior Provinces**: Córdoba, Mendoza, Rosario, Tucumán
- **Authentic Features**: Korean names with phonetic translations, realistic addresses

### Training Classes (48 total)

- **Infantiles (6-9 años)**: Monday/Wednesday 16:00-17:00 for children
- **Juveniles (10-14 años)**: Tuesday/Thursday 17:00-18:30 for pre-teens
- **Adultos Principiantes**: Tuesday/Thursday 19:00-20:30 for beginner adults
- **Adultos Avanzados**: Wednesday/Saturday for advanced practitioners
- **Age-Based Assignment**: Students automatically assigned to appropriate classes
- **Realistic Schedules**: Multiple time slots to avoid conflicts

## 🇦🇷 Argentine Cultural Elements

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
