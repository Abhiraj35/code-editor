import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db"
import authConfig from "./auth.config"
import { getUserById } from "./modules/auth/actions";
import { UserRole } from "@prisma/client";

// Validate required environment variables
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
if (!NEXTAUTH_SECRET) {
    throw new Error("Missing NEXTAUTH_SECRET in environment variables");
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    callbacks: {
        async signIn({ user, account }) {
            if (!user || !account || !user.email) {
                return false;
            }

            const accountData = {
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state ? String(account.session_state) : null,
            };

            try {
                const userRecord = await db.user.upsert({
                    where: { email: user.email },
                    create: {
                        email: user.email,
                        name: user.name ?? null,
                        image: user.image ?? null,
                    },
                    update: {
                        name: user.name ?? undefined,
                        image: user.image ?? undefined,
                    },
                });

                await db.account.upsert({
                    where: {
                        provider_providerAccountId: {
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                        },
                    },
                    create: {
                        userId: userRecord.id,
                        ...accountData,
                    },
                    update: {
                        access_token: accountData.access_token,
                        refresh_token: accountData.refresh_token,
                        expires_at: accountData.expires_at,
                        token_type: accountData.token_type,
                        scope: accountData.scope,
                        id_token: accountData.id_token,
                        session_state: accountData.session_state,
                    },
                });

                return true;
            } catch (error) {
                //TODO: make error handeling batter and show users the error
                const isUniqueViolation =
                    error && typeof error === "object" && "code" in error &&
                    (error as { code?: string }).code === "P2002";
                const isDbError = error && typeof error === "object" && "code" in error;
                console.error(
                    "[auth] signIn callback failed:",
                    isUniqueViolation ? "unique constraint violation" : isDbError ? "database error" : error
                );
                return false;
            }
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);
            if (!existingUser) return token;

            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;

            return token;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.sub && session.user) {
                session.user.role = token.role as UserRole;
            }

            return session;
        },
    },
    secret: NEXTAUTH_SECRET,
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig
});