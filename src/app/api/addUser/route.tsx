import connectMongoDB from "@/app/connections/mongoConnection";
import User from "@/app/models/user";
import crypto from "crypto";

export async function POST(request: Request) {
  const { name, password, identifier, role } = await request.json();
  await connectMongoDB();

  const hashedPwd = crypto.scryptSync(password, "salt", 64).toString("hex");

  const user = new User({ 
    "name": name, 
    "password": hashedPwd, 
    "role": role, 
    "identifier": identifier
  });

  await user.save().then(() => console.log("User added"));

  return new Response("User added", { status: 200 });
}