// app/api/ping/route.ts
export async function GET() {
    return new Response("OK", { status: 200 });
  }
  