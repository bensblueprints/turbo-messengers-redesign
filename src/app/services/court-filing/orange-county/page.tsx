import type { Metadata } from "next";
import EnhancedServicePage from "@/components/EnhancedServicePage";
import { services, counties } from "@/data/services";
import { getCountyServiceContent } from "@/data/county-service-content";

const service = services["court-filing"];
const county = counties["orange-county"];
const content = getCountyServiceContent("court-filing", "orange-county")!;

export const metadata: Metadata = {
  title: `Orange County Court Filing Services | Same-Day Filing | Turbo Messengers`,
  description: `Same-day court filing at all 5 Orange County justice centers. Central Justice Center, Harbor, North, West, Lamoreaux. Stamped copies same day. Call (818) 771-0904.`,
  keywords: [
    "court filing Orange County",
    "OC court filing service",
    "file documents Orange County",
    "Central Justice Center filing",
    "Santa Ana court filing",
    "same day court filing OC",
    "rush filing Orange County",
    "civil filing Orange County",
    "family law filing OC",
    "OC Superior Court filing",
    "document filing service Orange County",
    "court runner Orange County",
    "Lamoreaux Justice Center filing",
    "Harbor Justice Center filing",
  ],
  openGraph: {
    title: `Orange County Court Filing Services | Turbo Messengers`,
    description: `Same-day court filing at all 5 OC justice centers. Stamped copies returned same day.`,
    type: "website",
    url: "https://turbomessengers.com/services/court-filing/orange-county",
  },
  alternates: {
    canonical: "/services/court-filing/orange-county",
  },
};

export default function CourtFilingOrangeCountyPage() {
  return (
    <EnhancedServicePage
      service={service}
      county={county}
      content={content}
      heroImage="/images/oc-courthouse.jpg"
    />
  );
}
