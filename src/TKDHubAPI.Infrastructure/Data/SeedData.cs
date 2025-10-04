using Microsoft.AspNetCore.Identity;

namespace TKDHubAPI.Infrastructure.Data;

public static class SeedData
{
    public static IEnumerable<Rank> GetRanks()
    {
        return new List<Rank>
        {
            new Rank
            {
                Id = 1,
                Name = "White Belt",
                Order = 1,
                Description = "Beginner",
                Color = BeltColor.White,
                StripeColor = null,
                DanLevel = null
            },
            new Rank
            {
                Id = 2,
                Name = "White Belt with Yellow Stripe",
                Order = 1,
                Description = "Beginner with yellow stripe",
                Color = BeltColor.White,
                StripeColor = BeltColor.Yellow,
                DanLevel = null
            },
            new Rank
            {
                Id = 3,
                Name = "Yellow Belt",
                Order = 2,
                Description = "Basic fundamentals",
                Color = BeltColor.Yellow,
                StripeColor = null,
                DanLevel = null
            },
            new Rank
            {
                Id = 4,
                Name = "Yellow Belt with Green Stripe",
                Order = 2,
                Description = "Basic fundamentals with green stripe",
                Color = BeltColor.Yellow,
                StripeColor = BeltColor.Green,
                DanLevel = null
            },
            new Rank
            {
                Id = 5,
                Name = "Green Belt",
                Order = 3,
                Description = "Intermediate",
                Color = BeltColor.Green,
                StripeColor = null,
                DanLevel = null
            },
            new Rank
            {
                Id = 6,
                Name = "Green Belt with Blue Stripe",
                Order = 3,
                Description = "Intermediate with blue stripe",
                Color = BeltColor.Green,
                StripeColor = BeltColor.Blue,
                DanLevel = null
            },
            new Rank
            {
                Id = 7,
                Name = "Blue Belt",
                Order = 4,
                Description = "Advanced intermediate",
                Color = BeltColor.Blue,
                StripeColor = null,
                DanLevel = null
            },
            new Rank
            {
                Id = 8,
                Name = "Blue Belt with Red Stripe",
                Order = 4,
                Description = "Advanced intermediate with red stripe",
                Color = BeltColor.Blue,
                StripeColor = BeltColor.Red,
                DanLevel = null
            },
            new Rank
            {
                Id = 9,
                Name = "Red Belt",
                Order = 5,
                Description = "Advanced",
                Color = BeltColor.Red,
                StripeColor = null,
                DanLevel = null
            },
            new Rank
            {
                Id = 10,
                Name = "Red Belt with Black Stripe",
                Order = 5,
                Description = "Advanced with black stripe",
                Color = BeltColor.Red,
                StripeColor = BeltColor.Black,
                DanLevel = null
            },
            // Black Belt Ranks
            new Rank
            {
                Id = 11,
                Name = "Black Belt 1st Dan",
                Order = 6,
                Description = "Il Dan (1st Degree Black Belt)",
                Color = BeltColor.Black,
                StripeColor = null,
                DanLevel = 1
            },
            new Rank
            {
                Id = 12,
                Name = "Black Belt 2nd Dan",
                Order = 7,
                Description = "Ee Dan (2nd Degree) - Boo Sabeom Nim (Assistant Instructor)",
                Color = BeltColor.Black,
                StripeColor = null,
                DanLevel = 2
            },
            new Rank
            {
                Id = 13,
                Name = "Black Belt 3rd Dan",
                Order = 7,
                Description = "Sam Dan (3rd Degree) - Boo Sabeom Nim (Assistant Instructor)",
                Color = BeltColor.Black,
                StripeColor = null,
                DanLevel = 3
            },
            new Rank
            {
                Id = 14,
                Name = "Black Belt 4th Dan",
                Order = 8,
                Description = "Sa Dan (4th Degree) - Sabeom Nim (Instructor)",
                Color = BeltColor.Black,
                StripeColor = null,
                DanLevel = 4
            },
            new Rank
            {
                Id = 15,
                Name = "Black Belt 5th Dan",
                Order = 8,
                Description = "Oh Dan (5th Degree) - Sabeom Nim (Instructor)",
                Color = BeltColor.Black,
                StripeColor = null,
                DanLevel = 5
            },
            new Rank
            {
                Id = 16,
                Name = "Black Belt 6th Dan",
                Order = 8,
                Description = "Yuk Dan (6th Degree) - Sabeom Nim (Instructor)",
                Color = BeltColor.Black,
                StripeColor = null,
                DanLevel = 6
            },
            new Rank
            {
                Id = 17,
                Name = "Black Belt 7th Dan",
                Order = 9,
                Description = "Chil Dan (7th Degree) - Sahyeon Nim (Master Instructor)",
                Color = BeltColor.Black,
                StripeColor = null,
                DanLevel = 7
            },
            new Rank
            {
                Id = 18,
                Name = "Black Belt 8th Dan",
                Order = 9,
                Description = "Pal Dan (8th Degree) - Sahyeon Nim (Master Instructor)",
                Color = BeltColor.Black,
                StripeColor = null,
                DanLevel = 8
            },
            new Rank
            {
                Id = 19,
                Name = "Black Belt 9th Dan",
                Order = 10,
                Description = "Gu Dan (9th Degree) - Saseong Nim (Grandmaster)",
                Color = BeltColor.Black,
                StripeColor = null,
                DanLevel = 9
            }
        };
    }

