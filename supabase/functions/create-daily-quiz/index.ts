// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Question {
  id: string;
  text: string;
  quiz_id: string;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
}

interface DailyQuizResult {
  success: boolean;
  quizId?: string;
  title?: string;
  questionsCount?: number;
  error?: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Check if a daily quiz already exists for today
    const { data: existingQuiz, error: existingError } = await supabase
      .from('quizzes')
      .select('id, title')
      .eq('is_daily_challenge', true)
      .gte('valid_until', new Date().toISOString())
      .limit(1)
      .maybeSingle();

    if (existingError) {
      throw new Error(`Error checking existing quiz: ${existingError.message}`);
    }

    if (existingQuiz) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Daily quiz already exists for today',
          quizId: existingQuiz.id,
          title: existingQuiz.title,
        } as DailyQuizResult),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Get all categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name');

    if (catError) {
      throw new Error(`Error fetching categories: ${catError.message}`);
    }

    // Get random questions from different categories (10 questions total)
    const { data: allQuestions, error: questionsError } = await supabase
      .from('questions')
      .select('id, text, quiz_id, created_at')
      .limit(100);

    if (questionsError) {
      throw new Error(`Error fetching questions: ${questionsError.message}`);
    }

    if (!allQuestions || allQuestions.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No questions available to create daily quiz',
        } as DailyQuizResult),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Fisher-Yates shuffle for proper randomization
    const shuffled = [...allQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const selectedQuestions = shuffled.slice(0, Math.min(10, shuffled.length));

    // Calculate valid_until (24 hours from now, at midnight)
    const validUntil = new Date(today);
    validUntil.setDate(validUntil.getDate() + 1);
    validUntil.setHours(23, 59, 59, 999);

    // Format date for title in French format
    const dateOptions: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    const formattedDate = today.toLocaleDateString('fr-FR', dateOptions);

    // Pick a random category for the quiz
    const randomCategory = categories && categories.length > 0
      ? categories[Math.floor(Math.random() * categories.length)]
      : null;

    // Create the daily quiz
    const { data: newQuiz, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        title: `Défi Quotidien - ${formattedDate}`,
        description: `Quiz quotidien du ${formattedDate}. Complétez ce défi pour maintenir votre série!`,
        is_daily_challenge: true,
        valid_until: validUntil.toISOString(),
        difficulty: 'Moyen',
        category_id: randomCategory?.id || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (quizError) {
      throw new Error(`Error creating daily quiz: ${quizError.message}`);
    }

    // Copy selected questions to the new quiz
    const questionsToInsert = selectedQuestions.map((q: Question) => ({
      text: q.text,
      quiz_id: newQuiz.id,
      created_at: new Date().toISOString(),
    }));

    const { data: insertedQuestions, error: insertQuestionsError } = await supabase
      .from('questions')
      .insert(questionsToInsert)
      .select();

    if (insertQuestionsError) {
      // Rollback: delete the quiz and any partially inserted questions
      await supabase.from('questions').delete().eq('quiz_id', newQuiz.id);
      await supabase.from('quizzes').delete().eq('id', newQuiz.id);
      throw new Error(`Error inserting questions: ${insertQuestionsError.message}`);
    }

    // Copy answers for each question
    for (let i = 0; i < selectedQuestions.length; i++) {
      const originalQuestion = selectedQuestions[i] as Question;
      const newQuestion = insertedQuestions[i];

      const { data: originalAnswers, error: answersError } = await supabase
        .from('answers')
        .select('text, is_correct')
        .eq('question_id', originalQuestion.id);

      if (answersError) {
        console.error(`Error fetching answers for question ${originalQuestion.id}: ${answersError.message}`);
        continue;
      }

      if (originalAnswers && originalAnswers.length > 0) {
        const answersToInsert = originalAnswers.map((a: { text: string; is_correct: boolean }) => ({
          question_id: newQuestion.id,
          text: a.text,
          is_correct: a.is_correct,
        }));

        const { error: insertAnswersError } = await supabase
          .from('answers')
          .insert(answersToInsert);

        if (insertAnswersError) {
          console.error(`Error inserting answers: ${insertAnswersError.message}`);
        }
      }
    }

    // Clean up old daily quizzes (older than 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { error: cleanupError } = await supabase
      .from('quizzes')
      .delete()
      .eq('is_daily_challenge', true)
      .lt('valid_until', sevenDaysAgo.toISOString());

    if (cleanupError) {
      console.error(`Error cleaning up old quizzes: ${cleanupError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        quizId: newQuiz.id,
        title: newQuiz.title,
        questionsCount: insertedQuestions.length,
      } as DailyQuizResult),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in create-daily-quiz function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      } as DailyQuizResult),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

/* To invoke this function locally:
  1. Run `supabase start`
  2. Run `supabase functions serve --no-verify-jwt`
  3. Make a request: curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-daily-quiz'
*/

/* CRON Configuration:
  To schedule this function to run daily at midnight, add this to your supabase/config.toml:
  
  [functions.create-daily-quiz]
  schedule = "0 0 * * *"
  
  Or configure via Supabase Dashboard > Edge Functions > create-daily-quiz > Settings > Schedule
*/
