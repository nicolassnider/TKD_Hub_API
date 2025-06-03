using TKDHubAPI.Application.DTOs.User;

namespace TKDHubAPI.Application.Interfaces;

public interface IStudentService
{
    Task<UserDto> CreateStudentAsync(CreateStudentDto createStudentDto);
    Task<UserDto?> GetStudentByIdAsync(int id);
    Task<IEnumerable<UserDto>> GetStudentsByDojaangIdAsync(int dojaangId);
    Task<IEnumerable<UserDto>> GetAllStudentsAsync();
}
