namespace TKDHubAPI.Application.Services;
public class CrudService<TEntity, TRepository> : ICrudService<TEntity>
    where TEntity : class
    where TRepository : IGenericRepository<TEntity>
{
    protected readonly IUnitOfWork _unitOfWork;
    protected readonly TRepository _repository;

    public CrudService(IUnitOfWork unitOfWork, TRepository repository)
    {
        _unitOfWork = unitOfWork;
        _repository = repository;
    }

    public async Task<IEnumerable<TEntity>> GetAllAsync() => await _repository.GetAllAsync();
    public async Task<TEntity?> GetByIdAsync(int id) => await _repository.GetByIdAsync(id);
    public async Task AddAsync(TEntity entity)
    {
        await _repository.AddAsync(entity);
        await _unitOfWork.SaveChangesAsync();
    }
    public async Task UpdateAsync(TEntity entity)
    {
        _repository.Update(entity);
        await _unitOfWork.SaveChangesAsync();
    }
    public async Task DeleteAsync(int id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity != null)
        {
            _repository.Remove(entity);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
