using TKDHubAPI.Application.DTOs.Dojaang;
using TKDHubAPI.Application.DTOs.User;

namespace TKDHubAPI.Application.Services
{

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

        public async Task RemoveManagedDojaangAsync(int coachId, int dojaangId)
        {
            var manages = await _userService.CoachManagesDojaangAsync(coachId, dojaangId);
            if (!manages)
                throw new KeyNotFoundException("Coach does not manage this dojaang.");

            await _userService.RemoveCoachFromDojaangAsync(coachId, dojaangId);
        }

        public async Task AddManagedDojaangAsync(int coachId, int dojaangId)
        {
            var manages = await _userService.CoachManagesDojaangAsync(coachId, dojaangId);
            if (manages)
                return;

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
}
