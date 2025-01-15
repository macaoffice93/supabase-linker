import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const deploymentUrl = `https://${requestUrl.host}`;
  const supabase = await createClient();

  try {
    // Check if deployment exists
    const { data: deployment, error } = await supabase
      .from('deployments')
      .select('*')
      .eq('url', deploymentUrl)
      .single();

    if (error && error.code === 'PGRST116') {
      // Deployment not found, create a new one with default config
      const defaultConfig = { featureEnabled: false, theme: 'light' };
      const { data: newDeployment, error: insertError } = await supabase
        .from('deployments')
        .insert([{ url: deploymentUrl, config: defaultConfig }])
        .select()
        .single();

      if (insertError) {
        return NextResponse.json(
          { error: 'Failed to register deployment.', details: insertError },
          { status: 500 }
        );
      }

      return NextResponse.json(newDeployment.config);
    } else if (error) {
      throw error;
    }

    // Return existing deployment config
    return NextResponse.json(deployment?.config || {});
  } catch (error) {
    console.error('Error handling deployment:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.', details: error },
      { status: 500 }
    );
  }
}
