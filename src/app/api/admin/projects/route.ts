import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ADMIN_PASS =
  process.env.ADMIN_PASS ?? process.env.NEXT_PUBLIC_ADMIN_PASS ?? "";

export async function GET(request: NextRequest) {
  const pass = request.headers.get("x-admin-pass") ?? "";
  if (!ADMIN_PASS || pass !== ADMIN_PASS) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Server not configured" },
      { status: 500 },
    );
  }
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .order("inserted_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}
