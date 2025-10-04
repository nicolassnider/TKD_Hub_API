-- Quick Attendance Records Addition
-- This script adds sample attendance records in a simpler way

USE [TKDHubDb]
GO

PRINT 'Adding sample attendance records...';

-- Check if we have student class enrollments
IF EXISTS (SELECT 1 FROM StudentClasses)
BEGIN
    -- Create attendance records for random dates in the last 2 weeks
    INSERT INTO [StudentClassAttendances] ([StudentClassId], [AttendedAt], [Status], [Notes], [CreatedAt], [UpdatedAt])
    SELECT 
        sc.Id,
        DATEADD(DAY, -ABS(CHECKSUM(NEWID()) % 14), GETDATE()), -- Random day in last 2 weeks
        CASE ABS(CHECKSUM(NEWID()) % 3)
            WHEN 0 THEN 1  -- Present
            WHEN 1 THEN 0  -- Absent
            ELSE 2         -- Late
        END,
        CASE ABS(CHECKSUM(NEWID()) % 4)
            WHEN 0 THEN 'Great progress!'
            WHEN 1 THEN 'Good effort'
            WHEN 2 THEN 'Keep practicing'
            ELSE NULL
        END,
        GETDATE(),
        GETDATE()
    FROM StudentClasses sc
    CROSS JOIN (VALUES (1), (2), (3), (4), (5)) AS Numbers(n)  -- Create 5 records per student class
    WHERE NOT EXISTS (
        SELECT 1 FROM StudentClassAttendances sca 
        WHERE sca.StudentClassId = sc.Id
    );

    DECLARE @NewAttendanceCount INT = @@ROWCOUNT;
    PRINT '✓ Added ' + CAST(@NewAttendanceCount as VARCHAR(10)) + ' attendance records';
END
ELSE
BEGIN
    PRINT '! No student class enrollments found';
END

-- Summary
DECLARE @TotalAttendance INT = (SELECT COUNT(*) FROM StudentClassAttendances);
PRINT '• Total Attendance Records: ' + CAST(@TotalAttendance as VARCHAR(10));

GO
