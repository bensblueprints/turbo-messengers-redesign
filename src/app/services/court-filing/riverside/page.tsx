import type { Metadata } from "next";
import EnhancedServicePage from "@/components/EnhancedServicePage";
import { services, counties } from "@/data/services";
import { getCountyServiceContent } from "@/data/county-service-content";

const service = services["court-filing"];
const county = counties["riverside"];
const content = getCountyServiceContent("court-filing", "riverside")!;

export const metadata: Metadata = {
  title: `Riverside County Court Filing Services | Same-Day Filing | Turbo Messengers`,
  description: `Court filing at all 6 Riverside County courthouses from Corona to Indio. Same-day filing in Western Riverside. Desert court coverage. Call (818) 771-0904.`,
  keywords: [
    "court filing Riverside County",
    "Riverside court filing service",
    "file documents Riverside",
    "Riverside Hall of Justice filing",
    "Murrieta court filing",
    "same day court filing Riverside",
    "Indio court filing",
    "civil filing Riverside County",
    "family law filing Riverside",
    "Riverside Superior Court filing",
    "Southwest Justice Center filing",
    "Larson Justice Center filing",
    "Palm Springs court filing",
  ],
  openGraph: {
    title: `Riverside County Court Filing Services | Turbo Messengers`,
    description: `Court filing at all 6 Riverside County courthouses from Corona to Indio.`,
    type: "website",
    url: "https://turbomessengers.com/services/court-filing/riverside",
  },
  alternates: {
    canonical: "/services/court-filing/riverside",
  },
};

export default function CourtFilingRiversidePage() {
  return (
    <EnhancedServicePage
      service={service}
      county={county}
      content={content}
      heroImage="/images/riverside-courthouse.jpg"
    />
  );
}
