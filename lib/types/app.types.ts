import { Tables } from "./database.types";
import { createClient } from "@/lib/supabase/client";
import { PostgrestError, QueryResult, QueryData, QueryError } from '@supabase/supabase-js'

const supabase = createClient();

interface SidebarItem {
  type: string;
  label?: string;
  destination?: string;
  rounds?: Tables<"round">[];
}
export interface SidebarList extends Array<SidebarItem> { }

const roundsWithQuestions = supabase
  .from("round")
  .select(`*, question ( id )`);
export type RoundsWithQuestions = QueryData<typeof roundsWithQuestions>;

const teamsWithResponsesQuery = supabase
  .from("team")
  .select(`
    id,
    name,
    response (
      id,
      is_correct,
      submitted_answer,
      question (
        points
      )
    )
  `);
export type TeamsWithResponses = QueryData<typeof teamsWithResponsesQuery>;

const teamWithResponsesQuery = supabase
  .from("team")
  .select(`
    id,
    name,
    response (
      id,
      is_correct,
      submitted_answer,
      question (
        points
      )
    )
  `)
  .limit(1);
export type TeamWithResponses = QueryData<typeof teamWithResponsesQuery>[0];

const responsesWithTeamQuery = supabase
  .from("response")
  .select(`
    id,
    is_correct,
    submitted_answer,
    team (
      id,
      name
    )
  `);
export type ResponsesWithTeam = QueryData<typeof responsesWithTeamQuery>;

const responseWithQuestionsQuery = supabase
  .from("response")
  .select(`
    id,
    submitted_answer,
    is_correct,
    question: question (
      points,
      question,
      round: round (status)
    )
  `)
  .limit(1);
export type ResponseWithQuestions = QueryData<typeof responseWithQuestionsQuery>;

export type TeamScoresSorted = {
  id: string,
  name: string,
  team_total_points: number,
  responses: ResponseWithQuestions
}