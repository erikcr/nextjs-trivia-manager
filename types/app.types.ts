import { Tables } from "./database.types";
import { createClient } from "@/utils/supabase/client";
import { PostgrestError, QueryResult, QueryData, QueryError } from '@supabase/supabase-js'

const supabase = createClient();

interface SidebarItem {
  type: string;
  label?: string;
  destination?: string;
  rounds?: Tables<"v002_rounds_stag">[];
}
export interface SidebarList extends Array<SidebarItem> { }

const roundsWithQuestions = supabase
  .from("v002_rounds_stag")
  .select(`*, v002_questions_stag ( id )`);
export type RoundsWithQuestions = QueryData<typeof roundsWithQuestions>;

const teamsWithResponsesQuery = supabase
  .from("v002_teams_stag")
  .select(`
    id,
    name,
    v002_responses_stag (
      id,
      is_correct,
      submitted_answer,
      v002_questions_stag (
        points
      )
    )
  `);
export type TeamsWithResponses = QueryData<typeof teamsWithResponsesQuery>;

const teamWithResponsesQuery = supabase
  .from("v002_teams_stag")
  .select(`
    id,
    name,
    v002_responses_stag (
      id,
      is_correct,
      submitted_answer,
      v002_questions_stag (
        points
      )
    )
  `)
  .limit(1);
export type TeamWithResponses = QueryData<typeof teamWithResponsesQuery>[0];

const responsesWithTeamQuery = supabase
  .from("v002_responses_stag")
  .select(`
    id,
    is_correct,
    submitted_answer,
    v002_teams_stag (
      id,
      name
    )
  `);
export type ResponsesWithTeam = QueryData<typeof responsesWithTeamQuery>;

const responseWithQuestionsQuery = supabase
  .from("v002_responses_stag")
  .select(`
    id,
    is_correct,
    submitted_answer,
    v002_questions_stag (
      points
    )
  `)
  .limit(1);
export type ResponeWithQuestions = QueryData<typeof responseWithQuestionsQuery>;

export type TeamScoresSorted = {
  id: string,
  name: string,
  team_total_points: number,
  responses: Tables<"v002_responses_stag">[]
}