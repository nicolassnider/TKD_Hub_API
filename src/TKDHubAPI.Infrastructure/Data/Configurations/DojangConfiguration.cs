using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.Infrastructure.Data.Configurations;
public class DojangConfiguration : BaseEntityConfiguration<Dojang>
{

    public void Configure(EntityTypeBuilder<Dojang> builder)
    {
        builder.Property(d => d.Name)
            .IsRequired()
            .HasMaxLength(200);
        builder.Property(d => d.Address)
            .IsRequired()
            .HasMaxLength(255);
        builder.Property(d => d.PhoneNumber)
            .HasMaxLength(20);
        builder.Property(d => d.Email)
            .HasMaxLength(255);
        builder.Property(d => d.KoreanName)
            .HasMaxLength(100);
        builder.Property(d => d.KoreanNamePhonetic)
            .HasMaxLength(100);
    }
}
