import { auth } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse(
      JSON.stringify({ status: "fail", message: "You are not logged in" }),
      { status: 401 }
    );
  }

  const userId = session.user.id;

  // Hasura specific claims
  const hasuraClaims = {
    "https://hasura.io/jwt/claims": {
      "x-hasura-default-role": "user",
      "x-hasura-allowed-roles": ["user"],
      "x-hasura-user-id": userId,
    },
  };

  // Secret key
  const secretKey = process.env["HASURA_GRAPHQL_JWT_SECRET"];

  if (!secretKey) {
    throw new Error("Secret key is undefined. Make sure it is properly set.");
  }

  const token = jwt.sign(hasuraClaims, secretKey, { expiresIn: "10y" });

  return NextResponse.json({
    hasura_token: token,
  });
}
