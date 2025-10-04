using System.Text.Json;
using AutoMapper;
using Microsoft.Extensions.Logging;
using TKDHubAPI.Application.DTOs.Dashboard;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Domain.Entities;
using TKDHubAPI.Domain.Repositories;

namespace TKDHubAPI.Infrastructure.Services;

public class DashboardService : IDashboardService
{
    private readonly IDashboardRepository _dashboardRepository;
    private readonly IUserRepository _userRepository;
    private readonly ITrainingClassRepository _classRepository;
    private readonly IStudentClassRepository _studentRepository;
    private readonly IDojaangRepository _dojaangRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<DashboardService> _logger;

    public DashboardService(
        IDashboardRepository dashboardRepository,
        IUserRepository userRepository,
        ITrainingClassRepository classRepository,
        IStudentClassRepository studentClassRepository,
        IDojaangRepository dojaangRepository,
        IMapper mapper,
        ILogger<DashboardService> logger
    )
    {
        _dashboardRepository = dashboardRepository;
        _userRepository = userRepository;
        _classRepository = classRepository;
        _studentRepository = studentClassRepository;
        _dojaangRepository = dojaangRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<DashboardResponseDto> GetDashboardAsync(
        int userId,
        string? requestedUserRole = null
    )
    {
        _logger.LogInformation(
            "Getting dashboard for user {UserId} with requested role {RequestedRole}",
            userId,
            requestedUserRole
        );

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new ArgumentException($"User with ID {userId} not found");
        }

        // Use requested role if provided, otherwise get user's primary role
        var userRole = requestedUserRole ?? GetUserPrimaryRole(user);

        // Get user's default layout or create one
        var layouts = await GetUserLayoutsAsync(userId);
        var defaultLayout =
            layouts.FirstOrDefault(l => l.IsDefault && l.UserRole == userRole)
            ?? await GetDefaultLayoutAsync(userRole)
            ?? await CreateDefaultLayoutForRole(userRole, userId);

        // Load widget data
        foreach (var widget in defaultLayout.Widgets)
        {
            try
            {
                widget.Data = await GetWidgetDataAsync(widget.Type, widget.Id);
                widget.Loading = false;
                widget.Error = null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading data for widget {WidgetId}", widget.Id);
                widget.Loading = false;
                widget.Error = ex.Message;
            }
        }

        var metadata = await GetDashboardMetadataAsync();

        return new DashboardResponseDto
        {
            Layout = defaultLayout,
            Widgets = defaultLayout.Widgets,
            Metadata = metadata
        };
    }

    public async Task<List<DashboardLayoutDto>> GetUserLayoutsAsync(int userId)
    {
        _logger.LogInformation("Getting layouts for user {UserId}", userId);
        var layouts = await _dashboardRepository.GetUserLayoutsAsync(userId);
        return _mapper.Map<List<DashboardLayoutDto>>(layouts);
    }

    public async Task<DashboardLayoutDto?> GetDefaultLayoutAsync(string userRole)
    {
        _logger.LogInformation("Getting default layout for role {UserRole}", userRole);
        var layout = await _dashboardRepository.GetDefaultLayoutAsync(userRole);
        return layout != null ? _mapper.Map<DashboardLayoutDto>(layout) : null;
    }

