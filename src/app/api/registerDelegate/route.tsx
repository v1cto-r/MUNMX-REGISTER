import connectMongoDB from "@/app/connections/mongoConnection";
import Delegate from "@/app/models/delegate";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const { name: delegateName, country: delegateCountry, committee: delegateCommittee } = await request.json();
  await connectMongoDB();

  const filter = { name: delegateName, country: delegateCountry, committee: delegateCommittee };
  const update = { registered: true };

  await Delegate.findOneAndUpdate( filter, update);

  return NextResponse.json({ message: "Delegate registered"}, { status: 200 });
}