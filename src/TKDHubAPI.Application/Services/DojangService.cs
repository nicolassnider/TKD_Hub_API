using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Domain.Entities;
using TKDHubAPI.Domain.Repositories;

namespace TKDHubAPI.Application.Services;
public class DojangService : IDojangService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IGenericRepository<Dojang> _dojangRepository;

    public DojangService(IUnitOfWork unitOfWork, IGenericRepository<Dojang> dojangRepository)
    {
        _unitOfWork = unitOfWork;
        _dojangRepository = dojangRepository;
    }

    public async Task<IEnumerable<Dojang>> GetAllAsync() => await _dojangRepository.GetAllAsync();

    public async Task<Dojang?> GetByIdAsync(int id) => await _dojangRepository.GetByIdAsync(id);

    public async Task AddAsync(Dojang dojang)
    {
        await _dojangRepository.AddAsync(dojang);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task UpdateAsync(Dojang dojang)
    {
        _dojangRepository.Update(dojang);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var dojang = await _dojangRepository.GetByIdAsync(id);
        if (dojang != null)
        {
            _dojangRepository.Remove(dojang);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
