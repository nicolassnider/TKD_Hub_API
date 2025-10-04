-- Analytics Queries for TKD Hub Dashboard
-- This file contains useful queries for extracting dashboard metrics and analytics

USE [TKDHubDb]
GO

-- ===============================================
-- STUDENT ANALYTICS QUERIES
-- ===============================================

-- Total Active Students
SELECT COUNT(*) as TotalActiveStudents
FROM Users 
WHERE IsActive = 1;

-- Students by Belt Distribution
SELECT 
    r.Name as BeltName,
    r.Color as BeltColor,
    COUNT(u.Id) as StudentCount,
    CAST(COUNT(u.Id) * 100.0 / (SELECT COUNT(*) FROM Users WHERE IsActive = 1) as DECIMAL(5,2)) as Percentage
FROM Ranks r
LEFT JOIN Users u ON r.Id = u.CurrentRankId AND u.IsActive = 1
GROUP BY r.Id, r.Name, r.Color, r.Level
ORDER BY r.Level;

-- Student Enrollment Trends (Last 12 months)
SELECT 
    FORMAT(JoinDate, 'yyyy-MM') as MonthYear,
    COUNT(*) as NewEnrollments
FROM Users 
WHERE JoinDate >= DATEADD(MONTH, -12, GETDATE())
GROUP BY FORMAT(JoinDate, 'yyyy-MM')
ORDER BY MonthYear;

-- Students by Age Group
SELECT 
    CASE 
        WHEN DATEDIFF(YEAR, DateOfBirth, GETDATE()) BETWEEN 4 AND 7 THEN '4-7 (Little Tigers)'
        WHEN DATEDIFF(YEAR, DateOfBirth, GETDATE()) BETWEEN 8 AND 12 THEN '8-12 (Youth)'
        WHEN DATEDIFF(YEAR, DateOfBirth, GETDATE()) BETWEEN 13 AND 17 THEN '13-17 (Teens)'
        WHEN DATEDIFF(YEAR, DateOfBirth, GETDATE()) BETWEEN 18 AND 35 THEN '18-35 (Young Adults)'
        WHEN DATEDIFF(YEAR, DateOfBirth, GETDATE()) BETWEEN 36 AND 50 THEN '36-50 (Adults)'
        ELSE '50+ (Seniors)'
    END as AgeGroup,
    COUNT(*) as StudentCount
FROM Users 
WHERE IsActive = 1 AND DateOfBirth IS NOT NULL
GROUP BY 
    CASE 
        WHEN DATEDIFF(YEAR, DateOfBirth, GETDATE()) BETWEEN 4 AND 7 THEN '4-7 (Little Tigers)'
        WHEN DATEDIFF(YEAR, DateOfBirth, GETDATE()) BETWEEN 8 AND 12 THEN '8-12 (Youth)'
        WHEN DATEDIFF(YEAR, DateOfBirth, GETDATE()) BETWEEN 13 AND 17 THEN '13-17 (Teens)'
        WHEN DATEDIFF(YEAR, DateOfBirth, GETDATE()) BETWEEN 18 AND 35 THEN '18-35 (Young Adults)'
        WHEN DATEDIFF(YEAR, DateOfBirth, GETDATE()) BETWEEN 36 AND 50 THEN '36-50 (Adults)'
        ELSE '50+ (Seniors)'
    END
ORDER BY MIN(DATEDIFF(YEAR, DateOfBirth, GETDATE()));

-- ===============================================
-- ATTENDANCE ANALYTICS QUERIES
-- ===============================================

