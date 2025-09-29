namespace TKDHubAPI.Application.Constants;

/// <summary>
/// Centralized validation messages for FluentValidation rules used in the application.
/// </summary>
public static class ValidationMessages
{
    public const string TitleRequired = "Title is required.";
    public const string TitleMaxLength = "Title cannot exceed 200 characters.";

    public const string ContentRequired = "Content is required.";
    public const string ContentTooLong = "Content is too long.";
}