    public static IEnumerable<Dojaang> GetDojaangs()
    {
        return new List<Dojaang>
        {
            new Dojaang
            {
                Id = 1,
                Name = "Sede Central",
                Address = "Main Street 123",
                Location = "Capital City",
                PhoneNumber = "123456789",
                Email = "central@tkdhub.com",
                KoreanName = "중앙관",
                KoreanNamePhonetic = "Jung-ang Gwan",
                //CoachId = 2 // Grand Master as coach
            }
        };
    }

    public static IEnumerable<UserUserRole> GetUserUserRoles()
    {
        return new List<UserUserRole>
        {
            new UserUserRole { UserId = 1, UserRoleId = 1 }, // Admin
            new UserUserRole { UserId = 2, UserRoleId = 2 } // Grand Master as Coach
        };
    }

    public static IEnumerable<UserDojaang> GetUserDojaangs()
    {
        return new List<UserDojaang>
        {
            new UserDojaang
            {
                Id = 1,
                UserId = 2, // Grand Master
                DojaangId = 1, // Sede Central
                Role = "Coach"
            }
        };
    }

    public static IEnumerable<User> GetUsers()
    {
        var passwordHasher = new PasswordHasher<User>();
        var admin = new User
        {
            Id = 1,
            FirstName = "System",
            LastName = "Administrator",
            Email = "admin@tkdhub.com",
            PasswordHash = passwordHasher.HashPassword(null, "AdminPassword123!"),
            PhoneNumber = "0000000000",
            Gender = Gender.OTHER,
            JoinDate = DateTime.UtcNow
        };

        var grandMaster = new User
        {
            Id = 2,
            FirstName = "Grand",
            LastName = "Master",
            Email = "grandmaster@tkdhub.com",
            PasswordHash = passwordHasher.HashPassword(null, "GrandMasterPassword123!"),
            PhoneNumber = "1112223333",
            Gender = Gender.OTHER,
            DateOfBirth = new DateTime(1960, 1, 1),
            JoinDate = DateTime.UtcNow,
            //DojaangId = 1,
            CurrentRankId = 19
        };

        return new List<User> { admin, grandMaster };
    }

    public static IEnumerable<UserRole> GetUserRoles()
    {
        return new List<UserRole>
        {
            new UserRole { Id = 1, Name = "Admin" },
            new UserRole { Id = 2, Name = "Coach" },
            new UserRole { Id = 3, Name = "Student" }
        };
    }

