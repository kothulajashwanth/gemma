// Supabase Realtime Database Integration for HYDRA OS
// Connects directly to Supabase REST API using environment keys

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://pvsxxgdnthrbpqatbsxc.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2c3h4Z2RudGhyYnBxYXRic3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4ODcwMDEsImV4cCI6MjEwMDQ2MzAwMX0.vYnFJkBGl8ihdxCaGImGIVR8eBr4JDVbQ07EDw7Pgic";

/**
 * Sync a new civic report to Supabase database table
 */
export async function syncReportToSupabase(reportData) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/reports`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        report_id: reportData.id,
        title: reportData.title,
        category: reportData.category,
        location: reportData.location,
        severity: reportData.severity,
        confidence: reportData.confidence,
        status: reportData.status || "Submitted",
        department: reportData.dept,
        created_at: new Date().toISOString()
      })
    });

    if (res.ok) {
      console.log(`[Supabase] Report ${reportData.id} synced successfully to cloud database.`);
      return true;
    } else {
      console.warn(`[Supabase] Sync returned status: ${res.status}`);
      return false;
    }
  } catch (err) {
    console.warn("[Supabase] Cloud sync error:", err.message);
    return false;
  }
}
