import type { Metadata } from "next";
import EnhancedServicePage from "@/components/EnhancedServicePage";
import { services, counties } from "@/data/services";
import { getCountyServiceContent } from "@/data/county-service-content";

const service = services["court-filing"];
const county = counties["san-diego"];
const content = getCountyServiceContent("court-filing", "san-diego")!;

export const metadata: Metadata = {
  title: `San Diego County Court Filing Services | Same-Day Filing | Turbo Messengers`,
  description: `Court filing at all 6 San Diego County courthouses. Central Courthouse, Vista, Chula Vista, El Cajon. Same-day filing. Call (818) 771-0904.`,
  keywords: [
    "court filing San Diego",
    "San Diego court filing service",
    "file documents San Diego",
    "San Diego Central Courthouse filing",
    "same day court filing San Diego",
    "civil filing San Diego County",
    "family law filing San Diego",
    "San Diego Superior Court filing",
    "Vista court filing",
    "Chula Vista court filing",
    "El Cajon court filing",
    "North County court filing",
  ],
  openGraph: {
    title: `San Diego County Court Filing Services | Turbo Messengers`,
    description: `Court filing at all 6 San Diego County courthouses. Same-day filing available.`,
    type: "website",
    url: "https://turbomessengers.com/services/court-filing/san-diego",
  },
  alternates: {
    canonical: "/services/court-filing/san-diego",
  },
};

export default function CourtFilingSanDiegoPage() {
  return (
    <EnhancedServicePage
      service={service}
      county={county}
      content={content}
      heroImage="/images/sd-courthouse.jpg"
    />
  );
}
