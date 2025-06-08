namespace TKDHubAPI.Infrastructure.Data.Configurations;
public abstract class BaseEntityConfiguration<TEntity> : IEntityTypeConfiguration<TEntity>
    where TEntity : BaseEntity
{
    public virtual void Configure(EntityTypeBuilder<TEntity> builder)
    {
        builder.HasKey("Id");

        builder.Property(e => e.Id)
        .UseIdentityColumn(1, 1);

        builder.Property<DateTime>("CreatedAt")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .ValueGeneratedOnAdd()
            .IsRequired();
        builder.Property<DateTime>("UpdatedAt")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .ValueGeneratedOnAddOrUpdate()
            .IsRequired();

    }
}
