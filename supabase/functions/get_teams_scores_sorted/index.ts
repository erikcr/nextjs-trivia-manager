// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { eventId } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: teams, error: teamsError } = await supabase
      .from('v002_teams_stag')
      .select('id, event_id')
      .eq('event_id', eventId);

    if (teamsError) throw teamsError;

    // Fetch responses and questions for the teams
    const promises = teams.map(async team => {
      const { data: responses, error: responsesError } = await supabase
        .from('v002_responses_stag')
        .select(`
            is_correct,
            question_id,
            v002_questions_stag (points)
        `)
        .eq('team_id', team.id)
        .is('is_correct', true); // Only consider correct responses

      if (responsesError) throw responsesError;

      // Calculate total points for the team
      const totalPoints = responses.reduce((acc, response) => acc + response.v002_questions_stag.points, 0);

      return { team_id: team.id, team_total_points: totalPoints };
    });

    // Resolve all promises and calculate total points for each team
    const scores = await Promise.all(promises);

    // Sort teams by total points in descending order
    scores.sort((a, b) => b.team_total_points - a.team_total_points);

    return new Response(JSON.stringify(scores), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

// To invoke:
// curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
