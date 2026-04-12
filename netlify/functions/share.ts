import { getStore } from "@netlify/blobs";
import { nanoid } from "nanoid";

export default async (req: Request) => {
  const store = getStore("shares");

  // Create a new share (or update existing one)
  if (req.method === "POST") {
    try {
      const body = await req.json();
      // Use provided ID (for permanent plans) or generate a new one
      const id = body.id || nanoid(10);
      const data = body.data || body;
      
      await store.setJSON(id, data);
      
      return new Response(JSON.stringify({ id }), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        }
      });
    } catch (error) {
      console.error("Error creating share:", error);
      return new Response(JSON.stringify({ error: "Failed to store plan" }), {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }
  }

  // Retrieve an existing share
  if (req.method === "GET") {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    try {
      const data = await store.get(id, { type: "json" });
      if (!data) {
        return new Response(JSON.stringify({ error: "Plan not found" }), {
          status: 404,
          headers: { "Access-Control-Allow-Origin": "*" }
        });
      }
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        }
      });
    } catch (error) {
      console.error("Error retrieving share:", error);
      return new Response(JSON.stringify({ error: "Failed to retrieve plan" }), {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }
  }

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }

  return new Response("Method not allowed", { 
    status: 405,
    headers: { "Access-Control-Allow-Origin": "*" }
  });
};
