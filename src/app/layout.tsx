import type { Metadata } from "next";
import "./globals.css";
import Link from 'next/link'
import Image from 'next/image'
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import GsapAnimations from "@/components/GsapAnimations";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import NavDropdown from "@/components/NavDropdown";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

export const metadata: Metadata = {
  title: "Portfolio | Design & Code",
  description: "Modernes Portfolio für Webdesign, Entwicklung und Fotografie.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="de" suppressHydrationWarning>
        <body className="antialiased">
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <GsapAnimations />
            <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border-custom">
              <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                  <Image
                    src="/giuseppetroiano_logo_dark.png"
                    alt="Portfolio Logo"
                    width={160}
                    height={50}
                    className="h-auto logo-image"
                    priority
                  />
                </Link>

                <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide items-center">
                  <Link href="/?category=all" className="hover:text-muted-custom transition-colors uppercase">Alle</Link>
                  <Link href="/?category=webdesign" className="hover:text-muted-custom transition-colors uppercase">Webdesign</Link>
                  <Link href="/?category=webentwickler" className="hover:text-muted-custom transition-colors uppercase">Entwicklung</Link>
                  <Link href="/?category=fotograf" className="hover:text-muted-custom transition-colors uppercase">Fotografie</Link>
                  <NavDropdown />
                  <Link href="/contact" className="hover:text-muted-custom transition-colors uppercase">Kontakt</Link>
                </div>

                <div className="flex items-center gap-4">
                  <ThemeSwitcher />
                  <Link
                    href="/admin"
                    className="px-4 py-2 border border-border-custom hover:border-foreground transition-colors text-xs font-bold uppercase tracking-widest rounded-full"
                  >
                    Admin
                  </Link>
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="text-xs font-bold uppercase tracking-widest hover:text-muted-custom transition-colors">Login</button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-8 h-8' } }} />
                  </SignedIn>
                </div>
              </nav>
            </header>
            <main>{children}</main>
            <Footer />
            <ChatBot />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
