import { NextResponse } from "next/server";

export function GET() {
    return NextResponse.redirect("http://localhost:5000/auth/login");
}