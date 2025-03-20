import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://lvrjuchyhnyycmrmcgrl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2cmp1Y2h5aG55eWNtcm1jZ3JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MDUzODQsImV4cCI6MjA1Nzk4MTM4NH0.LQQTpcVHekpHCmNZWo5WcVfVWzyrl8ekT89q3e3d_wk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

