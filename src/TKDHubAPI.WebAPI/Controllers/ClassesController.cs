using TKDHubAPI.Application.DTOs.TrainingClass;
using TKDHubAPI.Application.Services;
using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.WebAPI.Controllers;

/// <summary>
/// API controller for managing <see cref="TrainingClass"/> entities.
/// </summary>
public class ClassesController : BaseApiController
{
    private readonly ITrainingClassService _trainingClassService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="ClassesController"/> class.
    /// </summary>
    /// <param name="logger">The logger instance for logging operations.</param>
    /// <param name="trainingClassService">The service for managing training classes.</param>
    /// <param name="mapper">The AutoMapper instance for object mapping.</param>
    public ClassesController(ILogger<ClassesController> logger, ITrainingClassService trainingClassService, IMapper mapper)
        : base(logger)
    {
        _trainingClassService = trainingClassService;
        _mapper = mapper;
    }

    /// <summary>
    /// Retrieves all training classes.
    /// </summary>
    /// <returns>A list of <see cref="TrainingClassDto"/> objects representing all training classes.</returns>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var classes = await _trainingClassService.GetAllAsync();
        var dtos = _mapper.Map<List<TrainingClassDto>>(classes);
        return SuccessResponse(dtos);
    }

    /// <summary>
    /// Retrieves a training class by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the training class.</param>
    /// <returns>
    /// An <see cref="IActionResult"/> containing the <see cref="TrainingClassDto"/> if found;
    /// otherwise, a 404 error response.
    /// </returns>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var trainingClass = await _trainingClassService.GetByIdAsync(id);
        if (trainingClass == null)
            return ErrorResponse("Training class not found.", 404);
        var dto = _mapper.Map<TrainingClassDto>(trainingClass);
        return SuccessResponse(dto);
    }

    /// <summary>
    /// Creates a new training class.
    /// </summary>
    /// <param name="trainingClassDto">The DTO containing the data for the new training class.</param>
    /// <returns>
    /// An <see cref="IActionResult"/> containing the created <see cref="TrainingClassDto"/>.
    /// </returns>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTrainingClassDto trainingClassDto)
    {
        var entity = _mapper.Map<TrainingClass>(trainingClassDto);
        var created = await _trainingClassService.CreateAsync(entity);
        var resultDto = _mapper.Map<TrainingClassDto>(created);
        return SuccessResponse(resultDto);
    }

    /// <summary>
    /// Updates an existing training class.
    /// </summary>
    /// <param name="id">The unique identifier of the training class to update.</param>
    /// <param name="trainingClassDto">The DTO containing the updated data for the training class.</param>
    /// <returns>
    /// An <see cref="IActionResult"/> indicating the result of the update operation.
    /// </returns>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] TrainingClassDto trainingClassDto)
    {
        if (id != trainingClassDto.Id)
            return ErrorResponse("ID mismatch.", 400);

        var entity = _mapper.Map<TrainingClass>(trainingClassDto);
        await _trainingClassService.UpdateAsync(entity);
        return SuccessResponse("Training class updated successfully.");
    }

    /// <summary>
    /// Deletes a training class by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the training class to delete.</param>
    /// <returns>
    /// An <see cref="IActionResult"/> indicating the result of the delete operation.
    /// </returns>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _trainingClassService.DeleteAsync(id);
        return SuccessResponse("Training class deleted successfully.");
    }
}
