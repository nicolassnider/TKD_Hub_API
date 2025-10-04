using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TKDHubAPI.Application.CQRS.Commands.Dashboard;
using TKDHubAPI.Application.CQRS.Queries.Dashboard;
using TKDHubAPI.Application.DTOs.Dashboard;

namespace TKDHubAPI.WebAPI.Controllers;

[Authorize]
public class DashboardsController : BaseApiController
{
    private readonly IMediator _mediator;

    public DashboardsController(IMediator mediator, ILogger<DashboardsController> logger)
        : base(logger)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<DashboardResponseDto>> GetDashboard(
        [FromQuery] int? userId = null,
        [FromQuery] string? userRole = null,
        [FromQuery] string? layoutId = null,
        [FromQuery] string? startDate = null,
        [FromQuery] string? endDate = null,
        [FromQuery] string? filters = null,
        [FromQuery] string? widgetIds = null
    )
    {
        try
        {
            var currentUserId = userId ?? GetUserId();
            Logger.LogInformation(
                "Getting dashboard for user {UserId} with role {UserRole}",
                currentUserId,
                userRole
            );

            var query = new GetDashboardQuery(
                currentUserId,
                userRole,
                layoutId,
                startDate,
                endDate,
                filters,
                widgetIds
            );
            var dashboard = await _mediator.Send(query);
            return Ok(dashboard);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error getting dashboard for user {UserId}", userId);
            return StatusCode(500, "An error occurred while retrieving the dashboard");
        }
    }

    [HttpGet("layouts")]
    public async Task<ActionResult<List<DashboardLayoutDto>>> GetLayouts(
        [FromQuery] int? userId = null
    )
    {
        try
        {
            var currentUserId = userId ?? GetUserId();
            Logger.LogInformation("Getting layouts for user {UserId}", currentUserId);
            var query = new GetDashboardLayoutsQuery(currentUserId);
            var layouts = await _mediator.Send(query);
            return Ok(layouts);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error getting layouts for user {UserId}", userId);
            return StatusCode(500, "An error occurred while retrieving the layouts");
        }
    }

    [HttpGet("default/{userRole}")]
    public async Task<ActionResult<DashboardLayoutDto>> GetDefaultLayout(string userRole)
    {
        try
        {
            Logger.LogInformation("Getting default layout for role {UserRole}", userRole);
            var query = new GetDefaultDashboardQuery(userRole);
            var layout = await _mediator.Send(query);
            if (layout == null)
                return NotFound($"No default layout found for role {userRole}");
            return Ok(layout);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error getting default layout for role {UserRole}", userRole);
            return StatusCode(500, "An error occurred while retrieving the default layout");
        }
    }

    [HttpGet("widgets/{widgetId}/data")]
    public async Task<ActionResult<object>> GetWidgetData(
        string widgetId,
        [FromQuery] string widgetType
    )
    {
        try
        {
            Logger.LogInformation(
                "Getting data for widget {WidgetId} of type {WidgetType}",
                widgetId,
                widgetType
            );
            var query = new GetWidgetDataQuery(widgetType, widgetId);
            var data = await _mediator.Send(query);
            return Ok(data);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error getting widget data for {WidgetId}", widgetId);
            return StatusCode(500, "An error occurred while retrieving the widget data");
        }
    }

    [HttpPost("layouts")]
    public async Task<ActionResult<DashboardLayoutDto>> CreateLayout(
        [FromBody] DashboardLayoutDto layout
    )
    {
        try
        {
            Logger.LogInformation("Creating layout {LayoutName}", layout.Name);
            var command = new CreateDashboardLayoutCommand(layout);
            var created = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetLayouts), new { userId = created.UserId }, created);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error creating layout {LayoutName}", layout.Name);
            return StatusCode(500, "An error occurred while creating the layout");
        }
    }

    [HttpPut("layouts/{id}")]
    public async Task<ActionResult<DashboardLayoutDto>> UpdateLayout(
        string id,
        [FromBody] DashboardLayoutDto layout
    )
    {
        try
        {
            Logger.LogInformation("Updating layout {LayoutId}", id);
            var command = new UpdateDashboardLayoutCommand(id, layout);
            var updated = await _mediator.Send(command);
            return Ok(updated);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error updating layout {LayoutId}", id);
            return StatusCode(500, "An error occurred while updating the layout");
        }
    }

    [HttpDelete("layouts/{id}")]
    public async Task<ActionResult> DeleteLayout(string id)
    {
        try
        {
            Logger.LogInformation("Deleting layout {LayoutId}", id);
            var command = new DeleteDashboardLayoutCommand(id);
            var result = await _mediator.Send(command);
            if (result)
                return NoContent();
            return NotFound();
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error deleting layout {LayoutId}", id);
            return StatusCode(500, "An error occurred while deleting the layout");
        }
    }

    [HttpPost("widgets")]
    public async Task<ActionResult<WidgetDto>> CreateWidget([FromBody] WidgetDto widget)
    {
        try
        {
            Logger.LogInformation("Creating widget {WidgetTitle}", widget.Title);
            var command = new CreateWidgetCommand(widget);
            var created = await _mediator.Send(command);
            return CreatedAtAction(
                nameof(GetWidgetData),
                new { widgetId = created.Id, widgetType = created.Type },
                created
            );
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error creating widget {WidgetTitle}", widget.Title);
            return StatusCode(500, "An error occurred while creating the widget");
        }
    }

    [HttpPut("widgets/{id}")]
    public async Task<ActionResult<WidgetDto>> UpdateWidget(string id, [FromBody] WidgetDto widget)
    {
        try
        {
            Logger.LogInformation("Updating widget {WidgetId}", id);
            var command = new UpdateWidgetCommand(id, widget);
            var updated = await _mediator.Send(command);
            return Ok(updated);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error updating widget {WidgetId}", id);
            return StatusCode(500, "An error occurred while updating the widget");
        }
    }

    [HttpDelete("widgets/{id}")]
    public async Task<ActionResult> DeleteWidget(string id)
    {
        try
        {
            Logger.LogInformation("Deleting widget {WidgetId}", id);
            var command = new DeleteWidgetCommand(id);
            var result = await _mediator.Send(command);
            if (result)
                return NoContent();
            return NotFound();
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error deleting widget {WidgetId}", id);
            return StatusCode(500, "An error occurred while deleting the widget");
        }
    }

    [HttpPatch("widgets/{id}/position")]
    public async Task<ActionResult> UpdateWidgetPosition(
        string id,
        [FromBody] WidgetPositionDto position
    )
    {
        try
        {
            Logger.LogInformation("Updating position for widget {WidgetId}", id);
            var command = new UpdateWidgetPositionCommand(
                id,
                position.X,
                position.Y,
                position.Width,
                position.Height
            );
            var result = await _mediator.Send(command);
            if (result)
                return NoContent();
            return NotFound();
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error updating widget position {WidgetId}", id);
            return StatusCode(500, "An error occurred while updating the widget position");
        }
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdClaim, out var userId))
            return userId;
        throw new UnauthorizedAccessException("User ID not found in claims");
    }

    private string GetUserRole()
    {
        return User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value ?? "Guest";
    }
}
