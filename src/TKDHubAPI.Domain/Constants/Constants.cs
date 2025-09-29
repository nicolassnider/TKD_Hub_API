namespace TKDHubAPI.Domain.Constants;

/// <summary>
/// Central place for small, widely used string constants.
/// Keep limited and pragmatic — not every literal needs extraction.
/// </summary>
public static class RoleNames
{
    public const string Admin = "Admin";
    public const string Coach = "Coach";
    public const string Student = "Student";
}

public static class HeaderNames
{
    public const string Authorization = "Authorization";
    public const string ContentType = "Content-Type";
}

public static class CacheKeys
{
    // Format: "manageDojaangs:{coachId}"
    public const string ManageDojaangsPrefix = "manageDojaangs:";
}

public static class ErrorMessages
{
    public const string DojaangNotFound = "Dojaang not found.";
    public const string CoachNotFound = "Coach not found.";
}

public static class PropertyNames
{
    public const string IsActive = "IsActive"; // legacy uses - prefer nameof(User.IsActive) where possible
}
