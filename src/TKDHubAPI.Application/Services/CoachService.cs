namespace TKDHubAPI.Application.Services;

using global::TKDHubAPI.Application.DTOs.Dojaang;
using global::TKDHubAPI.Application.DTOs.User;
using System.Collections.Generic;
using System.Threading.Tasks;

public class CoachService : ICoachService
{
    private readonly IUserService _userService;
    private readonly IDojaangRepository _dojaangRepository;
    private readonly IMapper _mapper;

    public CoachService(
        IUserService userService,
        IDojaangRepository dojaangRepository,
        IMapper mapper)
    {
        _userService = userService;
        _dojaangRepository = dojaangRepository;
        _mapper = mapper;
    }

    public async Task<UserDto?> GetCoachByIdAsync(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
            return null;

        return _mapper.Map<UserDto>(user);
    }

    public async Task<IEnumerable<UserDto>> GetAllCoachesAsync()
    {
        var users = await _userService.GetUsersByRoleAsync("Coach");
        return users.Select(_mapper.Map<UserDto>);
    }

    public async Task<List<ManagedDojaangDto>> GetManagedDojaangsAsync(int coachId)
    {
        var managedDojaangIds = await _userService.GetManagedDojaangIdsAsync(coachId);
        var allDojaangs = await _dojaangRepository.GetAllAsync();

        var managedDojaangs = new List<ManagedDojaangDto>();
        foreach (var dojaang in allDojaangs)
        {
            if (managedDojaangIds.Contains(dojaang.Id))
            {
                managedDojaangs.Add(new ManagedDojaangDto
                {
                    Id = dojaang.Id,
                    Name = dojaang.Name
                });
            }
        }
        return managedDojaangs;
    }

    /// <summary>
    /// Removes the association between a coach and a managed dojaang.
    /// </summary>
    /// <param name="coachId">The coach's user ID.</param>
    /// <param name="dojaangId">The dojaang ID to remove from management.</param>
    public async Task RemoveManagedDojaangAsync(int coachId, int dojaangId)
    {
        // Check if the coach actually manages the dojaang
        var manages = await _userService.CoachManagesDojaangAsync(coachId, dojaangId);
        if (!manages)
            throw new KeyNotFoundException("Coach does not manage this dojaang.");

        await _userService.RemoveCoachFromDojaangAsync(coachId, dojaangId);
    }

    /// <summary>
    /// Adds a managed dojaang to a coach if not already present.
    /// </summary>
    public async Task AddManagedDojaangAsync(int coachId, int dojaangId)
    {
        // Check if the coach already manages this dojaang
        var manages = await _userService.CoachManagesDojaangAsync(coachId, dojaangId);
        if (manages)
            return; // Already managed, do nothing

        // You need to implement this in IUserService and UserService
        if (_userService is IUserService userServiceImpl)
        {
            await userServiceImpl.AddCoachToDojaangRelationAsync(coachId, dojaangId);
        }
        else
        {
            throw new NotImplementedException("AddCoachToDojaangRelationAsync must be implemented in the user service.");
        }
    }
}
