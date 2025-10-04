-- Taekwondo Techniques Sample Data
-- This file creates sample techniques covering basic to advanced movements
-- Includes kicks, punches, blocks, and stances with difficulty progression

USE [TKDHubDb]
GO

PRINT 'Inserting Taekwondo techniques sample data...';

-- Insert fundamental techniques
INSERT INTO [dbo].[Techniques] ([Name], [Description], [Type], [RecommendedRankId], [ImageUrl], [VideoUrl])
VALUES
-- Basic Stances (White Belt - Yellow Belt)
('Charyot Sogi', 'Attention stance with feet together, hands at sides', 0, 1, 'https://example.com/stances/charyot.jpg', 'https://example.com/videos/charyot'),
('Narani Sogi', 'Parallel stance with feet shoulder-width apart', 0, 1, 'https://example.com/stances/narani.jpg', 'https://example.com/videos/narani'),
('Ap Sogi', 'Walking stance - front stance for forward movement', 0, 2, 'https://example.com/stances/ap.jpg', 'https://example.com/videos/ap'),
('Dwit Sogi', 'L-stance - back stance for defensive positions', 0, 3, 'https://example.com/stances/dwit.jpg', 'https://example.com/videos/dwit'),

-- Basic Blocks (White Belt - Yellow Belt)
('Najunde Makgi', 'Low block - protects lower body from attacks', 1, 1, 'https://example.com/blocks/najunde.jpg', 'https://example.com/videos/najunde'),
('Kaunde Makgi', 'Middle block - protects middle section', 1, 2, 'https://example.com/blocks/kaunde.jpg', 'https://example.com/videos/kaunde'),
('Nopunde Makgi', 'High block - protects head and upper body', 1, 2, 'https://example.com/blocks/nopunde.jpg', 'https://example.com/videos/nopunde'),
('Palmok Daebi Makgi', 'Twin forearm block - double protection', 1, 4, 'https://example.com/blocks/palmok.jpg', 'https://example.com/videos/palmok'),

-- Basic Punches (White Belt - Green Belt)
('Ap Joomuk Jirugi', 'Straight punch with front fist', 2, 1, 'https://example.com/punches/ap_joomuk.jpg', 'https://example.com/videos/ap_joomuk'),
('Yop Joomuk Jirugi', 'Side punch with horizontal fist', 2, 3, 'https://example.com/punches/yop_joomuk.jpg', 'https://example.com/videos/yop_joomuk'),
('Sang Joomuk Jirugi', 'Twin fist punch - both hands simultaneously', 2, 5, 'https://example.com/punches/sang_joomuk.jpg', 'https://example.com/videos/sang_joomuk'),

-- Basic Kicks (White Belt - Blue Belt)
('Ap Chagi', 'Front kick - straight forward kick with ball of foot', 3, 2, 'https://example.com/kicks/ap_chagi.jpg', 'https://example.com/videos/ap_chagi'),
('Dollyo Chagi', 'Turning kick - circular kick with instep', 3, 4, 'https://example.com/kicks/dollyo.jpg', 'https://example.com/videos/dollyo'),
('Yop Chagi', 'Side kick - powerful lateral kick with foot blade', 3, 5, 'https://example.com/kicks/yop_chagi.jpg', 'https://example.com/videos/yop_chagi'),
('Dwit Chagi', 'Back kick - reverse kick with heel', 3, 6, 'https://example.com/kicks/dwit_chagi.jpg', 'https://example.com/videos/dwit_chagi'),
('Naeryo Chagi', 'Axe kick - downward striking kick', 3, 7, 'https://example.com/kicks/naeryo.jpg', 'https://example.com/videos/naeryo'),

-- Intermediate Kicks (Blue Belt - Red Belt)
('Twio Ap Chagi', 'Jumping front kick - airborne front kick', 3, 8, 'https://example.com/kicks/twio_ap.jpg', 'https://example.com/videos/twio_ap'),
('Twio Dollyo Chagi', 'Jumping turning kick - aerial roundhouse', 3, 8, 'https://example.com/kicks/twio_dollyo.jpg', 'https://example.com/videos/twio_dollyo'),
('Bituro Chagi', 'Twisting kick - spinning heel kick', 3, 9, 'https://example.com/kicks/bituro.jpg', 'https://example.com/videos/bituro'),
('Bandae Dollyo Chagi', 'Reverse turning kick - hook kick technique', 3, 9, 'https://example.com/kicks/bandae.jpg', 'https://example.com/videos/bandae'),

-- Advanced Techniques (Red Belt - Black Belt)
('Twimyo Yop Chagi', 'Flying side kick - jumping side kick with distance', 3, 10, 'https://example.com/kicks/twimyo_yop.jpg', 'https://example.com/videos/twimyo_yop'),
('Bandal Chagi', 'Crescent kick - semi-circular kick motion', 3, 11, 'https://example.com/kicks/bandal.jpg', 'https://example.com/videos/bandal'),
('Goro Chagi', 'Hook kick - leg hooking motion', 3, 11, 'https://example.com/kicks/goro.jpg', 'https://example.com/videos/goro'),

-- Hand Strikes (Advanced)
('Sonnal Taerigi', 'Knife hand strike - edge of hand attack', 2, 6, 'https://example.com/strikes/sonnal.jpg', 'https://example.com/videos/sonnal'),
('Palkup Taerigi', 'Elbow strike - close combat elbow attack', 2, 7, 'https://example.com/strikes/palkup.jpg', 'https://example.com/videos/palkup'),
('Joomuk Taerigi', 'Hammer fist - downward fist strike', 2, 8, 'https://example.com/strikes/joomuk_taerigi.jpg', 'https://example.com/videos/joomuk_taerigi'),

-- Special Techniques (Black Belt)
('Twio Twimyo Yop Chagi', 'Flying jumping side kick - advanced aerial technique', 3, 12, 'https://example.com/kicks/twio_twimyo.jpg', 'https://example.com/videos/twio_twimyo'),
('Sam Jang Yop Chagi', 'Three-step side kick combination', 3, 13, 'https://example.com/kicks/sam_jang.jpg', 'https://example.com/videos/sam_jang'),
('Modum Bal Chagi', 'Consecutive kicking - multiple kick sequence', 3, 14, 'https://example.com/kicks/modum_bal.jpg', 'https://example.com/videos/modum_bal'),

-- Self-Defense Applications
('Ho Sin Sul', 'Self-defense techniques - practical applications', 4, 10, 'https://example.com/hosinsul/basic.jpg', 'https://example.com/videos/hosinsul'),
('Ilbo Daeryon', 'One-step sparring - controlled combat practice', 4, 9, 'https://example.com/sparring/ilbo.jpg', 'https://example.com/videos/ilbo'),
('Jayoo Daeryon', 'Free sparring - uncontrolled combat practice', 4, 11, 'https://example.com/sparring/jayoo.jpg', 'https://example.com/videos/jayoo');

PRINT 'Taekwondo techniques inserted successfully.';
PRINT 'Total techniques created: 28 techniques across all categories';

-- Display techniques by category and rank
SELECT 
    t.Name,
    CASE t.Type 
        WHEN 0 THEN 'Stance'
        WHEN 1 THEN 'Block'
        WHEN 2 THEN 'Punch/Strike'
        WHEN 3 THEN 'Kick'
        WHEN 4 THEN 'Sparring/Defense'
        ELSE 'Other'
    END as Category,
    r.Name as RecommendedRank
FROM [dbo].[Techniques] t
LEFT JOIN [dbo].[Ranks] r ON t.RecommendedRankId = r.Id
ORDER BY t.Type, t.RecommendedRankId;

GO
