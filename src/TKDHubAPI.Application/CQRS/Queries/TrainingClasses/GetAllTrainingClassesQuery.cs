using MediatR;
using TKDHubAPI.Application.DTOs.Pagination;
using TKDHubAPI.Application.DTOs.TrainingClass;

namespace TKDHubAPI.Application.CQRS.Queries.TrainingClasses;

public class GetAllTrainingClassesQuery : IRequest<PaginatedResult<TrainingClassDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 0;

    public GetAllTrainingClassesQuery(int page = 1, int pageSize = 0)
    {
        Page = page;
        PageSize = pageSize;
    }
}
