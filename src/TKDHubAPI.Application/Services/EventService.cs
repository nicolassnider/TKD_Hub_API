namespace TKDHubAPI.Application.Services;
public class EventService : IEventService
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public EventService(IEventRepository eventRepository, IUnitOfWork unitOfWork)
    {
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task AddAsync(Event ev)
    {
        await _eventRepository.AddAsync(ev);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var ev = await _eventRepository.GetByIdAsync(id);
        if (ev != null)
        {
            _eventRepository.Remove(ev);
            await _unitOfWork.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<Event>> GetAllAsync()
    {
        return await _eventRepository.GetAllAsync();
    }

    public async Task<Event?> GetByIdAsync(int id)
    {
        return await _eventRepository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<Event>> GetEventsByCoachIdAsync(int coachId)
    {
        var all = await _eventRepository.GetAllAsync();
        return all.Where(e => e.CoachId == coachId);
    }

    public async Task<IEnumerable<Event>> GetEventsByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        var all = await _eventRepository.GetAllAsync();
        return all.Where(e => e.StartDate >= startDate && e.EndDate <= endDate);
    }

    public async Task<IEnumerable<Event>> GetEventsByDojaangIdAsync(int dojaangId)
    {
        var all = await _eventRepository.GetAllAsync();
        return all.Where(e => e.DojaangId == dojaangId);
    }

    public async Task<IEnumerable<Event>> GetEventsByLocationAsync(string location)
    {
        var all = await _eventRepository.GetAllAsync();
        return all.Where(e => e.Location != null && e.Location.Contains(location, StringComparison.OrdinalIgnoreCase));
    }

    public async Task<IEnumerable<Event>> GetEventsByNameAsync(string name)
    {
        var all = await _eventRepository.GetAllAsync();
        return all.Where(e => e.Name != null && e.Name.Contains(name, StringComparison.OrdinalIgnoreCase));
    }

    public async Task<IEnumerable<Event>> GetEventsByTypeAsync(EventType eventType)
    {
        var all = await _eventRepository.GetAllAsync();
        return all.Where(e => e.Type == eventType);
    }

    public async Task<IEnumerable<Event>> GetEventsByUserIdAsync(int userId)
    {
        var all = await _eventRepository.GetAllAsync();
        return all.Where(e => e.EventAttendances.Any(a => a.StudentId == userId));
    }

    public async Task UpdateAsync(Event ev)
    {
        _eventRepository.Update(ev);
        await _unitOfWork.SaveChangesAsync();
    }
}
