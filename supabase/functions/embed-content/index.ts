import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const { record } = await req.json();
  
  const text = [record.title, record.description, (record.tags || []).join(" ")]
    .filter(Boolean).join(" ");

  // Generate embedding via OpenAI
  const embRes = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
    },
    body: JSON.stringify({ 
      model: "text-embedding-3-small", 
      input: text 
    }),
  });
  const embData = await embRes.json();
  const embedding = embData.data[0].embedding;

  // Write embedding back to the row
  const supa = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
  await supa
    .from("searchable_content")
    .update({ embedding })
    .eq("id", record.id);

  return new Response(JSON.stringify({ ok: true, id: record.id }), {
    headers: { "Content-Type": "application/json" },
  });
});
