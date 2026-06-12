import { NextResponse } from "next/server";
import { getContactFormEndpoint } from "./contactFormEndpoint";

export async function POST(request: Request) {
  const formData = await request.formData();

  try {
    const response = await fetch(getContactFormEndpoint(), {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return NextResponse.json({ ok: false }, { status: response.status });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
