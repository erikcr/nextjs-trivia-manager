-- Insert statements for 4 events
\set ON_ERROR_STOP true

INSERT INTO event (
    name,
    description,
    scheduled_at,
    location,
    venue,
    max_teams,
    team_size_limit,
    join_code,
    status,
    created_by,
    updated_by,
    created_at,
    updated_at
) VALUES 
(
    'Holiday Trivia Night',
    'Join us for a festive evening of holiday-themed trivia!',
    '2024-12-20T19:00:00-05:00',
    'Boston, MA',
    'The Festive Pub',
    20,
    4,
    'HOLIDAY24',
    'pending',
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'New Year''s Eve Trivia Bash',
    'Ring in the new year with an epic trivia competition!',
    '2024-12-31T21:00:00-05:00',
    'Boston, MA',
    'The Grand Hall',
    30,
    6,
    'NYE2024',
    'pending',
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Winter Movie Trivia',
    'Test your knowledge of classic winter and holiday movies',
    '2025-01-10T18:30:00-05:00',
    'Cambridge, MA',
    'Cinema Pub',
    15,
    4,
    'WINTER25',
    'pending',
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Valentine''s Day Couples Trivia',
    'Bring your special someone for a romantic evening of trivia!',
    '2025-02-14T19:00:00-05:00',
    'Boston, MA',
    'Love''s Tavern',
    25,
    2,
    'VDAY25',
    'pending',
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
)
RETURNING id;
