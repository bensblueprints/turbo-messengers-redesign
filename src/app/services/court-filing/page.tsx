import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";
import { services } from "@/data/services";

const service = services["court-filing"];

export const metadata: Metadata = {
  title: `${service.name} | Turbo Messengers - Southern California Court Filing Services`,
  description: service.longDescription,
  keywords: [
    "court filing service",
    "file court documents",
    "same day court filing",
    "legal document filing",
    "Superior Court filing",
    "Federal Court filing",
    "Southern California court filing",
    "Los Angeles court filing",
    "Orange County court filing",
    "e-filing service",
  ],
  openGraph: {
    title: `${service.name} | Turbo Messengers`,
    description: service.description,
    type: "website",
  },
};

export default function CourtFilingPage() {
  return <ServicePage service={service} />;
}
