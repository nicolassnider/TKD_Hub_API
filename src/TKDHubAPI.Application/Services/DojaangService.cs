using TKDHubAPI.Application.DTOs.Dojaang;

namespace TKDHubAPI.Application.Services;
public class DojaangService : IDojaangService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IGenericRepository<Dojaang> _dojaangRepository;
    private readonly IGenericRepository<User> _userRepository;
    private readonly IMapper _mapper;

    public DojaangService(IUnitOfWork unitOfWork, IGenericRepository<Dojaang> dojaangRepository, IMapper mapper, IGenericRepository<User> userRepository)
    {
        _unitOfWork = unitOfWork;
        _dojaangRepository = dojaangRepository;
        _mapper = mapper;
        _userRepository = userRepository;
    }

    public async Task<IEnumerable<Dojaang>> GetAllAsync() => await _dojaangRepository.GetAllAsync();

    public async Task<Dojaang?> GetByIdAsync(int id) => await _dojaangRepository.GetByIdAsync(id);

    public async Task AddAsync(Dojaang dojaang)
    {
        await _dojaangRepository.AddAsync(dojaang);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task UpdateAsync(Dojaang dojaang)
    {
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

    public async Task<Dojaang> CreateDojaangAsync(CreateDojaangDto dto, User currentUser)
    {
        if (!currentUser.HasRole("Admin"))
            throw new UnauthorizedAccessException("Only admins can create Dojaangs.");

        var dojaang = _mapper.Map<Dojaang>(dto);

        await _dojaangRepository.AddAsync(dojaang);
        await _unitOfWork.SaveChangesAsync();
        return dojaang;
    }

    public async Task<Dojaang> AssignCoachToDojaangAsync(UpdateDojaangDto dto)
    {
        var coachId = dto.CoachId;
        var coach = await _userRepository.GetByIdAsync(coachId.Value);
        var dojaangId = dto.Id;
        var dojaang = await _dojaangRepository.GetByIdAsync(dojaangId);
        dojaang.Coach = coach;
        dojaang.CoachId = coachId;
        _dojaangRepository.Update(dojaang);
        await _unitOfWork.SaveChangesAsync();
        return dojaang;
        throw new NotImplementedException();
    }
}
