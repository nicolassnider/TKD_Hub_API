using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TKDHubAPI.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addDashboard : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DashboardLayouts",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    UserRole = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    IsDefault = table.Column<bool>(type: "bit", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DashboardLayouts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Widgets",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    X = table.Column<int>(type: "int", nullable: false),
                    Y = table.Column<int>(type: "int", nullable: false),
                    Width = table.Column<int>(type: "int", nullable: false),
                    Height = table.Column<int>(type: "int", nullable: false),
                    ConfigJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DashboardLayoutId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Widgets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Widgets_DashboardLayouts_DashboardLayoutId",
                        column: x => x.DashboardLayoutId,
                        principalTable: "DashboardLayouts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 2, 32, 43, 168, DateTimeKind.Utc).AddTicks(5481));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 2, 32, 43, 168, DateTimeKind.Utc).AddTicks(5488));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 2, 32, 43, 168, DateTimeKind.Utc).AddTicks(5491));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 2, 32, 43, 168, DateTimeKind.Utc).AddTicks(5493));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 2, 32, 43, 168, DateTimeKind.Utc).AddTicks(5495));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 2, 32, 43, 168, DateTimeKind.Utc).AddTicks(5497));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 2, 32, 43, 168, DateTimeKind.Utc).AddTicks(5499));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 2, 32, 43, 168, DateTimeKind.Utc).AddTicks(5500));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 2, 32, 43, 168, DateTimeKind.Utc).AddTicks(5502));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 2, 32, 43, 168, DateTimeKind.Utc).AddTicks(5534));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 2, 32, 43, 168, DateTimeKind.Utc).AddTicks(5536));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 2, 32, 43, 168, DateTimeKind.Utc).AddTicks(5537));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 2, 32, 43, 168, DateTimeKind.Utc).AddTicks(5539));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 2, 32, 43, 168, DateTimeKind.Utc).AddTicks(5540));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 2, 32, 43, 168, DateTimeKind.Utc).AddTicks(5542));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 16,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 2, 32, 43, 168, DateTimeKind.Utc).AddTicks(5543));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 17,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 2, 32, 43, 168, DateTimeKind.Utc).AddTicks(5545));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 18,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 2, 32, 43, 168, DateTimeKind.Utc).AddTicks(5547));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 19,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 2, 32, 43, 168, DateTimeKind.Utc).AddTicks(5548));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "JoinDate", "PasswordHash" },
                values: new object[] { new DateTime(2025, 10, 4, 2, 32, 43, 214, DateTimeKind.Utc).AddTicks(258), "AQAAAAIAAYagAAAAENhhQK4iTWsNibMubKjE0uW63GkyoBbhGUvmRiN0+jhzvtOO5fzVC4609OOkVnKIAg==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "JoinDate", "PasswordHash" },
                values: new object[] { new DateTime(2025, 10, 4, 2, 32, 43, 256, DateTimeKind.Utc).AddTicks(9354), "AQAAAAIAAYagAAAAEGd460qY52QuWLr2xy2YumtOt6xkJO38BjpXyPlUzNrUSihfp/TpmDupkzSE6z6ogw==" });

            migrationBuilder.CreateIndex(
                name: "IX_Widgets_DashboardLayoutId",
                table: "Widgets",
                column: "DashboardLayoutId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Widgets");

            migrationBuilder.DropTable(
                name: "DashboardLayouts");

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 22, 1, 18, 44, 145, DateTimeKind.Utc).AddTicks(8611));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 22, 1, 18, 44, 145, DateTimeKind.Utc).AddTicks(8618));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 22, 1, 18, 44, 145, DateTimeKind.Utc).AddTicks(8621));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 22, 1, 18, 44, 145, DateTimeKind.Utc).AddTicks(8623));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 22, 1, 18, 44, 145, DateTimeKind.Utc).AddTicks(8624));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 22, 1, 18, 44, 145, DateTimeKind.Utc).AddTicks(8626));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 22, 1, 18, 44, 145, DateTimeKind.Utc).AddTicks(8627));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 22, 1, 18, 44, 145, DateTimeKind.Utc).AddTicks(8629));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 22, 1, 18, 44, 145, DateTimeKind.Utc).AddTicks(8675));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 22, 1, 18, 44, 145, DateTimeKind.Utc).AddTicks(8678));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 22, 1, 18, 44, 145, DateTimeKind.Utc).AddTicks(8679));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 22, 1, 18, 44, 145, DateTimeKind.Utc).AddTicks(8680));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 22, 1, 18, 44, 145, DateTimeKind.Utc).AddTicks(8682));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 22, 1, 18, 44, 145, DateTimeKind.Utc).AddTicks(8683));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 22, 1, 18, 44, 145, DateTimeKind.Utc).AddTicks(8684));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 16,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 22, 1, 18, 44, 145, DateTimeKind.Utc).AddTicks(8685));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 17,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 22, 1, 18, 44, 145, DateTimeKind.Utc).AddTicks(8686));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 18,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 22, 1, 18, 44, 145, DateTimeKind.Utc).AddTicks(8688));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 19,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 22, 1, 18, 44, 145, DateTimeKind.Utc).AddTicks(8689));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "JoinDate", "PasswordHash" },
                values: new object[] { new DateTime(2025, 9, 22, 1, 18, 44, 184, DateTimeKind.Utc).AddTicks(8907), "AQAAAAIAAYagAAAAEI/MonHmDJGjKu0Bc39qtXVXqtfLdJ8hrjoF4foQoUz9EeD2u34Sb42FqLhzLo1bmw==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "JoinDate", "PasswordHash" },
                values: new object[] { new DateTime(2025, 9, 22, 1, 18, 44, 222, DateTimeKind.Utc).AddTicks(2202), "AQAAAAIAAYagAAAAEJgLH3gT4pE0jKyMYtC601MKd970RVdKLdZWVpkHAoh0ryNPJqPQH/byM4S5YCHpKA==" });
        }
    }
}
