-- Insert statements for rounds associated with each event
\set ON_ERROR_STOP true

INSERT INTO round (
    name,
    description,
    event_id,
    sequence_number,
    status,
    time_limit_seconds,
    created_by,
    updated_by,
    created_at,
    updated_at
) VALUES 
-- Holiday Trivia Night Rounds
(
    'Christmas Movies',
    'Test your knowledge of classic holiday films',
    :'event_1_id',
    1,
    'pending',
    300,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Holiday Traditions',
    'Questions about holiday traditions around the world',
    :'event_1_id',
    2,
    'pending',
    300,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Holiday Music',
    'Name that holiday tune!',
    :'event_1_id',
    3,
    'pending',
    240,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),

-- New Year's Eve Trivia Bash Rounds
(
    'Year in Review 2024',
    'Major events and headlines from 2024',
    :'event_2_id',
    1,
    'pending',
    300,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Pop Culture 2024',
    'Entertainment, music, and celebrity highlights',
    :'event_2_id',
    2,
    'pending',
    300,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Sports 2024',
    'Major sporting events and achievements',
    :'event_2_id',
    3,
    'pending',
    300,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Countdown Special',
    'New Year traditions and celebrations worldwide',
    :'event_2_id',
    4,
    'pending',
    240,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),

-- Winter Movie Trivia Rounds
(
    'Classic Winter Films',
    'Iconic movies set in winter',
    :'event_3_id',
    1,
    'pending',
    300,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Winter Animation',
    'Animated movies featuring winter themes',
    :'event_3_id',
    2,
    'pending',
    300,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Behind the Scenes',
    'Movie production and actor trivia',
    :'event_3_id',
    3,
    'pending',
    300,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),

-- Valentine's Day Couples Trivia Rounds
(
    'Famous Couples',
    'Celebrity couples throughout history',
    :'event_4_id',
    1,
    'pending',
    300,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Romance in Pop Culture',
    'Love stories in movies, TV, and books',
    :'event_4_id',
    2,
    'pending',
    300,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Love Songs',
    'Classic and modern love songs',
    :'event_4_id',
    3,
    'pending',
    240,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
);