-- Monthly Attendance Rate
SELECT 
    FORMAT(sca.AttendanceDate, 'yyyy-MM') as MonthYear,
    COUNT(*) as TotalClasses,
    SUM(CASE WHEN sca.Status = 'PRESENT' THEN 1 ELSE 0 END) as PresentCount,
    SUM(CASE WHEN sca.Status = 'LATE' THEN 1 ELSE 0 END) as LateCount,
    SUM(CASE WHEN sca.Status = 'ABSENT' THEN 1 ELSE 0 END) as AbsentCount,
    CAST(SUM(CASE WHEN sca.Status IN ('PRESENT', 'LATE') THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as DECIMAL(5,2)) as AttendanceRate
FROM StudentClassAttendances sca
WHERE sca.AttendanceDate >= DATEADD(MONTH, -6, GETDATE())
GROUP BY FORMAT(sca.AttendanceDate, 'yyyy-MM')
ORDER BY MonthYear;

-- Best Attending Students (Last 3 months)
SELECT TOP 10
    u.FirstName + ' ' + u.LastName as StudentName,
    r.Name as CurrentBelt,
    COUNT(*) as TotalClasses,
    SUM(CASE WHEN sca.Status IN ('PRESENT', 'LATE') THEN 1 ELSE 0 END) as AttendedClasses,
    CAST(SUM(CASE WHEN sca.Status IN ('PRESENT', 'LATE') THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as DECIMAL(5,2)) as AttendanceRate
FROM StudentClassAttendances sca
INNER JOIN StudentClasses sc ON sca.StudentClassId = sc.Id
INNER JOIN Users u ON sc.StudentId = u.Id
INNER JOIN Ranks r ON u.CurrentRankId = r.Id
WHERE sca.AttendanceDate >= DATEADD(MONTH, -3, GETDATE())
GROUP BY u.Id, u.FirstName, u.LastName, r.Name
HAVING COUNT(*) >= 10  -- Minimum 10 classes to be considered
ORDER BY AttendanceRate DESC;

-- ===============================================
-- CLASS ANALYTICS QUERIES
-- ===============================================

-- Most Popular Classes
SELECT 
    tc.Name as ClassName,
    tc.Schedule,
    COUNT(DISTINCT sc.StudentId) as EnrolledStudents,
    tc.MaxStudents,
    CAST(COUNT(DISTINCT sc.StudentId) * 100.0 / tc.MaxStudents as DECIMAL(5,2)) as CapacityUtilization
FROM TrainingClasses tc
LEFT JOIN StudentClasses sc ON tc.Id = sc.TrainingClassId
WHERE tc.IsActive = 1
GROUP BY tc.Id, tc.Name, tc.Schedule, tc.MaxStudents
ORDER BY EnrolledStudents DESC;

-- Class Attendance by Time of Day
SELECT 
    CASE 
        WHEN CAST(tc.StartTime as TIME) < '12:00:00' THEN 'Morning (Before 12 PM)'
        WHEN CAST(tc.StartTime as TIME) < '17:00:00' THEN 'Afternoon (12 PM - 5 PM)'
        ELSE 'Evening (After 5 PM)'
    END as TimeSlot,
    COUNT(DISTINCT sca.Id) as TotalAttendances,
    AVG(CAST(CASE WHEN sca.Status IN ('PRESENT', 'LATE') THEN 1.0 ELSE 0.0 END as FLOAT)) * 100 as AvgAttendanceRate
FROM StudentClassAttendances sca
INNER JOIN StudentClasses sc ON sca.StudentClassId = sc.Id
INNER JOIN TrainingClasses tc ON sc.TrainingClassId = tc.Id
WHERE sca.AttendanceDate >= DATEADD(MONTH, -3, GETDATE())
GROUP BY 
    CASE 
        WHEN CAST(tc.StartTime as TIME) < '12:00:00' THEN 'Morning (Before 12 PM)'
        WHEN CAST(tc.StartTime as TIME) < '17:00:00' THEN 'Afternoon (12 PM - 5 PM)'
        ELSE 'Evening (After 5 PM)'
    END
ORDER BY AvgAttendanceRate DESC;

-- ===============================================
-- FINANCIAL ANALYTICS QUERIES
-- ===============================================

-- Monthly Revenue
SELECT 
    FORMAT(PaymentDate, 'yyyy-MM') as MonthYear,
    COUNT(*) as PaymentCount,
    SUM(Amount) as TotalRevenue,
    AVG(Amount) as AveragePayment
FROM Payments 
WHERE Status = 'COMPLETED' 
    AND PaymentDate >= DATEADD(MONTH, -12, GETDATE())
GROUP BY FORMAT(PaymentDate, 'yyyy-MM')
ORDER BY MonthYear;

-- Revenue by Payment Method
SELECT 
    PaymentMethod,
    COUNT(*) as TransactionCount,
    SUM(Amount) as TotalAmount,
    CAST(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM Payments WHERE Status = 'COMPLETED' AND PaymentDate >= DATEADD(MONTH, -6, GETDATE())) as DECIMAL(5,2)) as PercentageOfTransactions
FROM Payments 
WHERE Status = 'COMPLETED' 
    AND PaymentDate >= DATEADD(MONTH, -6, GETDATE())
GROUP BY PaymentMethod
ORDER BY TotalAmount DESC;

-- Outstanding Payments (Students who haven't paid this month)
SELECT 
    u.FirstName + ' ' + u.LastName as StudentName,
    u.Email,
    u.PhoneNumber,
    d.Name as DojaangName,
    COALESCE(lastPayment.LastPaymentDate, u.JoinDate) as LastPaymentDate,
    DATEDIFF(DAY, COALESCE(lastPayment.LastPaymentDate, u.JoinDate), GETDATE()) as DaysSinceLastPayment
FROM Users u
INNER JOIN Dojaangs d ON u.DojaangId = d.Id
LEFT JOIN (
    SELECT 
        UserId, 
        MAX(PaymentDate) as LastPaymentDate
    FROM Payments 
    WHERE Status = 'COMPLETED'
    GROUP BY UserId
) lastPayment ON u.Id = lastPayment.UserId
WHERE u.IsActive = 1
    AND (lastPayment.LastPaymentDate IS NULL OR lastPayment.LastPaymentDate < DATEADD(DAY, -30, GETDATE()))
ORDER BY DaysSinceLastPayment DESC;

-- ===============================================
-- PROMOTION ANALYTICS QUERIES
-- ===============================================

-- Recent Promotions (Last 6 months)
SELECT 
    u.FirstName + ' ' + u.LastName as StudentName,
    fromRank.Name as FromBelt,
    toRank.Name as ToBelt,
    p.PromotionDate,
    p.TestScore,
    p.ExaminerName
FROM Promotions p
INNER JOIN Users u ON p.StudentId = u.Id
INNER JOIN Ranks fromRank ON p.FromRankId = fromRank.Id
INNER JOIN Ranks toRank ON p.ToRankId = toRank.Id
WHERE p.PromotionDate >= DATEADD(MONTH, -6, GETDATE())
ORDER BY p.PromotionDate DESC;

-- Promotion Success Rate by Belt Level
SELECT 
    fromRank.Name as FromBelt,
    COUNT(*) as TotalPromotions,
    AVG(CAST(p.TestScore as FLOAT)) as AverageTestScore,
    COUNT(CASE WHEN p.TestScore >= 80 THEN 1 END) as PassCount,
    CAST(COUNT(CASE WHEN p.TestScore >= 80 THEN 1 END) * 100.0 / COUNT(*) as DECIMAL(5,2)) as PassRate
FROM Promotions p
INNER JOIN Ranks fromRank ON p.FromRankId = fromRank.Id
WHERE p.PromotionDate >= DATEADD(YEAR, -1, GETDATE())
GROUP BY fromRank.Id, fromRank.Name, fromRank.Level
ORDER BY fromRank.Level;

-- Students Ready for Next Promotion (Based on time at current rank)
SELECT 
    u.FirstName + ' ' + u.LastName as StudentName,
    r.Name as CurrentBelt,
    u.Email,
    COALESCE(lastPromotion.PromotionDate, u.JoinDate) as DateAtCurrentBelt,
    DATEDIFF(MONTH, COALESCE(lastPromotion.PromotionDate, u.JoinDate), GETDATE()) as MonthsAtCurrentBelt,
    -- Attendance rate in last 3 months
    COALESCE(attendance.AttendanceRate, 0) as RecentAttendanceRate
FROM Users u
INNER JOIN Ranks r ON u.CurrentRankId = r.Id
LEFT JOIN (
    SELECT 
        StudentId, 
        MAX(PromotionDate) as PromotionDate
    FROM Promotions 
    GROUP BY StudentId
) lastPromotion ON u.Id = lastPromotion.StudentId
LEFT JOIN (
    SELECT 
        sc.StudentId,
        CAST(SUM(CASE WHEN sca.Status IN ('PRESENT', 'LATE') THEN 1.0 ELSE 0.0 END) / COUNT(*) * 100 as DECIMAL(5,2)) as AttendanceRate
    FROM StudentClasses sc
    INNER JOIN StudentClassAttendances sca ON sc.Id = sca.StudentClassId
    WHERE sca.AttendanceDate >= DATEADD(MONTH, -3, GETDATE())
    GROUP BY sc.StudentId
) attendance ON u.Id = attendance.StudentId
WHERE u.IsActive = 1
    AND r.Level < 10  -- Not already at highest black belt level
    AND DATEDIFF(MONTH, COALESCE(lastPromotion.PromotionDate, u.JoinDate), GETDATE()) >= 
        CASE 
            WHEN r.Level <= 4 THEN 3   -- Colored belts: 3 months minimum
            WHEN r.Level <= 8 THEN 6   -- High colored belts: 6 months
            ELSE 12                    -- Black belts: 12 months
        END
    AND COALESCE(attendance.AttendanceRate, 0) >= 70  -- Good attendance required
ORDER BY MonthsAtCurrentBelt DESC;

-- ===============================================
-- DOJAANG ANALYTICS QUERIES
-- ===============================================

-- Performance by Dojaang
SELECT 
    d.Name as DojaangName,
    d.Location,
    COUNT(DISTINCT u.Id) as TotalStudents,
    COUNT(DISTINCT CASE WHEN u.IsActive = 1 THEN u.Id END) as ActiveStudents,
    COALESCE(revenue.MonthlyRevenue, 0) as MonthlyRevenue,
    COALESCE(attendance.AvgAttendanceRate, 0) as AvgAttendanceRate
FROM Dojaangs d
LEFT JOIN Users u ON d.Id = u.DojaangId
LEFT JOIN (
    SELECT 
        u.DojaangId,
        SUM(p.Amount) as MonthlyRevenue
    FROM Payments p
    INNER JOIN Users u ON p.UserId = u.Id
    WHERE p.Status = 'COMPLETED' 
        AND p.PaymentDate >= DATEADD(MONTH, -1, GETDATE())
    GROUP BY u.DojaangId
) revenue ON d.Id = revenue.DojaangId
LEFT JOIN (
    SELECT 
        u.DojaangId,
        CAST(AVG(CASE WHEN sca.Status IN ('PRESENT', 'LATE') THEN 1.0 ELSE 0.0 END) * 100 as DECIMAL(5,2)) as AvgAttendanceRate
    FROM StudentClassAttendances sca
    INNER JOIN StudentClasses sc ON sca.StudentClassId = sc.Id
    INNER JOIN Users u ON sc.StudentId = u.Id
    WHERE sca.AttendanceDate >= DATEADD(MONTH, -1, GETDATE())
    GROUP BY u.DojaangId
) attendance ON d.Id = attendance.DojaangId
GROUP BY d.Id, d.Name, d.Location, revenue.MonthlyRevenue, attendance.AvgAttendanceRate
ORDER BY ActiveStudents DESC;

-- ===============================================
-- QUICK DASHBOARD METRICS
-- ===============================================

-- Key Performance Indicators (KPIs)
SELECT 
    'Total Active Students' as Metric,
    CAST(COUNT(*) as VARCHAR(50)) as Value
FROM Users WHERE IsActive = 1

UNION ALL

SELECT 
    'Active Classes' as Metric,
    CAST(COUNT(*) as VARCHAR(50)) as Value
FROM TrainingClasses WHERE IsActive = 1

UNION ALL

SELECT 
    'Monthly Revenue (Current Month)' as Metric,
    '$' + CAST(COALESCE(SUM(Amount), 0) as VARCHAR(50)) as Value
FROM Payments 
WHERE Status = 'COMPLETED' 
    AND YEAR(PaymentDate) = YEAR(GETDATE()) 
    AND MONTH(PaymentDate) = MONTH(GETDATE())

UNION ALL

SELECT 
    'Average Attendance Rate (Last Month)' as Metric,
    CAST(COALESCE(AVG(CASE WHEN Status IN ('PRESENT', 'LATE') THEN 100.0 ELSE 0.0 END), 0) as VARCHAR(50)) + '%' as Value
FROM StudentClassAttendances 
WHERE AttendanceDate >= DATEADD(MONTH, -1, GETDATE())

UNION ALL

SELECT 
    'Recent Promotions (Last Month)' as Metric,
    CAST(COUNT(*) as VARCHAR(50)) as Value
FROM Promotions 
WHERE PromotionDate >= DATEADD(MONTH, -1, GETDATE())

UNION ALL

SELECT 
    'Upcoming Events (Next 30 Days)' as Metric,
    CAST(COUNT(*) as VARCHAR(50)) as Value
FROM Events 
WHERE EventDate BETWEEN GETDATE() AND DATEADD(DAY, 30, GETDATE())
    AND IsActive = 1;

GO

PRINT 'Analytics queries file created successfully!';
PRINT 'This file contains comprehensive queries for:';
PRINT '- Student analytics (enrollment trends, age groups, belt distribution)';
PRINT '- Attendance analytics (rates, trends, top performers)';
PRINT '- Class analytics (popularity, time slot performance)';
PRINT '- Financial analytics (revenue trends, payment methods, outstanding payments)';
PRINT '- Promotion analytics (success rates, candidates for promotion)';
PRINT '- Dojaang performance comparisons';
PRINT '- Quick KPI dashboard metrics';
PRINT '';
PRINT 'Use these queries to populate dashboard widgets and generate reports!';