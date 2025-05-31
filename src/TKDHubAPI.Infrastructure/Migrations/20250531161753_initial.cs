using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TKDHubAPI.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EntityId = table.Column<int>(type: "int", nullable: true),
                    Operation = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Changes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EntityName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Ranks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Color = table.Column<int>(type: "int", nullable: false),
                    StripeColor = table.Column<int>(type: "int", nullable: true),
                    DanLevel = table.Column<int>(type: "int", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ranks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Techniques",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    RecommendedRankId = table.Column<int>(type: "int", nullable: false),
                    VideoUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Techniques", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tuls",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    RecommendedRankId = table.Column<int>(type: "int", nullable: false),
                    VideoUrl = table.Column<string>(type: "nvarchar(2048)", maxLength: 2048, nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(2048)", maxLength: 2048, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tuls", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tuls_Ranks_RecommendedRankId",
                        column: x => x.RecommendedRankId,
                        principalTable: "Ranks",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TulTechniques",
                columns: table => new
                {
                    TulId = table.Column<int>(type: "int", nullable: false),
                    TechniqueId = table.Column<int>(type: "int", nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TulTechniques", x => new { x.TulId, x.TechniqueId });
                    table.ForeignKey(
                        name: "FK_TulTechniques_Techniques_TechniqueId",
                        column: x => x.TechniqueId,
                        principalTable: "Techniques",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TulTechniques_Tuls_TulId",
                        column: x => x.TulId,
                        principalTable: "Tuls",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Dojaangs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Location = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    KoreanName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    KoreanNamePhonetic = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    CoachId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dojaangs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tournaments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Organizer = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    DojaangId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tournaments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tournaments_Dojaangs_DojaangId",
                        column: x => x.DojaangId,
                        principalTable: "Dojaangs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    DojaangId = table.Column<int>(type: "int", nullable: true),
                    CurrentRankId = table.Column<int>(type: "int", nullable: true),
                    JoinDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_Dojaangs_DojaangId",
                        column: x => x.DojaangId,
                        principalTable: "Dojaangs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Users_Ranks_CurrentRankId",
                        column: x => x.CurrentRankId,
                        principalTable: "Ranks",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Events",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CoachId = table.Column<int>(type: "int", nullable: true),
                    DojaangId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Events", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Events_Dojaangs_DojaangId",
                        column: x => x.DojaangId,
                        principalTable: "Dojaangs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Events_Users_CoachId",
                        column: x => x.CoachId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Matches",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TournamentId = table.Column<int>(type: "int", nullable: false),
                    RedCornerStudentId = table.Column<int>(type: "int", nullable: false),
                    BlueCornerStudentId = table.Column<int>(type: "int", nullable: false),
                    WinnerStudentId = table.Column<int>(type: "int", nullable: true),
                    ScoreRed = table.Column<int>(type: "int", nullable: false),
                    ScoreBlue = table.Column<int>(type: "int", nullable: false),
                    Round = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    MatchDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DojaangId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Matches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Matches_Dojaangs_DojaangId",
                        column: x => x.DojaangId,
                        principalTable: "Dojaangs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Matches_Tournaments_TournamentId",
                        column: x => x.TournamentId,
                        principalTable: "Tournaments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Matches_Users_BlueCornerStudentId",
                        column: x => x.BlueCornerStudentId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matches_Users_RedCornerStudentId",
                        column: x => x.RedCornerStudentId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matches_Users_WinnerStudentId",
                        column: x => x.WinnerStudentId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Promotions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    RankId = table.Column<int>(type: "int", nullable: false),
                    PromotionDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CoachId = table.Column<int>(type: "int", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DojaangId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Promotions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Promotions_Dojaangs_DojaangId",
                        column: x => x.DojaangId,
                        principalTable: "Dojaangs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Promotions_Ranks_RankId",
                        column: x => x.RankId,
                        principalTable: "Ranks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Promotions_Users_CoachId",
                        column: x => x.CoachId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Promotions_Users_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TournamentRegistrations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TournamentId = table.Column<int>(type: "int", nullable: false),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    RegistrationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TournamentRegistrations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TournamentRegistrations_Tournaments_TournamentId",
                        column: x => x.TournamentId,
                        principalTable: "Tournaments",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_TournamentRegistrations_Users_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "UserDojaangs",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    DojaangId = table.Column<int>(type: "int", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserDojaangs", x => new { x.UserId, x.DojaangId });
                    table.ForeignKey(
                        name: "FK_UserDojaangs_Dojaangs_DojaangId",
                        column: x => x.DojaangId,
                        principalTable: "Dojaangs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserDojaangs_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserUserRoles",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    UserRoleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserUserRoles", x => new { x.UserId, x.UserRoleId });
                    table.ForeignKey(
                        name: "FK_UserUserRoles_UserRoles_UserRoleId",
                        column: x => x.UserRoleId,
                        principalTable: "UserRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserUserRoles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EventAttendances",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EventId = table.Column<int>(type: "int", nullable: false),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    AttendanceDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AttendanceTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventAttendances", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventAttendances_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_EventAttendances_Users_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.InsertData(
                table: "Dojaangs",
                columns: new[] { "Id", "Address", "CoachId", "Email", "KoreanName", "KoreanNamePhonetic", "Location", "Name", "PhoneNumber" },
                values: new object[] { 1, "Main Street 123", null, "central@tkdhub.com", "중앙관", "Jung-ang Gwan", "Capital City", "Sede Central", "123456789" });

            migrationBuilder.InsertData(
                table: "Ranks",
                columns: new[] { "Id", "Color", "CreatedDate", "DanLevel", "Description", "Name", "Order", "StripeColor" },
                values: new object[,]
                {
                    { 1, 0, new DateTime(2025, 5, 31, 16, 17, 52, 604, DateTimeKind.Utc).AddTicks(3756), null, "Beginner", "White Belt", 1, null },
                    { 2, 0, new DateTime(2025, 5, 31, 16, 17, 52, 604, DateTimeKind.Utc).AddTicks(3762), null, "Beginner with yellow stripe", "White Belt with Yellow Stripe", 1, 1 },
                    { 3, 1, new DateTime(2025, 5, 31, 16, 17, 52, 604, DateTimeKind.Utc).AddTicks(3764), null, "Basic fundamentals", "Yellow Belt", 2, null },
                    { 4, 1, new DateTime(2025, 5, 31, 16, 17, 52, 604, DateTimeKind.Utc).AddTicks(3766), null, "Basic fundamentals with green stripe", "Yellow Belt with Green Stripe", 2, 2 },
                    { 5, 2, new DateTime(2025, 5, 31, 16, 17, 52, 604, DateTimeKind.Utc).AddTicks(3799), null, "Intermediate", "Green Belt", 3, null },
                    { 6, 2, new DateTime(2025, 5, 31, 16, 17, 52, 604, DateTimeKind.Utc).AddTicks(3801), null, "Intermediate with blue stripe", "Green Belt with Blue Stripe", 3, 3 },
                    { 7, 3, new DateTime(2025, 5, 31, 16, 17, 52, 604, DateTimeKind.Utc).AddTicks(3803), null, "Advanced intermediate", "Blue Belt", 4, null },
                    { 8, 3, new DateTime(2025, 5, 31, 16, 17, 52, 604, DateTimeKind.Utc).AddTicks(3804), null, "Advanced intermediate with red stripe", "Blue Belt with Red Stripe", 4, 4 },
                    { 9, 4, new DateTime(2025, 5, 31, 16, 17, 52, 604, DateTimeKind.Utc).AddTicks(3806), null, "Advanced", "Red Belt", 5, null },
                    { 10, 4, new DateTime(2025, 5, 31, 16, 17, 52, 604, DateTimeKind.Utc).AddTicks(3808), null, "Advanced with black stripe", "Red Belt with Black Stripe", 5, 5 },
                    { 11, 5, new DateTime(2025, 5, 31, 16, 17, 52, 604, DateTimeKind.Utc).AddTicks(3810), 1, "Il Dan (1st Degree Black Belt)", "Black Belt 1st Dan", 6, null },
                    { 12, 5, new DateTime(2025, 5, 31, 16, 17, 52, 604, DateTimeKind.Utc).AddTicks(3812), 2, "Ee Dan (2nd Degree) - Boo Sabeom Nim (Assistant Instructor)", "Black Belt 2nd Dan", 7, null },
                    { 13, 5, new DateTime(2025, 5, 31, 16, 17, 52, 604, DateTimeKind.Utc).AddTicks(3814), 3, "Sam Dan (3rd Degree) - Boo Sabeom Nim (Assistant Instructor)", "Black Belt 3rd Dan", 7, null },
                    { 14, 5, new DateTime(2025, 5, 31, 16, 17, 52, 604, DateTimeKind.Utc).AddTicks(3817), 4, "Sa Dan (4th Degree) - Sabeom Nim (Instructor)", "Black Belt 4th Dan", 8, null },
                    { 15, 5, new DateTime(2025, 5, 31, 16, 17, 52, 604, DateTimeKind.Utc).AddTicks(3819), 5, "Oh Dan (5th Degree) - Sabeom Nim (Instructor)", "Black Belt 5th Dan", 8, null },
                    { 16, 5, new DateTime(2025, 5, 31, 16, 17, 52, 604, DateTimeKind.Utc).AddTicks(3820), 6, "Yuk Dan (6th Degree) - Sabeom Nim (Instructor)", "Black Belt 6th Dan", 8, null },
                    { 17, 5, new DateTime(2025, 5, 31, 16, 17, 52, 604, DateTimeKind.Utc).AddTicks(3822), 7, "Chil Dan (7th Degree) - Sahyeon Nim (Master Instructor)", "Black Belt 7th Dan", 9, null },
                    { 18, 5, new DateTime(2025, 5, 31, 16, 17, 52, 604, DateTimeKind.Utc).AddTicks(3824), 8, "Pal Dan (8th Degree) - Sahyeon Nim (Master Instructor)", "Black Belt 8th Dan", 9, null },
                    { 19, 5, new DateTime(2025, 5, 31, 16, 17, 52, 604, DateTimeKind.Utc).AddTicks(3825), 9, "Gu Dan (9th Degree) - Saseong Nim (Grandmaster)", "Black Belt 9th Dan", 10, null }
                });

            migrationBuilder.InsertData(
                table: "UserRoles",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Admin" },
                    { 2, "Coach" },
                    { 3, "Student" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CurrentRankId", "DateOfBirth", "DojaangId", "Email", "FirstName", "Gender", "JoinDate", "LastName", "PasswordHash", "PhoneNumber" },
                values: new object[] { 1, null, null, null, "admin@tkdhub.com", "System", "OTHER", new DateTime(2025, 5, 31, 16, 17, 52, 647, DateTimeKind.Utc).AddTicks(4041), "Administrator", "AQAAAAIAAYagAAAAEHNwAfBGFuigaoA1+IkHqZauHQgSu05jsx/9yAROCxzVhWHITzB9KMIsZShzfzZciw==", "0000000000" });

            migrationBuilder.InsertData(
                table: "Tuls",
                columns: new[] { "Id", "Description", "ImageUrl", "Name", "RecommendedRankId", "VideoUrl" },
                values: new object[,]
                {
                    { 1, "Basic exercise for 10th gup", "https://example.com/", "Four Direction Punch", 1, "https://example.com/" },
                    { 2, "Basic exercise for 10th gup", "https://example.com/", "Four Direction Block", 1, "https://example.com/" },
                    { 3, "19 movements", "https://example.com/", "Chon-Ji", 2, "https://example.com/" },
                    { 4, "21 movements", "https://example.com/", "Dan-Gun", 3, "https://example.com/" },
                    { 5, "24 movements", "https://example.com/", "Do-San", 4, "https://example.com/" },
                    { 6, "28 movements", "https://example.com/", "Won-Hyo", 5, "https://example.com/" },
                    { 7, "38 movements", "https://example.com/", "Yul-Gok", 6, "https://example.com/" },
                    { 8, "32 movements", "https://example.com/", "Joong-Gun", 7, "https://example.com/" },
                    { 9, "37 movements", "https://example.com/", "Toi-Gye", 8, "https://example.com/" },
                    { 10, "29 movements", "https://example.com/", "Hwa-Rang", 9, "https://example.com/" },
                    { 11, "30 movements", "https://example.com/", "Choong-Moo", 10, "https://example.com/" },
                    { 13, "Kwang-Gae (39 movements)", "https://example.com/", "Kwang-Gae", 11, "https://example.com/" },
                    { 14, "Po-Eun (36 movements)", "https://example.com/", "Po-Eun", 11, "https://example.com/" },
                    { 15, "Ge-Baek (44 movements)", "https://example.com/", "Ge-Baek", 11, "https://example.com/" },
                    { 16, "Eui-Am (45 movements)", "https://example.com/", "Eui-Am", 12, "https://example.com/" },
                    { 17, "Choong-Jang (52 movements)", "https://example.com/", "Choong-Jang", 12, "https://example.com/" },
                    { 18, "Juche (45 movements)", "https://example.com/", "Juche", 12, "https://example.com/" },
                    { 19, "Ko-Dang* (39 movements)", "https://example.com/", "Ko-Dang", 12, "https://example.com/" },
                    { 20, "Sam-Il (33 movements)", "https://example.com/", "Sam-Il", 13, "https://example.com/" },
                    { 21, "Yoo-Sin (68 movements)", "https://example.com/", "Yoo-Sin", 13, "https://example.com/" },
                    { 22, "Choi-Yong (46 movements)", "https://example.com/", "Choi-Yong", 13, "https://example.com/" },
                    { 23, "Yon-Gae (49 movements)", "https://example.com/", "Yon-Gae", 14, "https://example.com/" },
                    { 24, "Ul-Ji (42 movements)", "https://example.com/", "Ul-Ji", 14, "https://example.com/" },
                    { 25, "Moon-Moo (61 movements)", "https://example.com/", "Moon-Moo", 14, "https://example.com/" },
                    { 26, "So-San (72 movements)", "https://example.com/", "So-San", 15, "https://example.com/" },
                    { 27, "Se-Jong (24 movements)", "https://example.com/", "Se-Jong", 15, "https://example.com/" },
                    { 28, "Tong-Il (56 movements)", "https://example.com/", "Tong-Il", 16, "https://example.com/" }
                });

            migrationBuilder.InsertData(
                table: "UserUserRoles",
                columns: new[] { "UserId", "UserRoleId" },
                values: new object[] { 1, 1 });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CurrentRankId", "DateOfBirth", "DojaangId", "Email", "FirstName", "Gender", "JoinDate", "LastName", "PasswordHash", "PhoneNumber" },
                values: new object[] { 2, 11, new DateTime(1960, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "grandmaster@tkdhub.com", "Grand", "OTHER", new DateTime(2025, 5, 31, 16, 17, 52, 687, DateTimeKind.Utc).AddTicks(1906), "Master", "AQAAAAIAAYagAAAAEKRzozr4G3pmr4mR9MCNBEwB7u0XiAShYvo0sqHrK9O9gmv/AqCfovQLfvHYtkIWYw==", "1112223333" });

            migrationBuilder.InsertData(
                table: "UserDojaangs",
                columns: new[] { "DojaangId", "UserId", "Role" },
                values: new object[] { 1, 2, "Coach" });

            migrationBuilder.InsertData(
                table: "UserUserRoles",
                columns: new[] { "UserId", "UserRoleId" },
                values: new object[] { 2, 2 });

            migrationBuilder.CreateIndex(
                name: "IX_Dojaangs_CoachId",
                table: "Dojaangs",
                column: "CoachId");

            migrationBuilder.CreateIndex(
                name: "IX_EventAttendances_EventId",
                table: "EventAttendances",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_EventAttendances_StudentId",
                table: "EventAttendances",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Events_CoachId",
                table: "Events",
                column: "CoachId");

            migrationBuilder.CreateIndex(
                name: "IX_Events_DojaangId",
                table: "Events",
                column: "DojaangId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_BlueCornerStudentId",
                table: "Matches",
                column: "BlueCornerStudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_DojaangId",
                table: "Matches",
                column: "DojaangId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_RedCornerStudentId",
                table: "Matches",
                column: "RedCornerStudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_TournamentId",
                table: "Matches",
                column: "TournamentId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_WinnerStudentId",
                table: "Matches",
                column: "WinnerStudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Promotions_CoachId",
                table: "Promotions",
                column: "CoachId");

            migrationBuilder.CreateIndex(
                name: "IX_Promotions_DojaangId",
                table: "Promotions",
                column: "DojaangId");

            migrationBuilder.CreateIndex(
                name: "IX_Promotions_RankId",
                table: "Promotions",
                column: "RankId");

            migrationBuilder.CreateIndex(
                name: "IX_Promotions_StudentId",
                table: "Promotions",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_TournamentRegistrations_StudentId",
                table: "TournamentRegistrations",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_TournamentRegistrations_TournamentId",
                table: "TournamentRegistrations",
                column: "TournamentId");

            migrationBuilder.CreateIndex(
                name: "IX_Tournaments_DojaangId",
                table: "Tournaments",
                column: "DojaangId");

            migrationBuilder.CreateIndex(
                name: "IX_Tuls_RecommendedRankId",
                table: "Tuls",
                column: "RecommendedRankId");

            migrationBuilder.CreateIndex(
                name: "IX_TulTechniques_TechniqueId",
                table: "TulTechniques",
                column: "TechniqueId");

            migrationBuilder.CreateIndex(
                name: "IX_UserDojaangs_DojaangId",
                table: "UserDojaangs",
                column: "DojaangId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_CurrentRankId",
                table: "Users",
                column: "CurrentRankId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_DojaangId",
                table: "Users",
                column: "DojaangId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserUserRoles_UserRoleId",
                table: "UserUserRoles",
                column: "UserRoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Dojaangs_Users_CoachId",
                table: "Dojaangs",
                column: "CoachId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dojaangs_Users_CoachId",
                table: "Dojaangs");

            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "EventAttendances");

            migrationBuilder.DropTable(
                name: "Matches");

            migrationBuilder.DropTable(
                name: "Promotions");

            migrationBuilder.DropTable(
                name: "TournamentRegistrations");

            migrationBuilder.DropTable(
                name: "TulTechniques");

            migrationBuilder.DropTable(
                name: "UserDojaangs");

            migrationBuilder.DropTable(
                name: "UserUserRoles");

            migrationBuilder.DropTable(
                name: "Events");

            migrationBuilder.DropTable(
                name: "Tournaments");

            migrationBuilder.DropTable(
                name: "Techniques");

            migrationBuilder.DropTable(
                name: "Tuls");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Dojaangs");

            migrationBuilder.DropTable(
                name: "Ranks");
        }
    }
}
