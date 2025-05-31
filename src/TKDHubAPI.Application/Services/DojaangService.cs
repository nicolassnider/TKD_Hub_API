using TKDHubAPI.Application.DTOs.Dojaang;

namespace TKDHubAPI.Application.Services;
public class DojaangService : IDojaangService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IGenericRepository<User> _userRepository;
    private readonly IMapper _mapper;


    private readonly IDojaangRepository _dojaangRepository;


    public DojaangService(
        IUnitOfWork unitOfWork,
        IDojaangRepository dojaangRepository,
        IMapper mapper,
        IGenericRepository<User> userRepository)
    {
        _unitOfWork = unitOfWork;
        _dojaangRepository = dojaangRepository;
        _mapper = mapper;
        _userRepository = userRepository;
    }
    public async Task<IEnumerable<DojaangDto>> GetAllAsync()
    {
        var dojaangs = await _dojaangRepository.GetAllAsync();
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
        MapCoachName(dojaang, dto);
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


        // Map all fields except CoachId/Coach
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
}
