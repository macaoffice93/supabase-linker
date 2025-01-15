"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/browser";

export default function DeploymentForm() {
  const [url, setUrl] = useState("");
  const [config, setConfig] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!url || !config) {
      alert("Both URL and Config are required!");
      return;
    }

    // Validate JSON
    let parsedConfig;
    try {
      parsedConfig = JSON.parse(config);
    } catch {
      alert("Invalid JSON in Config. Please fix it and try again.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from("deployments")
        .update({ config: parsedConfig, updated_at: new Date() })
        .eq("url", url) // Ensure we only update the row matching the URL
        .select("*"); // Fetch the updated row for confirmation

      if (error) {
        console.error("Error updating config:", error);
        alert("Failed to update config. Please try again.");
      } else if (data.length === 0) {
        alert("No matching deployment found for the given URL.");
      } else {
        alert("Config updated successfully!");
        console.log("Updated row:", data[0]);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Deployment URL</span>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter deployment URL"
          className="border rounded px-3 py-2"
          required
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Config</span>
        <textarea
          value={config}
          onChange={(e) => setConfig(e.target.value)}
          placeholder="Enter config JSON"
          className="border rounded px-3 py-2"
          rows={5}
          required
        ></textarea>
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`rounded px-4 py-2 text-white ${
          isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary-dark"
        }`}
      >
        {isSubmitting ? "Updating..." : "Update Config"}
      </button>
    </form>
  );
}
