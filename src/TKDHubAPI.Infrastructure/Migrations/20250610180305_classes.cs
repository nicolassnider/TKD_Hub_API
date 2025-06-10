using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TKDHubAPI.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class classes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TrainingClasses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DojaangId = table.Column<int>(type: "int", nullable: false),
                    CoachId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingClasses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrainingClasses_Dojaangs_DojaangId",
                        column: x => x.DojaangId,
                        principalTable: "Dojaangs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TrainingClasses_Users_CoachId",
                        column: x => x.CoachId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ClassSchedules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TrainingClassId = table.Column<int>(type: "int", nullable: false),
                    Day = table.Column<int>(type: "int", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassSchedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClassSchedules_TrainingClasses_TrainingClassId",
                        column: x => x.TrainingClassId,
                        principalTable: "TrainingClasses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StudentClasses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    TrainingClassId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    Attended = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentClasses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentClasses_TrainingClasses_TrainingClassId",
                        column: x => x.TrainingClassId,
                        principalTable: "TrainingClasses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentClasses_Users_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_ClassSchedules_TrainingClassId",
                table: "ClassSchedules",
                column: "TrainingClassId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentClasses_StudentId",
                table: "StudentClasses",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentClasses_TrainingClassId",
                table: "StudentClasses",
                column: "TrainingClassId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingClasses_CoachId",
                table: "TrainingClasses",
                column: "CoachId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingClasses_DojaangId",
                table: "TrainingClasses",
                column: "DojaangId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClassSchedules");

            migrationBuilder.DropTable(
                name: "StudentClasses");

            migrationBuilder.DropTable(
                name: "TrainingClasses");

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 8, 15, 28, 6, 505, DateTimeKind.Utc).AddTicks(1526));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 8, 15, 28, 6, 505, DateTimeKind.Utc).AddTicks(1533));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 8, 15, 28, 6, 505, DateTimeKind.Utc).AddTicks(1536));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 8, 15, 28, 6, 505, DateTimeKind.Utc).AddTicks(1538));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 8, 15, 28, 6, 505, DateTimeKind.Utc).AddTicks(1540));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 8, 15, 28, 6, 505, DateTimeKind.Utc).AddTicks(1542));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 8, 15, 28, 6, 505, DateTimeKind.Utc).AddTicks(1544));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 8, 15, 28, 6, 505, DateTimeKind.Utc).AddTicks(1545));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 8, 15, 28, 6, 505, DateTimeKind.Utc).AddTicks(1547));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 8, 15, 28, 6, 505, DateTimeKind.Utc).AddTicks(1549));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 8, 15, 28, 6, 505, DateTimeKind.Utc).AddTicks(1550));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 8, 15, 28, 6, 505, DateTimeKind.Utc).AddTicks(1552));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 8, 15, 28, 6, 505, DateTimeKind.Utc).AddTicks(1553));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 8, 15, 28, 6, 505, DateTimeKind.Utc).AddTicks(1555));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 8, 15, 28, 6, 505, DateTimeKind.Utc).AddTicks(1556));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 16,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 8, 15, 28, 6, 505, DateTimeKind.Utc).AddTicks(1558));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 17,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 8, 15, 28, 6, 505, DateTimeKind.Utc).AddTicks(1559));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 18,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 8, 15, 28, 6, 505, DateTimeKind.Utc).AddTicks(1561));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 19,
                column: "CreatedDate",
                value: new DateTime(2025, 6, 8, 15, 28, 6, 505, DateTimeKind.Utc).AddTicks(1563));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "JoinDate", "PasswordHash" },
                values: new object[] { new DateTime(2025, 6, 8, 15, 28, 6, 547, DateTimeKind.Utc).AddTicks(1048), "AQAAAAIAAYagAAAAEPqGDj2cUH3K2x9WniI02cZsobVtXkdfu7oTdN40/OHjwfQ70vG6bzmroFyUjrBDig==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "JoinDate", "PasswordHash" },
                values: new object[] { new DateTime(2025, 6, 8, 15, 28, 6, 590, DateTimeKind.Utc).AddTicks(819), "AQAAAAIAAYagAAAAEC9jA5U4RS3mzqpvPdvrjhovINaqDDzMEuDEo+gCHwGiOmP4/ck8Ud9bYK16J3MECQ==" });
        }
    }
}
