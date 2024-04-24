import crypto from "crypto";
import connectMongoDB from "@/app/connections/mongoConnection";
import User from "@/app/models/user";

export async function POST(request: Request) {
  const { name, password } = await request.json();
  await connectMongoDB();

  const user = await User.findOne({ name });
  if (!user) {
    console.log("User not found");
    return new Response("User not found", { status: 404 });
  }

  const hashedRequest = crypto.scryptSync(password, "salt", 64).toString("hex");

  if (hashedRequest !== user.password) {
    return new Response("Invalid password", { status: 401 });
  }

  const cookieValue = crypto.scryptSync("munmxsal2024", "salt", 64).toString("hex");
  const id = user.identifier;
  const response = new Response("User verified", { status: 200 });
  response.headers.append('Set-Cookie', `login=${cookieValue}; Path=/; SameSite=Strict`);
  response.headers.append('Set-Cookie', `id=${id}; Path=/; SameSite=Strict`);

  return response;
}