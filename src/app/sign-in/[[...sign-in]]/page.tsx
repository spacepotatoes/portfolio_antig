import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black py-20">
            <SignIn
                appearance={{
                    elements: {
                        formButtonPrimary: "bg-white text-black hover:bg-zinc-200",
                        card: "bg-zinc-900 border border-zinc-800",
                        headerTitle: "text-white font-black",
                        headerSubtitle: "text-zinc-400",
                        socialButtonsBlockButton: "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700",
                        socialButtonsBlockButtonText: "text-white",
                        formFieldLabel: "text-zinc-400",
                        formFieldInput: "bg-black border-zinc-800 text-white",
                        footerActionText: "text-zinc-500",
                        footerActionLink: "text-white hover:text-zinc-300"
                    }
                }}
            />
        </div>
    );
}
