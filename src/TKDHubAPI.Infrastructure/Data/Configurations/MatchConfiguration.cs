using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.Infrastructure.Data.Configurations;
public class MatchConfiguration : BaseEntityConfiguration<Match>
{
    public override void Configure(EntityTypeBuilder<Match> builder)
    {
        builder.HasOne(m => m.RedCornerStudent)
            .WithMany()
            .HasForeignKey(m => m.RedCornerStudentId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(m => m.BlueCornerStudent)
            .WithMany()
            .HasForeignKey(m => m.BlueCornerStudentId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
