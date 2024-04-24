import connectMongoDB from "@/app/connections/mongoConnection";
import Delegate from "@/app/models/delegate";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const { name: delegateName, country: delegateCountry, committee: delegateCommittee, vegan: vegan } = await request.json();
  await connectMongoDB();

  const doc = await Delegate.findOne({ name: delegateName, country: delegateCountry, committee: delegateCommittee });

  if (!doc) {
    console.log("Delegate not found");
    return NextResponse.json({ message: "Delegate not found"}, { status: 404 });
  }

  doc.registered = true;
  doc.vegan = vegan;

  await doc.save().then(() => console.log("Delegate registered"));

  return NextResponse.json({ message: "Delegate registered"}, { status: 200 });
}