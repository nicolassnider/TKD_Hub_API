using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Domain.Entities;
using TKDHubAPI.Domain.Repositories;

namespace TKDHubAPI.Application.Services;
public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UserService(IUserRepository userRepository, IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _userRepository.GetAllAsync();
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _userRepository.GetByIdAsync(id);
    }

    public async Task<User> GetUserByEmailAsync(string email)
    {
        //  Consider adding error handling if no user is found.
        var user = await _userRepository.GetUserByPhoneNumberAsync(email);
        if (user == null)
        {
            throw new Exception($"User with email {email} not found"); //Or return null, or a custom exception
        }
        return user;

    }

    public async Task<User> GetUserByPhoneNumberAsync(string phoneNumber)
    {
        //  Consider adding error handling.
        var user = await _userRepository.GetUserByPhoneNumberAsync(phoneNumber);
        if (user == null)
        {
            throw new Exception($"User with phone number {phoneNumber} not found"); //Or return null, or a custom exception
        }
        return user;
    }

    public async Task<IEnumerable<User>> GetUsersByRoleAsync(UserRole role)
    {
        return await _userRepository.GetUsersByRoleAsync(role);
    }

    public async Task AddAsync(User user)
    {
        await _userRepository.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task UpdateAsync(User user)
    {
        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user != null)
        {
            _userRepository.Remove(user);
            await _unitOfWork.SaveChangesAsync();
        }
        //  Consider adding error handling if the user to delete is not found.
    }

    public Task<IEnumerable<User>> GetUsersByGenderAsync(Gender gender)
    {
        throw new NotImplementedException();
    }
}