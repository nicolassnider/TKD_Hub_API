using Microsoft.EntityFrameworkCore;
using TKDHubAPI.Domain.Repositories;
using TKDHubAPI.Infrastructure.Data;

namespace TKDHubAPI.Infrastructure.Repositories;
public class GenericRepository<TEntity> : IGenericRepository<TEntity>
    where TEntity : class
{
    protected readonly TkdHubDbContext _context;
    public GenericRepository(TkdHubDbContext context) => _context = context;

    public async Task<IEnumerable<TEntity>> GetAllAsync() => await _context.Set<TEntity>().ToListAsync();
    public async Task<TEntity?> GetByIdAsync(int id) => await _context.Set<TEntity>().FindAsync(id);
    public async Task AddAsync(TEntity entity) => await _context.Set<TEntity>().AddAsync(entity);
    public void Update(TEntity entity) => _context.Set<TEntity>().Update(entity);
    public void Remove(TEntity entity) => _context.Set<TEntity>().Remove(entity);
}