    public static IEnumerable<Tul> GetTuls()
    {
        return new List<Tul>
        {
            // Color Belt (Gup) Forms
            new Tul
            {
                Id = 1,
                Name = "Four Direction Punch",
                Description = "Basic exercise for 10th gup",
                RecommendedRankId = 1,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            new Tul
            {
                Id = 2,
                Name = "Four Direction Block",
                Description = "Basic exercise for 10th gup",
                RecommendedRankId = 1,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            new Tul
            {
                Id = 3,
                Name = "Chon-Ji",
                Description = "19 movements",
                RecommendedRankId = 2,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            new Tul
            {
                Id = 4,
                Name = "Dan-Gun",
                Description = "21 movements",
                RecommendedRankId = 3,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            new Tul
            {
                Id = 5,
                Name = "Do-San",
                Description = "24 movements",
                RecommendedRankId = 4,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            new Tul
            {
                Id = 6,
                Name = "Won-Hyo",
                Description = "28 movements",
                RecommendedRankId = 5,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            new Tul
            {
                Id = 7,
                Name = "Yul-Gok",
                Description = "38 movements",
                RecommendedRankId = 6,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            new Tul
            {
                Id = 8,
                Name = "Joong-Gun",
                Description = "32 movements",
                RecommendedRankId = 7,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            new Tul
            {
                Id = 9,
                Name = "Toi-Gye",
                Description = "37 movements",
                RecommendedRankId = 8,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            new Tul
            {
                Id = 10,
                Name = "Hwa-Rang",
                Description = "29 movements",
                RecommendedRankId = 9,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            new Tul
            {
                Id = 11,
                Name = "Choong-Moo",
                Description = "30 movements",
                RecommendedRankId = 10,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            // Black Belt (Dan) Patterns
            // 1st Dan
            new Tul
            {
                Id = 12,
                Name = "Kwang-Gae",
                Description = "Kwang-Gae (39 movements)",
                RecommendedRankId = 11,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            new Tul
            {
                Id = 13,
                Name = "Po-Eun",
                Description = "Po-Eun (36 movements)",
                RecommendedRankId = 11,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            new Tul
            {
                Id = 14,
                Name = "Ge-Baek",
                Description = "Ge-Baek (44 movements)",
                RecommendedRankId = 11,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            // 2nd Dan
            new Tul
            {
                Id = 15,
                Name = "Eui-Am",
                Description = "Eui-Am (45 movements)",
                RecommendedRankId = 12,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            new Tul
            {
                Id = 16,
                Name = "Choong-Jang",
                Description = "Choong-Jang (52 movements)",
                RecommendedRankId = 12,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            new Tul
            {
                Id = 17,
                Name = "Juche",
                Description = "Juche (45 movements)",
                RecommendedRankId = 12,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            new Tul
            {
                Id = 18,
                Name = "Ko-Dang",
                Description = "Ko-Dang* (39 movements)",
                RecommendedRankId = 12,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            // 3rd Dan
            new Tul
            {
                Id = 19,
                Name = "Sam-Il",
                Description = "Sam-Il (33 movements)",
                RecommendedRankId = 13,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            new Tul
            {
                Id = 20,
                Name = "Yoo-Sin",
                Description = "Yoo-Sin (68 movements)",
                RecommendedRankId = 13,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            new Tul
            {
                Id = 21,
                Name = "Choi-Yong",
                Description = "Choi-Yong (46 movements)",
                RecommendedRankId = 13,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            // 4th Dan
            new Tul
            {
                Id = 22,
                Name = "Yon-Gae",
                Description = "Yon-Gae (49 movements)",
                RecommendedRankId = 14,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            new Tul
            {
                Id = 23,
                Name = "Ul-Ji",
                Description = "Ul-Ji (42 movements)",
                RecommendedRankId = 14,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            new Tul
            {
                Id = 24,
                Name = "Moon-Moo",
                Description = "Moon-Moo (61 movements)",
                RecommendedRankId = 14,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            // 5th Dan
            new Tul
            {
                Id = 25,
                Name = "So-San",
                Description = "So-San (72 movements)",
                RecommendedRankId = 15,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            new Tul
            {
                Id = 26,
                Name = "Se-Jong",
                Description = "Se-Jong (24 movements)",
                RecommendedRankId = 15,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            },
            // 6th Dan
            new Tul
            {
                Id = 27,
                Name = "Tong-Il",
                Description = "Tong-Il (56 movements)",
                RecommendedRankId = 16,
                VideoUrl = new Uri("https://example.com"),
                ImageUrl = new Uri("https://example.com")
            }
        };
    }
}
