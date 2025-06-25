using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TKDHubAPI.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class attendance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StudentClassAttendances",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentClassId = table.Column<int>(type: "int", nullable: false),
                    AttendedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentClassAttendances", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentClassAttendances_StudentClasses_StudentClassId",
                        column: x => x.StudentClassId,
                        principalTable: "StudentClasses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 25, 20, 56, 0, 694, DateTimeKind.Utc).AddTicks(2144));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 25, 20, 56, 0, 694, DateTimeKind.Utc).AddTicks(2152));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 25, 20, 56, 0, 694, DateTimeKind.Utc).AddTicks(2156));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 25, 20, 56, 0, 694, DateTimeKind.Utc).AddTicks(2159));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 25, 20, 56, 0, 694, DateTimeKind.Utc).AddTicks(2161));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 25, 20, 56, 0, 694, DateTimeKind.Utc).AddTicks(2165));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 25, 20, 56, 0, 694, DateTimeKind.Utc).AddTicks(2167));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 25, 20, 56, 0, 694, DateTimeKind.Utc).AddTicks(2169));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 25, 20, 56, 0, 694, DateTimeKind.Utc).AddTicks(2171));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 25, 20, 56, 0, 694, DateTimeKind.Utc).AddTicks(2173));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 25, 20, 56, 0, 694, DateTimeKind.Utc).AddTicks(2175));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 25, 20, 56, 0, 694, DateTimeKind.Utc).AddTicks(2177));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 25, 20, 56, 0, 694, DateTimeKind.Utc).AddTicks(2179));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 25, 20, 56, 0, 694, DateTimeKind.Utc).AddTicks(2181));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 25, 20, 56, 0, 694, DateTimeKind.Utc).AddTicks(2183));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 16,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 25, 20, 56, 0, 694, DateTimeKind.Utc).AddTicks(2185));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 17,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 25, 20, 56, 0, 694, DateTimeKind.Utc).AddTicks(2187));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 18,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 25, 20, 56, 0, 694, DateTimeKind.Utc).AddTicks(2190));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 19,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 25, 20, 56, 0, 694, DateTimeKind.Utc).AddTicks(2192));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "JoinDate", "PasswordHash" },
                values: new object[] { new DateTime(2025, 6, 25, 20, 56, 0, 751, DateTimeKind.Utc).AddTicks(6555), "AQAAAAIAAYagAAAAEHXLdhxmtFVkbMjBrhiafD/F76cbOECFpZVzX5TDstym7Cr8JypyEwMeb1cokDu/xg==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "JoinDate", "PasswordHash" },
                values: new object[] { new DateTime(2025, 6, 25, 20, 56, 0, 809, DateTimeKind.Utc).AddTicks(2771), "AQAAAAIAAYagAAAAEIbL0atfyTZ255f6ozfErVlJyiECBJSDvh2rWw31+QBGi2NOJsI/diXc1NX6l47ARw==" });

            migrationBuilder.CreateIndex(
                name: "IX_StudentClassAttendances_StudentClassId",
                table: "StudentClassAttendances",
                column: "StudentClassId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StudentClassAttendances");

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
        }
    }
}
