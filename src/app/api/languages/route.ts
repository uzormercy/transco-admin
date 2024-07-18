import { getLanguages } from "@/services";
import { NextResponse } from "next/server";

export async function GET() {
  const languages = await getLanguages();
  return NextResponse.json({
    message: "Languages retrieved successfully",
    data: languages,
  });
}
