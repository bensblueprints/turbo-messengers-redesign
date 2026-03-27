import type { Metadata } from "next";
import EnhancedServicePage from "@/components/EnhancedServicePage";
import { services, counties } from "@/data/services";
import { getCountyServiceContent } from "@/data/county-service-content";

const service = services["court-filing"];
const county = counties["los-angeles"];
const content = getCountyServiceContent("court-filing", "los-angeles")!;

export const metadata: Metadata = {
  title: `Los Angeles Court Filing Services | Same-Day Filing | Turbo Messengers`,
  description: `Same-day court filing at all 12 Los Angeles Superior Court locations. Professional document filing since 2009. Stamped copies returned by end of day. Call (818) 771-0904.`,
  keywords: [
    "court filing Los Angeles",
    "LA court filing service",
    "file documents Los Angeles",
    "Stanley Mosk Courthouse filing",
    "Van Nuys court filing",
    "same day court filing LA",
    "rush filing Los Angeles",
    "civil filing Los Angeles",
    "family law filing LA",
    "probate filing Los Angeles",
    "LA Superior Court filing",
    "document filing service LA",
    "court runner Los Angeles",
    "legal filing service LA County",
  ],
  openGraph: {
    title: `Los Angeles Court Filing Services | Turbo Messengers`,
    description: `Same-day court filing at all 12 LA Superior Court locations. Stamped copies returned by end of day.`,
    type: "website",
    url: "https://turbomessengers.com/services/court-filing/los-angeles",
  },
  alternates: {
    canonical: "/services/court-filing/los-angeles",
  },
};

export default function CourtFilingLosAngelesPage() {
  return (
    <EnhancedServicePage
      service={service}
      county={county}
      content={content}
      heroImage="/images/la-courthouse.jpg"
    />
  );
}
