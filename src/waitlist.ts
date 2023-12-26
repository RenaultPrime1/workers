export default {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url);

    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://kareudon.kamitsubaki.fans',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Parse the request body as JSON
    const data: { timestamp: string, email: string } = await request.json();
    const timestamp = data.timestamp;
    const email = data.email;

    if (!timestamp || !email) {
      return new Response('Missing params in the request', { status: 400, headers: corsHeaders });
    }

    await env.UDON_WAITLIST_KV.put(timestamp, email);

    return new Response('Submitted successfully', { status: 200, headers: corsHeaders });

  }
}