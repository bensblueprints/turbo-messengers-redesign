import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Turbo Messengers | Los Angeles Premier Process Serving & Court Filing",
  description: "Fast, Reliable and Honest. Registered and Bonded Process Servers serving all of Southern California. Court filings, service of process, and messenger services.",
  keywords: "process server, court filing, messenger service, Los Angeles, Southern California, legal documents, service of process",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://elevenlabs.io/convai-widget/index.js" async></script>
      </head>
      <body>
        <Providers>
          <div className="noise-overlay" aria-hidden="true" />
          {children}
          {/* ElevenLabs Voice Agent Widget */}
          <elevenlabs-convai agent-id="agent_0801kmpmtnevfk0bmxfkctp7t0fp"></elevenlabs-convai>
        </Providers>
      </body>
    </html>
  );
}
