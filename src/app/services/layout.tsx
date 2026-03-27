import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Turbo Messengers",
  description: "Professional process serving, court filing, small claims, and document retrieval services throughout Southern California.",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
