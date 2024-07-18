import { NextResponse } from "next/server";

const translate = async () => {};

export async function GET() {
  const translated = await translate();
  return NextResponse.json({
    message: "Translation retrieved successfully",
    data: translated,
  });
}
