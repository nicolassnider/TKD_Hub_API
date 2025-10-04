using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TKDHubAPI.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updaterole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Id",
                table: "UserUserRoles");

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 18, 50, 8, 97, DateTimeKind.Utc).AddTicks(6023));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 18, 50, 8, 97, DateTimeKind.Utc).AddTicks(6035));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 18, 50, 8, 97, DateTimeKind.Utc).AddTicks(6039));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 18, 50, 8, 97, DateTimeKind.Utc).AddTicks(6040));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 18, 50, 8, 97, DateTimeKind.Utc).AddTicks(6041));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 18, 50, 8, 97, DateTimeKind.Utc).AddTicks(6044));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 18, 50, 8, 97, DateTimeKind.Utc).AddTicks(6045));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 18, 50, 8, 97, DateTimeKind.Utc).AddTicks(6046));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 18, 50, 8, 97, DateTimeKind.Utc).AddTicks(6091));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 18, 50, 8, 97, DateTimeKind.Utc).AddTicks(6093));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 18, 50, 8, 97, DateTimeKind.Utc).AddTicks(6095));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 18, 50, 8, 97, DateTimeKind.Utc).AddTicks(6096));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 18, 50, 8, 97, DateTimeKind.Utc).AddTicks(6097));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 18, 50, 8, 97, DateTimeKind.Utc).AddTicks(6099));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 18, 50, 8, 97, DateTimeKind.Utc).AddTicks(6100));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 16,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 18, 50, 8, 97, DateTimeKind.Utc).AddTicks(6101));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 17,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 18, 50, 8, 97, DateTimeKind.Utc).AddTicks(6103));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 18,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 18, 50, 8, 97, DateTimeKind.Utc).AddTicks(6105));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 19,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 4, 18, 50, 8, 97, DateTimeKind.Utc).AddTicks(6106));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "JoinDate", "PasswordHash" },
                values: new object[] { new DateTime(2025, 10, 4, 18, 50, 8, 142, DateTimeKind.Utc).AddTicks(5397), "AQAAAAIAAYagAAAAEARExOs/jVoyp9h6RVp9Pq9AKeg7sABERJOtD+OcMzYxJBOuLLw5H3wWIdHdK2To9w==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "JoinDate", "PasswordHash" },
                values: new object[] { new DateTime(2025, 10, 4, 18, 50, 8, 193, DateTimeKind.Utc).AddTicks(8084), "AQAAAAIAAYagAAAAEH/2WfEB5IeykgLIiEZYBd6TrWOQtXvST15uTKxlyNobSJjp9fRGMNp6yuQxF1nxzA==" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "UserUserRoles",
                type: "int",
                nullable: false,
                defaultValue: 0);

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
                table: "UserUserRoles",
                keyColumns: new[] { "UserId", "UserRoleId" },
                keyValues: new object[] { 1, 1 },
                column: "Id",
                value: 1);

            migrationBuilder.UpdateData(
                table: "UserUserRoles",
                keyColumns: new[] { "UserId", "UserRoleId" },
                keyValues: new object[] { 2, 2 },
                column: "Id",
                value: 2);

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
        }
    }
}
