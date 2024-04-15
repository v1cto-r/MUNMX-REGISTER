import connectMongoDB from "@/app/connections/mongoConnection";
import Delegate from "@/app/models/delegate";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongoDB();
  const delegates = await Delegate.find({ registered: false });

  console.log("fetched delegates")

  return NextResponse.json(delegates);
}