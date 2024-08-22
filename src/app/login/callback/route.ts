import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET({ url }: Request) {
  // intercept the callback request
  const code = new URL(url).searchParams.get("code");
  if (!code) {
    return NextResponse.json({ message: "No code provided" }, { status: 400 });
  }

  // send the code to the api
  const response = await fetch(
    `http://localhost:5000/auth/callback?code=${code}`
  );
  if (!response.ok) {
    return NextResponse.json(
      { message: "Failed to fetch data" },
      { status: 500 }
    );
  }

  // store and return the access token
  const data = await response.json();
  cookies().set("accessToken", data["accessToken"]);
  return redirect("/");
}
