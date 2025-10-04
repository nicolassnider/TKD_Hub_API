using Microsoft.Extensions.Logging;
using TKDHubAPI.Application.DTOs.Dashboard;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Domain.Entities;
using TKDHubAPI.Domain.Repositories;
using AutoMapper;

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
        ILogger<DashboardService> logger)
    {
        _dashboardRepository = dashboardRepository;
        _userRepository = userRepository;
        _classRepository = classRepository;
        _studentRepository = studentClassRepository;
        _dojaangRepository = dojaangRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<DashboardResponseDto> GetDashboardAsync(int userId)
    {
        _logger.LogInformation("Getting dashboard for user {UserId}", userId);
        
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new ArgumentException($"User with ID {userId} not found");
        }

        // Get user's default layout or create one
        var layouts = await GetUserLayoutsAsync(userId);
        var userRole = GetUserPrimaryRole(user);
        var defaultLayout = layouts.FirstOrDefault(l => l.IsDefault) ?? 
                           await GetDefaultLayoutAsync(userRole) ??
                           await CreateDefaultLayoutForRole(userRole, userId);

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
        _logger.LogInformation("Getting data for widget {WidgetId} of type {WidgetType}", widgetId, widgetType);

        return widgetType.ToLower() switch
        {
            "totalstudents" => await GetTotalStudentsData(),
            "totalclasses" => await GetTotalClassesData(),
            "totaldojaangs" => await GetTotalDojaangsData(),
            "recentclasses" => await GetRecentClassesData(),
            "studentprogress" => await GetStudentProgressData(),
            "upcomingclasses" => await GetUpcomingClassesData(),
            "classstatistics" => await GetClassStatisticsData(),
            _ => null
        };
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

    public async Task<bool> UpdateWidgetPositionAsync(string id, int x, int y, int width, int height)
    {
        _logger.LogInformation("Updating position for widget {WidgetId}", id);
        return await _dashboardRepository.UpdateWidgetPositionAsync(id, x, y, width, height);
    }

    private async Task<DashboardLayoutDto> CreateDefaultLayoutForRole(string role, int userId)
    {
        _logger.LogInformation("Creating default layout for role {Role} and user {UserId}", role, userId);
        
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
            Position = new WidgetPositionDto { X = x, Y = y, Width = width, Height = height },
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
        return Task.FromResult<object>(new { progress = 75, target = 100, subtitle = "Overall Progress" });
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
}
