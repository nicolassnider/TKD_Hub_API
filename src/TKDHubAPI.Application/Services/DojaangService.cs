namespace TKDHubAPI.Application.Services;
public class DojaangService : IDojaangService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IGenericRepository<User> _userRepository;
    private readonly IMapper _mapper;
    private readonly IUserDojaangRepository _userDojaangRepository;
    private readonly IDojaangRepository _dojaangRepository;
    private readonly ICurrentUserService _currentUserService;
    public DojaangService(
        IUnitOfWork unitOfWork,
        IDojaangRepository dojaangRepository,
        IMapper mapper,
        IGenericRepository<User> userRepository,
        ICurrentUserService currentUserService,
        IUserDojaangRepository userDojaangRepository)
    {
        _unitOfWork = unitOfWork;
        _dojaangRepository = dojaangRepository;
        _mapper = mapper;
        _userRepository = userRepository;
        _userDojaangRepository = userDojaangRepository;
        _currentUserService = currentUserService;
    }
    public async Task<IEnumerable<DojaangDto>> GetAllAsync()
    {
        IEnumerable<Dojaang> dojaangs;
        var currentUser = await _currentUserService.GetCurrentUserAsync();

        if (currentUser == null)
            return Enumerable.Empty<DojaangDto>();

        if (currentUser.HasRole("Admin"))
        {
            dojaangs = await _dojaangRepository.GetAllAsync();
        }
        else if (currentUser.HasRole("Coach"))
        {
            // Get dojaangs where the user is a coach
            var userDojaangs = await _userDojaangRepository.GetAllAsync();
            var coachDojaangIds = userDojaangs
                .Where(ud => ud.User.Id == currentUser.Id && ud.Role == "Coach")
                .Select(ud => ud.DojaangId)
                .ToList();

            dojaangs = (await _dojaangRepository.GetAllAsync())
                .Where(d => coachDojaangIds.Contains(d.Id));
        }
        else if (currentUser.HasRole("Student"))
        {
            // Get dojaangs where the user is a student
            var userDojaangs = await _userDojaangRepository.GetAllAsync();
            var studentDojaangIds = userDojaangs
                .Where(ud => ud.User.Id == currentUser.Id && ud.Role == "Student")
                .Select(ud => ud.DojaangId)
                .ToList();

            dojaangs = (await _dojaangRepository.GetAllAsync())
                .Where(d => studentDojaangIds.Contains(d.Id));
        }
        else
        {
            // No role: return empty
            dojaangs = Enumerable.Empty<Dojaang>();
        }

        var dtos = _mapper.Map<IEnumerable<DojaangDto>>(dojaangs);
        MapCoachNames(dojaangs, dtos);
        return dtos;
    }


    private void MapCoachName(Dojaang dojaang, DojaangDto dto)
    {
        if (dojaang.Coach != null)
            dto.CoachName = $"{dojaang.Coach.FirstName} {dojaang.Coach.LastName}";
        else
            dto.CoachName = string.Empty;
    }


    private void MapCoachNames(IEnumerable<Dojaang> dojaangs, IEnumerable<DojaangDto> dtos)
    {
        var dojaangList = dojaangs.ToList();
        var dtoList = dtos.ToList();
        for (int i = 0; i < dojaangList.Count && i < dtoList.Count; i++)
        {
            MapCoachName(dojaangList[i], dtoList[i]);
        }
    }


    public async Task<DojaangDto?> GetByIdAsync(int id)
    {
        var dojaang = await _dojaangRepository.GetByIdAsync(id);
        if (dojaang == null) return null;

        var dto = _mapper.Map<DojaangDto>(dojaang);

        // Get the coach relation from UserDojaangRepository
        var coachRelation = await _userDojaangRepository.GetCoachRelationForDojaangAsync(id);
        if (coachRelation != null && coachRelation.User != null)
        {
            dto.CoachId = coachRelation.UserId;
            dto.CoachName = $"{coachRelation.User.FirstName} {coachRelation.User.LastName}";
        }
        else
        {
            dto.CoachId = 0;
            dto.CoachName = string.Empty;
        }

        return dto;
    }


    public async Task AddAsync(CreateDojaangDto dto)
    {
        var dojaang = _mapper.Map<Dojaang>(dto);
        await _dojaangRepository.AddAsync(dojaang);
        await _unitOfWork.SaveChangesAsync();
    }


    public async Task UpdateAsync(UpdateDojaangDto dto)
    {
        var dojaang = await _dojaangRepository.GetByIdAsync(dto.Id);
        if (dojaang == null)
            throw new InvalidOperationException("Dojaang not found.");

        _mapper.Map(dto, dojaang);

        // Treat 0 as null for CoachId
        if (dto.CoachId == 0)
            dto.CoachId = null;

        if (dto.CoachId.HasValue)
        {
            var coach = await _userRepository.GetByIdAsync(dto.CoachId.Value);
            if (coach != null)
            {
                dojaang.Coach = coach;
                dojaang.CoachId = coach.Id;

                // Add UserDojaang relation if not present
                var existingRelation = (await _userDojaangRepository
                    .GetAllAsync())
                    .FirstOrDefault(ud => ud.User.Id == coach.Id && ud.DojaangId == dojaang.Id && ud.Role == "Coach");

                if (existingRelation == null)
                {
                    var userDojaang = new UserDojaang
                    {
                        User = coach,
                        DojaangId = dojaang.Id,
                        Role = "Coach"
                    };
                    await _userDojaangRepository.AddAsync(userDojaang);
                }
            }
            else
            {
                dojaang.Coach = null;
                dojaang.CoachId = null;
            }
        }
        else
        {
            dojaang.Coach = null;
            dojaang.CoachId = null;
        }

        _dojaangRepository.Update(dojaang);
        await _unitOfWork.SaveChangesAsync();
    }


    public async Task DeleteAsync(int id)
    {
        var dojaang = await _dojaangRepository.GetByIdAsync(id);
        if (dojaang != null)
        {
            _dojaangRepository.Remove(dojaang);
            await _unitOfWork.SaveChangesAsync();
        }
    }


    public async Task<DojaangDto> CreateDojaangAsync(CreateDojaangDto dto, User currentUser)
    {
        if (!currentUser.HasRole("Admin"))
            throw new UnauthorizedAccessException("Only admins can create Dojaangs.");


        var dojaang = _mapper.Map<Dojaang>(dto);
        await _dojaangRepository.AddAsync(dojaang);
        await _unitOfWork.SaveChangesAsync();
        return _mapper.Map<DojaangDto>(dojaang);
    }


    public async Task<DojaangDto> AssignCoachToDojaangAsync(UpdateDojaangDto dto)
    {
        var dojaang = await _dojaangRepository.GetByIdAsync(dto.Id);
        if (dojaang == null)
            throw new InvalidOperationException("Dojaang not found.");


        _mapper.Map(dto, dojaang);


        if (dto.CoachId.HasValue)
        {
            var coach = await _userRepository.GetByIdAsync(dto.CoachId.Value);
            dojaang.Coach = coach;
        }


        _dojaangRepository.Update(dojaang);
        await _unitOfWork.SaveChangesAsync();
        return _mapper.Map<DojaangDto>(dojaang);
    }


    public Task AddAsync(DojaangDto entity)
    {
        throw new NotImplementedException();
    }


    public Task UpdateAsync(DojaangDto entity)
    {
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<DojaangDto>> GetDojaangsForCurrentCoachAsync()
    {
        var currentUser = await _currentUserService.GetCurrentUserAsync();
        if (currentUser == null || !currentUser.HasRole("Coach"))
            return Enumerable.Empty<DojaangDto>();

        var dojaangs = await _dojaangRepository.GetDojaangsByCoachIdAsync(currentUser.Id);
        var dtos = _mapper.Map<IEnumerable<DojaangDto>>(dojaangs);
        MapCoachNames(dojaangs, dtos);
        return dtos;
    }
}
