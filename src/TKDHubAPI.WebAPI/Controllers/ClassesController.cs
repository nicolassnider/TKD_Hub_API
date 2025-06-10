using TKDHubAPI.Application.Services;
using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.WebAPI.Controllers;

/// <summary>
/// API controller for managing TrainingClass entities.
/// </summary>
public class ClassesController : BaseApiController
{
    private readonly ITrainingClassService _trainingClassService;

    public ClassesController(ILogger<ClassesController> logger, ITrainingClassService trainingClassService)
        : base(logger)
    {
        _trainingClassService = trainingClassService;
    }

    /// <summary>
    /// Gets all training classes.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var classes = await _trainingClassService.GetAllAsync();
        return SuccessResponse(classes);
    }

    /// <summary>
    /// Gets a training class by its ID.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var trainingClass = await _trainingClassService.GetByIdAsync(id);
        if (trainingClass == null)
            return ErrorResponse("Training class not found.", 404);
        return SuccessResponse(trainingClass);
    }

    /// <summary>
    /// Creates a new training class.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TrainingClass trainingClass)
    {
        var created = await _trainingClassService.CreateAsync(trainingClass);
        return SuccessResponse(created);
    }

    /// <summary>
    /// Updates an existing training class.
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] TrainingClass trainingClass)
    {
        if (id != trainingClass.Id)
            return ErrorResponse("ID mismatch.", 400);

        await _trainingClassService.UpdateAsync(trainingClass);
        return SuccessResponse("Training class updated successfully.");
    }

    /// <summary>
    /// Deletes a training class by its ID.
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _trainingClassService.DeleteAsync(id);
        return SuccessResponse("Training class deleted successfully.");
    }
}
