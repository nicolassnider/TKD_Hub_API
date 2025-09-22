-- Add missing columns to TrainingClasses table
-- This script adds the Capacity and Description columns that are expected by the Entity Framework model

USE [TKDHubDb]
GO

-- Add Description column if it doesn't exist
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'TrainingClasses' 
    AND COLUMN_NAME = 'Description'
)
BEGIN
    ALTER TABLE [dbo].[TrainingClasses]
    ADD [Description] nvarchar(500) NULL
    PRINT 'Added Description column to TrainingClasses table'
END
ELSE
BEGIN
    PRINT 'Description column already exists in TrainingClasses table'
END

-- Add Capacity column if it doesn't exist
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'TrainingClasses' 
    AND COLUMN_NAME = 'Capacity'
)
BEGIN
    ALTER TABLE [dbo].[TrainingClasses]
    ADD [Capacity] int NULL
    PRINT 'Added Capacity column to TrainingClasses table'
END
ELSE
BEGIN
    PRINT 'Capacity column already exists in TrainingClasses table'
END

-- Update existing records with default values if needed
UPDATE [dbo].[TrainingClasses]
SET [Description] = CASE 
    WHEN [Name] LIKE '%Kids%' OR [Name] LIKE '%Infantiles%' THEN 'Training class for children'
    WHEN [Name] LIKE '%Adult%' OR [Name] LIKE '%Adultos%' THEN 'Training class for adults'
    WHEN [Name] LIKE '%Teen%' OR [Name] LIKE '%Juveniles%' THEN 'Training class for teenagers'
    ELSE 'General training class'
END
WHERE [Description] IS NULL

UPDATE [dbo].[TrainingClasses]
SET [Capacity] = 20  -- Default capacity
WHERE [Capacity] IS NULL

PRINT 'TrainingClasses table columns updated successfully'
