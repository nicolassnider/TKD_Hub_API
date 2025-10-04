namespace TKDHubAPI.Infrastructure.Repositories;

public class GenericRepository<TEntity> : IGenericRepository<TEntity>
    where TEntity : class
{
    protected readonly TkdHubDbContext _context;

    public GenericRepository(TkdHubDbContext context) => _context = context;

    public virtual async Task<IEnumerable<TEntity>> GetAllAsync() =>
        await _context.Set<TEntity>().ToListAsync();

    public virtual async Task<TEntity?> GetByIdAsync(int id) =>
        await _context.Set<TEntity>().FindAsync(id);

    public async Task AddAsync(TEntity entity) => await _context.Set<TEntity>().AddAsync(entity);

    public void Update(TEntity entity) => _context.Set<TEntity>().Update(entity);

    public void Remove(TEntity entity)
    {
        var isActiveProp = entity.GetType().GetProperty("IsActive");
        if (isActiveProp != null && isActiveProp.PropertyType == typeof(bool))
        {
            // Soft delete: set IsActive to false
            isActiveProp.SetValue(entity, false);
            Update(entity);
        }
        else
        {
            // Hard delete if IsActive is not present
            _context.Set<TEntity>().Remove(entity);
        }
    }

    public void Reactivate(TEntity entity)
    {
        var isActiveProp = entity.GetType().GetProperty("IsActive");
        if (isActiveProp != null && isActiveProp.PropertyType == typeof(bool))
        {
            isActiveProp.SetValue(entity, true);
            Update(entity);
        }
        else
        {
            throw new InvalidOperationException(
                "Entity does not support reactivation (missing IsActive property)."
            );
        }
    }

    public virtual async Task<int> CountAsync() => await _context.Set<TEntity>().CountAsync();
}
