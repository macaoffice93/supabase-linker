import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  try {
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // Create a Supabase client with the provided token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    // Retrieve user info
    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
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
    let parsedConfig: any;
    try {
      parsedConfig = typeof config === "string" ? JSON.parse(config) : config;
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in config" },
        { status: 400 }
      );
    }

    // Check if a row already exists for the given URL
    const { data: existingData, error: fetchError } = await supabase
      .from("deployments")
      .select("*")
      .eq("url", url);

    if (fetchError) {
      return NextResponse.json(
        { error: "Failed to fetch existing data" },
        { status: 500 }
      );
    }

    if (existingData.length === 0) {
      // If no row exists, insert a new row
      const { data: insertData, error: insertError } = await supabase
        .from("deployments")
        .insert({
          url,
          config: parsedConfig,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .select("*");

      if (insertError) {
        return NextResponse.json(
          { error: "Failed to create new config" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "Config created successfully", data: insertData[0] },
        { status: 201 }
      );
    } else {
      // If a row exists, update the existing row
      const { data: updateData, error: updateError } = await supabase
        .from("deployments")
        .update({
          config: parsedConfig,
          updated_at: new Date(),
        })
        .eq("url", url)
        .select("*");

      if (updateError) {
        return NextResponse.json(
          { error: "Failed to update config" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "Config updated successfully", data: updateData[0] },
        { status: 200 }
      );
    }
  } catch (err: any) {
    console.error("Unexpected error:", err);

    // Return a JSON response for unexpected errors
    return NextResponse.json(
      { error: "An unexpected error occurred", details: err.message },
      { status: 500 }
    );
  }
}
