-- Insert statements for questions in each round
\set ON_ERROR_STOP true

INSERT INTO question (
    question_text,
    correct_answer,
    points,
    round_id,
    sequence_number,
    status,
    time_limit_seconds,
    created_by,
    updated_by,
    created_at,
    updated_at
) VALUES
-- Christmas Movies Round Questions
(
    'In the movie "Home Alone", what do the burglars call themselves?',
    'The Wet Bandits',
    100,
    '1c30cce3-1c05-4fa4-8d02-d0a2b3b177f4',
    1,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Which actor plays Buddy in the movie "Elf"?',
    'Will Ferrell',
    100,
    '1c30cce3-1c05-4fa4-8d02-d0a2b3b177f4',
    2,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'What year was "A Christmas Story" released?',
    '1983',
    150,
    '1c30cce3-1c05-4fa4-8d02-d0a2b3b177f4',
    3,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),

-- Holiday Traditions Round Questions
(
    'In which country did the tradition of putting up a Christmas tree originate?',
    'Germany',
    100,
    '1f1c7c62-9290-45fa-aa23-26aaba0aa5d7',
    1,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'What plant is known as the "Flower of the Holy Night" in Mexico?',
    'Poinsettia',
    150,
    '1f1c7c62-9290-45fa-aa23-26aaba0aa5d7',
    2,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Which country traditionally serves KFC for Christmas dinner?',
    'Japan',
    200,
    '1f1c7c62-9290-45fa-aa23-26aaba0aa5d7',
    3,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),

-- Holiday Music Round Questions
(
    'Who originally recorded "White Christmas"?',
    'Bing Crosby',
    100,
    '2e7cc96e-112b-45cd-92bf-178483657a3',
    1,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Which band released "Last Christmas" in 1984?',
    'Wham!',
    100,
    '2e7cc96e-112b-45cd-92bf-178483657a3',
    2,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'How many gifts in total were given in "The Twelve Days of Christmas"?',
    '364',
    200,
    '2e7cc96e-112b-45cd-92bf-178483657a3',
    3,
    'pending',
    45,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),

-- Year in Review Round Questions
(
    'Which movie won the Academy Award for Best Picture in 2024?',
    'Oppenheimer',
    100,
    '40cccb19-7f77-4c4a-b196-3d4e8a4e77cb',
    1,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Which artist had the best-selling album of 2024?',
    'Taylor Swift',
    100,
    '40cccb19-7f77-4c4a-b196-3d4e8a4e77cb',
    2,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Which country hosted the 2024 Summer Olympics?',
    'France',
    150,
    '40cccb19-7f77-4c4a-b196-3d4e8a4e77cb',
    3,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),

-- Pop Culture Round Questions
(
    'Which TV series had its final season in 2024?',
    'Succession',
    100,
    '76319b0d-4a01-42fb-a558-8f14bfd28abb',
    1,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'What was the highest-grossing video game of 2024?',
    'Grand Theft Auto VI',
    150,
    '76319b0d-4a01-42fb-a558-8f14bfd28abb',
    2,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Which social media platform underwent a major rebrand in 2024?',
    'Twitter/X',
    100,
    '76319b0d-4a01-42fb-a558-8f14bfd28abb',
    3,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),

-- Sports Round Questions
(
    'Which team won Super Bowl LVIII in 2024?',
    'Kansas City Chiefs',
    100,
    'b323a162-1d10-4dc4-b71d-cce7046b67f0',
    1,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Who won the FIFA Ballon d''Or in 2024?',
    'Erling Haaland',
    150,
    'b323a162-1d10-4dc4-b71d-cce7046b67f0',
    2,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Which country won the most medals at the 2024 Olympics?',
    'United States',
    200,
    'b323a162-1d10-4dc4-b71d-cce7046b67f0',
    3,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),

-- Classic Winter Films Round Questions
(
    'In which year was "The Shining" released?',
    '1980',
    100,
    'b7b121a5-ca2b-42af-9175-30beef1d0aa8',
    1,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Who directed "Fargo"?',
    'Coen Brothers',
    150,
    'b7b121a5-ca2b-42af-9175-30beef1d0aa8',
    2,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'What is the name of the ski resort in "The Grand Budapest Hotel"?',
    'Gabelmeister''s Peak',
    200,
    'b7b121a5-ca2b-42af-9175-30beef1d0aa8',
    3,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),

-- Winter Animation Round Questions
(
    'Who voices Olaf in "Frozen"?',
    'Josh Gad',
    100,
    'bc0ecf77-8014-4562-8f92-571360bdeb03',
    1,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'What year was "Ice Age" released?',
    '2002',
    100,
    'bc0ecf77-8014-4562-8f92-571360bdeb03',
    2,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Which studio produced "The Snowman" (1982)?',
    'Channel 4',
    200,
    'bc0ecf77-8014-4562-8f92-571360bdeb03',
    3,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),

-- Famous Couples Round Questions
(
    'Which famous couple starred together in "Mr. & Mrs. Smith" (2005)?',
    'Brad Pitt and Angelina Jolie',
    100,
    'c123e8f9-a189-4e4f-b1c5-aa0bc4fa85bd',
    1,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Which royal couple married on April 29, 2011?',
    'Prince William and Kate Middleton',
    100,
    'c123e8f9-a189-4e4f-b1c5-aa0bc4fa85bd',
    2,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Which power couple founded The Bill & Melinda Gates Foundation?',
    'Bill Gates and Melinda French Gates',
    150,
    'c123e8f9-a189-4e4f-b1c5-aa0bc4fa85bd',
    3,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),

-- Romance in Pop Culture Round Questions
(
    'Which 1997 film features the famous "I''m flying" scene?',
    'Titanic',
    100,
    'cf2f8fbf-503c-4fb6-8679-87aa3dd88035',
    1,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'In "The Notebook", where do Noah and Allie first meet?',
    'At a carnival',
    150,
    'cf2f8fbf-503c-4fb6-8679-87aa3dd88035',
    2,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Which Shakespeare play features the famous balcony scene?',
    'Romeo and Juliet',
    100,
    'cf2f8fbf-503c-4fb6-8679-87aa3dd88035',
    3,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),

-- Love Songs Round Questions
(
    'Who sang "I Will Always Love You" in "The Bodyguard"?',
    'Whitney Houston',
    100,
    'd049358a-0e05-41ac-81d3-26c4013d2371',
    1,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Which Beatles song starts with "Words are flowing out like endless rain into a paper cup"?',
    'Across the Universe',
    200,
    'd049358a-0e05-41ac-81d3-26c4013d2371',
    2,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
),
(
    'Who wrote and first performed "The Way You Look Tonight"?',
    'Fred Astaire',
    150,
    'd049358a-0e05-41ac-81d3-26c4013d2371',
    3,
    'pending',
    30,
    :'user_id',
    :'user_id',
    :'current_timestamp',
    :'current_timestamp'
);
