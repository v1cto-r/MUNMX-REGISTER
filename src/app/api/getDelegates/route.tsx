import connectMongoDB from "@/app/connections/mongoConnection";
import Delegate from "@/app/models/delegate";
import { NextRequest, NextResponse } from "next/server";

export const fetchCache = 'force-no-store';

export async function GET(req: NextRequest) {
  await connectMongoDB();

  const timeHeader = req.headers.get('Time');

  console.log(timeHeader);

  const delegates = await Delegate.find({ registered: false });

  console.log("fetched delegates")

  return NextResponse.json(delegates, {headers: {'Cache-Control': 'no-store'}});
}