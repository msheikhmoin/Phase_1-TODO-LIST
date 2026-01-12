import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "p2_todo_secret_998877665544332211",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustHost: true,
  plugins: [
    jwt({
      secret: process.env.BETTER_AUTH_SECRET || "p2_todo_secret_998877665544332211",
      expiresIn: "24h", // Token expires in 24 hours as specified in API spec
    }),
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
  },
  socialProviders: {},
  database: {
    schema: undefined,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days as specified in API spec
    updateAgeOnVisit: true,
    cookieName: "__Secure-Better-Token",
  },
});