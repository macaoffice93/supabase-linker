import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const token = req.headers.get("Authorization")?.split("Bearer ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
  }

  // Create a Supabase client with the provided token
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  try {
    // Retrieve user info
    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
    }

    // Parse the request body
    const { url, config } = await req.json();

    if (!url || !config) {
      return NextResponse.json(
        { error: "Both URL and config are required" },
        { status: 400 }
      );
    }

    // Validate JSON in the config
    let parsedConfig;
    try {
      parsedConfig = JSON.parse(config);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in config" },
        { status: 400 }
      );
    }

    // Update the deployment config in the database
    const { data, error } = await supabase
      .from("deployments")
      .update({ config: parsedConfig, updated_at: new Date() })
      .eq("url", url)
      .select("*");

    if (error) {
      return NextResponse.json(
        { error: "Failed to update config" },
        { status: 500 }
      );
    }

    if (data.length === 0) {
      return NextResponse.json(
        { error: "No matching deployment found for the given URL" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Config updated successfully", data: data[0] },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
