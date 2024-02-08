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

    const { data, error } = await supabase
      .from("v002_teams_stag")
      .select(
        `
          id,
          name,
          event_id,
          responses: v002_responses_stag (
              question: v002_questions_stag (
                points,
                round: v002_rounds_stag (status)
              ),
              is_correct
          )
        `
      )
      .eq("event_id", eventId);

    const sumTeamPoints = data?.map((team) => ({
      id: team.id,
      name: team.name,
      team_total_points: team.responses.reduce(
        (acc, response) =>
          response.question.round.status === "COMPLETE" && response.is_correct
            ? acc + response.question.points
            : acc,
        0
      ),
    }));

    const pointsSorted = sumTeamPoints.sort((a, b) => b.team_total_points - a.team_total_points);

    return new Response(JSON.stringify(pointsSorted), {
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
