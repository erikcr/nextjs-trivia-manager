-- Insert statements for teams in each event
\set ON_ERROR_STOP true

INSERT INTO team (
    name,
    event_id
) VALUES
-- Holiday Trivia Night Teams
(
    'Mistletoe Masterminds',
    :'event_1_id'
),
(
    'Santa''s Scholars',
    :'event_1_id'
),
(
    'Reindeer Rangers',
    :'event_1_id'
),
(
    'Eggnog Experts',
    :'event_1_id'
),

-- New Year's Eve Trivia Bash Teams
(
    'Midnight Mavericks',
    :'event_2_id'
),
(
    'Resolution Rebels',
    :'event_2_id'
),
(
    'Countdown Champions',
    :'event_2_id'
),
(
    'Party Prodigies',
    :'event_2_id'
),
(
    'Auld Lang Sages',
    :'event_2_id'
),

-- Winter Movie Trivia Teams
(
    'Cinema Snowflakes',
    :'event_3_id'
),
(
    'Popcorn Polar Bears',
    :'event_3_id'
),
(
    'Frosty Film Buffs',
    :'event_3_id'
),
(
    'Winter Watchdogs',
    :'event_3_id'
),

-- Valentine's Day Couples Trivia Teams
(
    'Love Laureates',
    :'event_4_id'
),
(
    'Cupid''s Crew',
    :'event_4_id'
),
(
    'Heart & Soul',
    :'event_4_id'
),
(
    'Romeo & Juliet',
    :'event_4_id'
),
(
    'Sweet Hearts',
    :'event_4_id'
);
