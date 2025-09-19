using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TKDHubAPI.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class checkMigrations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                columns: new[] { "CurrentRankId", "JoinDate", "PasswordHash" },
                values: new object[] { 19, new DateTime(2025, 9, 19, 18, 23, 47, 544, DateTimeKind.Utc).AddTicks(6202), "AQAAAAIAAYagAAAAECWfjCzHK5QaWAujIxrMvXORwOTo9TDpFBKSse6VyVC427QYQl65zm4E2cEop7BTtw==" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
                columns: new[] { "CurrentRankId", "JoinDate", "PasswordHash" },
                values: new object[] { 11, new DateTime(2025, 6, 25, 20, 56, 0, 809, DateTimeKind.Utc).AddTicks(2771), "AQAAAAIAAYagAAAAEIbL0atfyTZ255f6ozfErVlJyiECBJSDvh2rWw31+QBGi2NOJsI/diXc1NX6l47ARw==" });
        }
    }
}
