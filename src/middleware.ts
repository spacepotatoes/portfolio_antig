import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    if (isAdminRoute(req)) {
        console.log(`Checking admin route access for: ${req.url}`);
        const { userId } = await auth();

        // Fallback if no user is logged in
        if (!userId) {
            console.log("No userId found, redirecting to sign-in");
            return (await auth()).redirectToSignIn();
        }

        console.log(`Authenticated user: ${userId}`);

        // Strict access control: Only allow the ID specified in .env
        const allowedId = process.env.ALLOWED_USER_ID;
        if (allowedId && allowedId !== 'user_2xxxxxxxxxxxxxxxxxxxxxxx' && userId !== allowedId) {
            console.warn(`Access denied for user ${userId}. Expected ${allowedId}`);
            return NextResponse.redirect(new URL("/", req.url));
        }

        console.log("Access granted to admin route");
        await auth.protect();
    }
});

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};
