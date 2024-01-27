import { createClient } from "@/utils/supabase/client";

import { Database } from './supabase'
import { PostgrestError, QueryResult, QueryData, QueryError } from '@supabase/supabase-js'

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never
export type DbResultErr = PostgrestError

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

const supabase = createClient();
const teamsWithResponsesQuery = supabase
  .from("v001_teams_stag")
  .select(`
    id,
    name,
    v001_responses_stag (
      id,
      is_correct,
      submitted_answer,
      v001_questions_stag (
        points
      )
    )
  `);
export type TeamsWithResponses = QueryData<typeof teamsWithResponsesQuery>;

const teamWithResponsesQuery = supabase
  .from("v001_teams_stag")
  .select(`
    id,
    name,
    v001_responses_stag (
      id,
      is_correct,
      submitted_answer,
      v001_questions_stag (
        points
      )
    )
  `)
  .limit(1);
export type TeamWithResponses = QueryData<typeof teamWithResponsesQuery>[0];

const responseWithQuestionsQuery = supabase
  .from("v001_responses_stag")
  .select(`
    id,
    is_correct,
    submitted_answer,
    v001_questions_stag (
      points
    )
  `)
  .limit(1);
export type ResponeWithQuestions = QueryData<typeof responseWithQuestionsQuery>;