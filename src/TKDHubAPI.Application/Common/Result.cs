namespace TKDHubAPI.Application.Common;

/// <summary>
/// A small functional Result type representing success with a value or failure with an error message.
/// Use this for simple functional-style returns without throwing exceptions for control flow.
/// </summary>
public record Result<T>
{
    public bool IsSuccess { get; init; }
    public T? Value { get; init; }
    public string? Error { get; init; }

    public static Result<T> Success(T value) => new Result<T> { IsSuccess = true, Value = value };
    public static Result<T> Failure(string error) => new Result<T> { IsSuccess = false, Error = error };
}
