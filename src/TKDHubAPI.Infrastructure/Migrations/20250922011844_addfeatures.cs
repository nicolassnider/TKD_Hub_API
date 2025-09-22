using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TKDHubAPI.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addfeatures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Capacity",
                table: "TrainingClasses",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "TrainingClasses",
                type: "nvarchar(max)",
                nullable: true);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Capacity",
                table: "TrainingClasses");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "TrainingClasses");

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 19, 18, 23, 47, 454, DateTimeKind.Utc).AddTicks(6070));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 19, 18, 23, 47, 454, DateTimeKind.Utc).AddTicks(6079));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 19, 18, 23, 47, 454, DateTimeKind.Utc).AddTicks(6086));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 19, 18, 23, 47, 454, DateTimeKind.Utc).AddTicks(6087));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 19, 18, 23, 47, 454, DateTimeKind.Utc).AddTicks(6089));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 19, 18, 23, 47, 454, DateTimeKind.Utc).AddTicks(6091));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 19, 18, 23, 47, 454, DateTimeKind.Utc).AddTicks(6093));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 19, 18, 23, 47, 454, DateTimeKind.Utc).AddTicks(6094));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 19, 18, 23, 47, 454, DateTimeKind.Utc).AddTicks(6095));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 19, 18, 23, 47, 454, DateTimeKind.Utc).AddTicks(6097));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 19, 18, 23, 47, 454, DateTimeKind.Utc).AddTicks(6098));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 19, 18, 23, 47, 454, DateTimeKind.Utc).AddTicks(6100));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 19, 18, 23, 47, 454, DateTimeKind.Utc).AddTicks(6101));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 19, 18, 23, 47, 454, DateTimeKind.Utc).AddTicks(6103));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 19, 18, 23, 47, 454, DateTimeKind.Utc).AddTicks(6104));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 16,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 19, 18, 23, 47, 454, DateTimeKind.Utc).AddTicks(6105));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 17,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 19, 18, 23, 47, 454, DateTimeKind.Utc).AddTicks(6107));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 18,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 19, 18, 23, 47, 454, DateTimeKind.Utc).AddTicks(6109));

            migrationBuilder.UpdateData(
                table: "Ranks",
                keyColumn: "Id",
                keyValue: 19,
                column: "CreatedDate",
                value: new DateTime(2025, 9, 19, 18, 23, 47, 454, DateTimeKind.Utc).AddTicks(6110));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "JoinDate", "PasswordHash" },
                values: new object[] { new DateTime(2025, 9, 19, 18, 23, 47, 499, DateTimeKind.Utc).AddTicks(7328), "AQAAAAIAAYagAAAAEK907K1YxyiAG+ZdPTAjY5hmUcjfRcFBN2PfwcqRwERq1Ao/TPL+8p85hr/pfg1vpQ==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "JoinDate", "PasswordHash" },
                values: new object[] { new DateTime(2025, 9, 19, 18, 23, 47, 544, DateTimeKind.Utc).AddTicks(6202), "AQAAAAIAAYagAAAAECWfjCzHK5QaWAujIxrMvXORwOTo9TDpFBKSse6VyVC427QYQl65zm4E2cEop7BTtw==" });
        }
    }
}
