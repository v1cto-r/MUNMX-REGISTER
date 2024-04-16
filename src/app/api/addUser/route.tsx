import connectMongoDB from "@/app/connections/mongoConnection";
import User from "@/app/models/user";
import crypto from "crypto";


export async function POST(request: Request) {
  const { name, password, identifier, role } = await request.json();
  await connectMongoDB();

  console.log(name, password, identifier, role);

  const hashedPwd = crypto.scryptSync(password, "salt", 64).toString("hex");
  console.log(hashedPwd)

  const user = new User({ 
      "name": name, 
      "password": hashedPwd, 
      "role": role, 
      "identifier": identifier
    });
  console.log(user);
  const savedUser = await user.save();

  return new Response("User added", { status: 200 });
}