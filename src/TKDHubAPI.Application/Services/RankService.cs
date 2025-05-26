namespace TKDHubAPI.Application.Services;
public class RankService : IRankService
{
    private readonly IRankRepository _rankRepository;
    private readonly IUnitOfWork _unitOfWork;

    public RankService(IRankRepository rankRepository, IUnitOfWork unitOfWork)
    {
        _rankRepository = rankRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task AddAsync(Rank rank)
    {
        await _rankRepository.AddAsync(rank);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var rank = await _rankRepository.GetByIdAsync(id);
        if (rank != null)
        {
            _rankRepository.Remove(rank);
            await _unitOfWork.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<Rank>> GetAllAsync()
    {
        return await _rankRepository.GetAllAsync();
    }

    public async Task<Rank?> GetByIdAsync(int id)
    {
        return await _rankRepository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<Rank>> GetRanksByCoachIdAsync(int coachId)
    {
        var all = await _rankRepository.GetAllAsync();
        return all.Where(r => r.Users.Any(u => u.UserDojaangs.Any(ud => ud.UserId == coachId && ud.Role == "Coach")));
    }

    public async Task<IEnumerable<Rank>> GetRanksByColorAsync(BeltColor color)
    {
        var all = await _rankRepository.GetAllAsync();
        return all.Where(r => r.Color == color);
    }

    public async Task<IEnumerable<Rank>> GetRanksByDanLevelAsync(int danLevel)
    {
        var all = await _rankRepository.GetAllAsync();
        return all.Where(r => r.DanLevel.HasValue && r.DanLevel.Value == danLevel);
    }

    public async Task<IEnumerable<Rank>> GetRanksByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        var all = await _rankRepository.GetAllAsync();
        return all.Where(r => r.CreatedDate >= startDate && r.CreatedDate <= endDate);
    }

    public async Task<IEnumerable<Rank>> GetRanksByDescriptionAsync(string description)
    {
        var all = await _rankRepository.GetAllAsync();
        return all.Where(r => r.Description != null && r.Description.Contains(description, StringComparison.OrdinalIgnoreCase));
    }

    public async Task<IEnumerable<Rank>> GetRanksByDojaangIdAsync(int dojaangId)
    {
        var all = await _rankRepository.GetAllAsync();
        return all.Where(r => r.Users.Any(u => u.DojaangId == dojaangId));
    }

    public async Task<IEnumerable<Rank>> GetRanksByLocationAsync(string location)
    {
        var all = await _rankRepository.GetAllAsync();
        return all.Where(r => r.Users.Any(u => u.Dojaang != null && u.Dojaang.Location != null && u.Dojaang.Location.Contains(location, StringComparison.OrdinalIgnoreCase)));
    }

    public async Task<IEnumerable<Rank>> GetRanksByNameAsync(string name)
    {
        var all = await _rankRepository.GetAllAsync();
        return all.Where(r => r.Name != null && r.Name.Contains(name, StringComparison.OrdinalIgnoreCase));
    }

    public async Task<IEnumerable<Rank>> GetRanksByOrderAsync(int order)
    {
        var all = await _rankRepository.GetAllAsync();
        return all.Where(r => r.Order == order);
    }

    public async Task<IEnumerable<Rank>> GetRanksByStripeColorAsync(BeltColor stripeColor)
    {
        var all = await _rankRepository.GetAllAsync();
        return all.Where(r => r.StripeColor.HasValue && r.StripeColor.Value == stripeColor);
    }

    public async Task<IEnumerable<Rank>> GetRanksByTypeAsync(BeltColor rankType)
    {
        // Assuming "type" means the main color
        var all = await _rankRepository.GetAllAsync();
        return all.Where(r => r.Color == rankType);
    }

    public async Task<IEnumerable<Rank>> GetRanksByUserIdAsync(int userId)
    {
        var all = await _rankRepository.GetAllAsync();
        return all.Where(r => r.Users.Any(u => u.Id == userId));
    }

    public async Task UpdateAsync(Rank rank)
    {
        _rankRepository.Update(rank);
        await _unitOfWork.SaveChangesAsync();
    }
}