    public async Task<object?> GetWidgetDataAsync(string widgetType, string widgetId)
    {
        _logger.LogInformation(
            "Getting data for widget {WidgetId} of type {WidgetType}",
            widgetId,
            widgetType
        );

        try
        {
            // Get all default layouts to find the widget and read its configuration
            Widget? widget = null;
            var adminLayout = await _dashboardRepository.GetDefaultLayoutAsync("Admin");
            var coachLayout = await _dashboardRepository.GetDefaultLayoutAsync("Coach");
            var studentLayout = await _dashboardRepository.GetDefaultLayoutAsync("Student");

            var allLayouts = new[] { adminLayout, coachLayout, studentLayout }
                .Where(l => l != null)
                .ToList();

            foreach (var layout in allLayouts)
            {
                widget = layout!.Widgets?.FirstOrDefault(w => w.Id == widgetId);
                if (widget != null)
                    break;
            }

            if (widget == null)
            {
                _logger.LogWarning("Widget {WidgetId} not found in any layout", widgetId);
                return await GetDefaultWidgetData(widgetType, "unknown");
            }

            // Parse configuration to get the metric name
            var config = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(
                widget.ConfigJson ?? "{}"
            );
            var metric = config?.GetValueOrDefault("metric").GetString() ?? widgetType;

            _logger.LogInformation(
                "Loading data for metric {Metric} from widget {WidgetId}",
                metric,
                widgetId
            );

            return metric.ToLower() switch
            {
                "totalstudents" => await GetTotalStudentsData(),
                "activeclasses" => await GetActiveClassesData(),
                "monthlyrevenue" => await GetMonthlyRevenueData(),
                "attendancerate" => await GetAttendanceRateData(),
                "mystudents" => await GetMyStudentsData(),
                "todayclasses" => await GetTodayClassesData(),
                "weeklyattendance" => await GetWeeklyAttendanceData(),
                "currentrank" => await GetCurrentRankData(),
                "myattendancerate" => await GetMyAttendanceRateData(),
                "recentclasses" => await GetRecentClassesData(),
                "studentprogress" => await GetStudentProgressData(),
                "upcomingclasses" => await GetUpcomingClassesData(),
                "classstatistics" => await GetClassStatisticsData(),
                "classattendance" => await GetClassAttendanceData(),
                _ => await GetDefaultWidgetData(widgetType, metric)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting widget data for {WidgetId}", widgetId);
            return await GetDefaultWidgetData(widgetType, "error");
        }
    }

    public async Task<DashboardLayoutDto> CreateLayoutAsync(DashboardLayoutDto layout)
    {
        _logger.LogInformation("Creating layout {LayoutName}", layout.Name);
        var entity = _mapper.Map<DashboardLayout>(layout);
        entity.Id = Guid.NewGuid().ToString();
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;

        var created = await _dashboardRepository.CreateLayoutAsync(entity);
        return _mapper.Map<DashboardLayoutDto>(created);
    }

    public async Task<DashboardLayoutDto> UpdateLayoutAsync(string id, DashboardLayoutDto layout)
    {
        _logger.LogInformation("Updating layout {LayoutId}", id);
        var entity = _mapper.Map<DashboardLayout>(layout);
        entity.Id = id;
        entity.UpdatedAt = DateTime.UtcNow;

        var updated = await _dashboardRepository.UpdateLayoutAsync(entity);
        return _mapper.Map<DashboardLayoutDto>(updated);
    }

    public async Task<bool> DeleteLayoutAsync(string id)
    {
        _logger.LogInformation("Deleting layout {LayoutId}", id);
        return await _dashboardRepository.DeleteLayoutAsync(id);
    }

    public async Task<WidgetDto> CreateWidgetAsync(WidgetDto widget)
    {
        _logger.LogInformation("Creating widget {WidgetTitle}", widget.Title);
        var entity = _mapper.Map<Widget>(widget);
        entity.Id = Guid.NewGuid().ToString();
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;

        var created = await _dashboardRepository.CreateWidgetAsync(entity);
        return _mapper.Map<WidgetDto>(created);
    }

    public async Task<WidgetDto> UpdateWidgetAsync(string id, WidgetDto widget)
    {
        _logger.LogInformation("Updating widget {WidgetId}", id);
        var entity = _mapper.Map<Widget>(widget);
        entity.Id = id;
        entity.UpdatedAt = DateTime.UtcNow;

        var updated = await _dashboardRepository.UpdateWidgetAsync(entity);
        return _mapper.Map<WidgetDto>(updated);
    }

    public async Task<bool> DeleteWidgetAsync(string id)
    {
        _logger.LogInformation("Deleting widget {WidgetId}", id);
        return await _dashboardRepository.DeleteWidgetAsync(id);
    }

    public async Task<bool> UpdateWidgetPositionAsync(
        string id,
        int x,
        int y,
        int width,
        int height
    )
    {
        _logger.LogInformation("Updating position for widget {WidgetId}", id);
        return await _dashboardRepository.UpdateWidgetPositionAsync(id, x, y, width, height);
    }

    private async Task<DashboardLayoutDto> CreateDefaultLayoutForRole(string role, int userId)
    {
        _logger.LogInformation(
            "Creating default layout for role {Role} and user {UserId}",
            role,
            userId
        );

        var widgets = GetDefaultWidgetsForRole(role);
        var layout = new DashboardLayoutDto
        {
            Id = Guid.NewGuid().ToString(),
            Name = $"Default {role} Dashboard",
            Description = $"Default dashboard layout for {role} users",
            UserRole = role,
            IsDefault = true,
            Widgets = widgets
        };

        return await CreateLayoutAsync(layout);
    }

    private List<WidgetDto> GetDefaultWidgetsForRole(string role)
    {
        return role.ToLower() switch
        {
            "admin" => GetAdminDefaultWidgets(),
            "instructor" => GetInstructorDefaultWidgets(),
            "student" => GetStudentDefaultWidgets(),
            _ => GetGuestDefaultWidgets()
        };
    }

    private List<WidgetDto> GetAdminDefaultWidgets()
    {
        return new List<WidgetDto>
        {
            CreateWidget("totalstudents", "Total Students", 0, 0, 3, 2),
            CreateWidget("totalclasses", "Total Classes", 3, 0, 3, 2),
            CreateWidget("totaldojaangs", "Total Dojaangs", 6, 0, 3, 2),
            CreateWidget("recentclasses", "Recent Classes", 0, 2, 6, 4),
            CreateWidget("classstatistics", "Class Statistics", 6, 2, 6, 4)
        };
    }

    private List<WidgetDto> GetInstructorDefaultWidgets()
    {
        return new List<WidgetDto>
        {
            CreateWidget("totalclasses", "My Classes", 0, 0, 4, 2),
            CreateWidget("totalstudents", "My Students", 4, 0, 4, 2),
            CreateWidget("upcomingclasses", "Upcoming Classes", 0, 2, 8, 4)
        };
    }

    private List<WidgetDto> GetStudentDefaultWidgets()
    {
        return new List<WidgetDto>
        {
            CreateWidget("upcomingclasses", "My Classes", 0, 0, 6, 3),
            CreateWidget("studentprogress", "My Progress", 6, 0, 6, 3)
        };
    }

    private List<WidgetDto> GetGuestDefaultWidgets()
    {
        return new List<WidgetDto>
        {
            CreateWidget("totalclasses", "Available Classes", 0, 0, 12, 4)
        };
    }

    private WidgetDto CreateWidget(string type, string title, int x, int y, int width, int height)
    {
        return new WidgetDto
        {
            Id = Guid.NewGuid().ToString(),
            Type = type,
            Title = title,
            Position = new WidgetPositionDto
            {
                X = x,
                Y = y,
                Width = width,
                Height = height
            },
            Config = new Dictionary<string, object>(),
            Loading = true
        };
    }

    private async Task<DashboardMetadataDto> GetDashboardMetadataAsync()
    {
        var totalUsers = await _userRepository.CountAsync();
        var totalClasses = await _classRepository.CountAsync();
        var allUsers = await _userRepository.GetAllAsync();
        var totalStudents = allUsers.Count(); // Would need proper role filtering
        var totalDojaangs = await _dojaangRepository.CountAsync();

        return new DashboardMetadataDto
        {
            LastUpdated = DateTime.UtcNow,
            TotalUsers = totalUsers,
            TotalClasses = totalClasses,
            TotalStudents = totalStudents,
            TotalDojaangs = totalDojaangs
        };
    }

    private async Task<object> GetTotalStudentsData()
    {
        // Count users with student role - assuming role-based student identification
        var students = await _userRepository.GetAllAsync();
        var studentCount = students.Count(); // This would need proper role filtering in a real implementation
        return new { value = studentCount, subtitle = "Active Students" };
    }

    private async Task<object> GetTotalClassesData()
    {
        var count = await _classRepository.CountAsync();
        return new { value = count, subtitle = "Active Classes" };
    }

    private async Task<object> GetTotalDojaangsData()
    {
        var count = await _dojaangRepository.CountAsync();
        return new { value = count, subtitle = "Registered Dojaangs" };
    }

    private async Task<object> GetRecentClassesData()
    {
        var recentClasses = await _classRepository.GetRecentAsync(10);
        return new { items = recentClasses };
    }

    private Task<object> GetStudentProgressData()
    {
        // This would need to be implemented based on your progress tracking system
        return Task.FromResult<object>(
            new
            {
                progress = 75,
                target = 100,
                subtitle = "Overall Progress"
            }
        );
    }

    private async Task<object> GetUpcomingClassesData()
    {
        var upcomingClasses = await _classRepository.GetUpcomingAsync(5);
        return new { items = upcomingClasses };
    }

    private async Task<object> GetClassStatisticsData()
    {
        var stats = await _classRepository.GetStatisticsAsync();
        return stats;
    }

    private string GetUserPrimaryRole(User user)
    {
        // Return the first role if available, or default to "Guest"
        var firstRole = user.UserUserRoles?.FirstOrDefault()?.UserRole?.Name;
        return firstRole ?? "Guest";
    }

    private async Task<object> GetActiveClassesData()
    {
        var count = await _classRepository.CountAsync();
        return new
        {
            value = count,
            subtitle = "Active Classes",
            unit = "classes"
        };
    }

    private Task<object> GetMonthlyRevenueData()
    {
        // TODO: Implement based on your payment system
        return Task.FromResult<object>(
            new
            {
                value = 2450,
                subtitle = "This Month",
                unit = "$",
                previousValue = 2200
            }
        );
    }

    private async Task<object> GetAttendanceRateData()
    {
        // Calculate overall attendance rate
        var totalClasses = await _classRepository.CountAsync();

        // Mock calculation - implement based on your attendance tracking
        var attendanceRate = totalClasses > 0 ? 85.5 : 0;
        return new
        {
            value = attendanceRate,
            subtitle = "Overall Rate",
            unit = "%",
            target = 90
        };
    }

    private async Task<object> GetMyStudentsData()
    {
        // TODO: Filter by coach - for now return total users with student role
        var allUsers = await _userRepository.GetAllAsync();
        var studentCount = allUsers.Count(); // Could filter by student role here
        return new
        {
            value = studentCount,
            subtitle = "My Students",
            unit = "students"
        };
    }

    private Task<object> GetTodayClassesData()
    {
        // TODO: Implement based on class schedule
        return Task.FromResult<object>(
            new
            {
                value = 3,
                subtitle = "Today",
                unit = "classes"
            }
        );
    }

    private Task<object> GetWeeklyAttendanceData()
    {
        // TODO: Implement based on attendance tracking
        return Task.FromResult<object>(
            new
            {
                value = 42,
                subtitle = "This Week",
                unit = "attendances"
            }
        );
    }

    private Task<object> GetCurrentRankData()
    {
        // TODO: Implement based on user's current rank
        return Task.FromResult<object>(
            new
            {
                value = "Red Belt",
                subtitle = "Current Rank",
                progress = 75,
                target = 100
            }
        );
    }

    private Task<object> GetMyAttendanceRateData()
    {
        // TODO: Implement based on user's attendance
        return Task.FromResult<object>(
            new
            {
                value = 92.5,
                subtitle = "My Rate",
                unit = "%",
                target = 95
            }
        );
    }

    private Task<object> GetClassAttendanceData()
    {
        // TODO: Implement chart data for class attendance
        var chartData = new[]
        {
            new { date = "Mon", attendance = 15 },
            new { date = "Tue", attendance = 18 },
            new { date = "Wed", attendance = 12 },
            new { date = "Thu", attendance = 20 },
            new { date = "Fri", attendance = 16 },
            new { date = "Sat", attendance = 22 },
            new { date = "Sun", attendance = 14 }
        };
        return Task.FromResult<object>(new { data = chartData, title = "7-Day Attendance" });
    }

    private Task<object> GetDefaultWidgetData(string widgetType, string metric)
    {
        _logger.LogWarning(
            "No data handler found for widget type {WidgetType} with metric {Metric}",
            widgetType,
            metric
        );
        return Task.FromResult<object>(
            new
            {
                value = 0,
                subtitle = "No Data",
                error = "Data handler not implemented"
            }
        );
    }
}
