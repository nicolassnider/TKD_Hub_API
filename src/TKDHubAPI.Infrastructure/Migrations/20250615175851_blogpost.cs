using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TKDHubAPI.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class blogpost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BlogPosts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AuthorId = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogPosts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BlogPosts_Users_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 15, 17, 58, 50, 975, DateTimeKind.Utc).AddTicks(3609));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 15, 17, 58, 50, 975, DateTimeKind.Utc).AddTicks(3616));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 15, 17, 58, 50, 975, DateTimeKind.Utc).AddTicks(3619));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 15, 17, 58, 50, 975, DateTimeKind.Utc).AddTicks(3621));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 15, 17, 58, 50, 975, DateTimeKind.Utc).AddTicks(3622));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 15, 17, 58, 50, 975, DateTimeKind.Utc).AddTicks(3624));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 15, 17, 58, 50, 975, DateTimeKind.Utc).AddTicks(3626));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 15, 17, 58, 50, 975, DateTimeKind.Utc).AddTicks(3627));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 15, 17, 58, 50, 975, DateTimeKind.Utc).AddTicks(3628));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 15, 17, 58, 50, 975, DateTimeKind.Utc).AddTicks(3631));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 15, 17, 58, 50, 975, DateTimeKind.Utc).AddTicks(3632));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 15, 17, 58, 50, 975, DateTimeKind.Utc).AddTicks(3633));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 15, 17, 58, 50, 975, DateTimeKind.Utc).AddTicks(3634));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 15, 17, 58, 50, 975, DateTimeKind.Utc).AddTicks(3636));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 15, 17, 58, 50, 975, DateTimeKind.Utc).AddTicks(3637));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 16,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 15, 17, 58, 50, 975, DateTimeKind.Utc).AddTicks(3638));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 17,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 15, 17, 58, 50, 975, DateTimeKind.Utc).AddTicks(3639));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 18,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 15, 17, 58, 50, 975, DateTimeKind.Utc).AddTicks(3641));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 19,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 15, 17, 58, 50, 975, DateTimeKind.Utc).AddTicks(3643));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "JoinDate", "PasswordHash" },
                values: new object[] { new DateTime(2025, 6, 15, 17, 58, 51, 15, DateTimeKind.Utc).AddTicks(6724), "AQAAAAIAAYagAAAAEJ7/CZl1usa6Oi3yIF7sdlDN9nodeVuF/E/BYaASRUZHO3Bqg6Xe+oPBaSGBXf4XzA==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "JoinDate", "PasswordHash" },
                values: new object[] { new DateTime(2025, 6, 15, 17, 58, 51, 54, DateTimeKind.Utc).AddTicks(3983), "AQAAAAIAAYagAAAAEKVCO6cCTs/H8Xh1w/z4IJpiNxpmP4BX7u3vPiPnyLpZPFG399fDBwfV9HCuAwa+lQ==" });

            migrationBuilder.CreateIndex(
                name: "IX_BlogPosts_AuthorId",
                table: "BlogPosts",
                column: "AuthorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BlogPosts");

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 18, 3, 5, 6, DateTimeKind.Utc).AddTicks(2571));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 18, 3, 5, 6, DateTimeKind.Utc).AddTicks(2583));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 18, 3, 5, 6, DateTimeKind.Utc).AddTicks(2587));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 18, 3, 5, 6, DateTimeKind.Utc).AddTicks(2589));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 18, 3, 5, 6, DateTimeKind.Utc).AddTicks(2591));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 18, 3, 5, 6, DateTimeKind.Utc).AddTicks(2594));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 18, 3, 5, 6, DateTimeKind.Utc).AddTicks(2596));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 18, 3, 5, 6, DateTimeKind.Utc).AddTicks(2597));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 18, 3, 5, 6, DateTimeKind.Utc).AddTicks(2599));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 18, 3, 5, 6, DateTimeKind.Utc).AddTicks(2602));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 18, 3, 5, 6, DateTimeKind.Utc).AddTicks(2603));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 18, 3, 5, 6, DateTimeKind.Utc).AddTicks(2605));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 18, 3, 5, 6, DateTimeKind.Utc).AddTicks(2607));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 18, 3, 5, 6, DateTimeKind.Utc).AddTicks(2608));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 18, 3, 5, 6, DateTimeKind.Utc).AddTicks(2610));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 16,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 18, 3, 5, 6, DateTimeKind.Utc).AddTicks(2612));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 17,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 18, 3, 5, 6, DateTimeKind.Utc).AddTicks(2613));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 18,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 18, 3, 5, 6, DateTimeKind.Utc).AddTicks(2616));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 19,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 10, 18, 3, 5, 6, DateTimeKind.Utc).AddTicks(2619));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "JoinDate", "PasswordHash" },
                values: new object[] { new DateTime(2025, 6, 10, 18, 3, 5, 57, DateTimeKind.Utc).AddTicks(1378), "AQAAAAIAAYagAAAAEPLZ5jkzQX71G5EpdqJL394bBMwtjjkg/Eu6ucjeONMP5CuA4CgWXcujR5jXbvtiew==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "JoinDate", "PasswordHash" },
                values: new object[] { new DateTime(2025, 6, 10, 18, 3, 5, 107, DateTimeKind.Utc).AddTicks(3616), "AQAAAAIAAYagAAAAEA7m4MvD1fA2l0QkmGlRdiES9vXM0GSkxOVcGQvqk3RyThYLiU3q/OmNohcE+PYqkg==" });
        }
    }
}
