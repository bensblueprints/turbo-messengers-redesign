import type { Metadata } from "next";
import EnhancedServicePage from "@/components/EnhancedServicePage";
import { services, counties } from "@/data/services";
import { getCountyServiceContent } from "@/data/county-service-content";

const service = services["court-filing"];
const county = counties["ventura"];
const content = getCountyServiceContent("court-filing", "ventura")!;

export const metadata: Metadata = {
  title: `Ventura County Court Filing Services | Same-Day Filing | Turbo Messengers`,
  description: `Same-day court filing at all Ventura County courthouses. Hall of Justice and Simi Valley coverage. Stamped copies returned same day. Call (818) 771-0904.`,
  keywords: [
    "court filing Ventura County",
    "Ventura court filing service",
    "file documents Ventura",
    "Ventura Hall of Justice filing",
    "Simi Valley court filing",
    "same day court filing Ventura",
    "civil filing Ventura County",
    "family law filing Ventura",
    "Ventura Superior Court filing",
    "Thousand Oaks court filing",
    "Oxnard court filing",
  ],
  openGraph: {
    title: `Ventura County Court Filing Services | Turbo Messengers`,
    description: `Same-day court filing at all Ventura County courthouses.`,
    type: "website",
    url: "https://turbomessengers.com/services/court-filing/ventura",
  },
  alternates: {
    canonical: "/services/court-filing/ventura",
  },
};

export default function CourtFilingVenturaPage() {
  return (
    <EnhancedServicePage
      service={service}
      county={county}
      content={content}
      heroImage="/images/ventura-courthouse.jpg"
    />
  );
}
