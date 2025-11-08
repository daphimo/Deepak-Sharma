import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vqscsbznqejxxwygftrt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxc2NzYnpucWVqeHh3eWdmdHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1OTg2NzgsImV4cCI6MjA3ODE3NDY3OH0.FKf81ic7IbQNRDruqKYgYYYMoq_JsAgW8CiFsi33R9Y";

export const supabase = createClient(supabaseUrl, supabaseKey);
