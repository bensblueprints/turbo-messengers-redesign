import type { Metadata } from "next";
import EnhancedServicePage from "@/components/EnhancedServicePage";
import { services, counties } from "@/data/services";
import { getCountyServiceContent } from "@/data/county-service-content";

const service = services["court-filing"];
const county = counties["san-bernardino"];
const content = getCountyServiceContent("court-filing", "san-bernardino")!;

export const metadata: Metadata = {
  title: `San Bernardino County Court Filing Services | Same-Day Filing | Turbo Messengers`,
  description: `Court filing at all 6 San Bernardino County courthouses. Valley and high desert coverage. Same-day filing available. Call (818) 771-0904.`,
  keywords: [
    "court filing San Bernardino County",
    "San Bernardino court filing service",
    "file documents San Bernardino",
    "San Bernardino Justice Center filing",
    "Rancho Cucamonga court filing",
    "same day court filing San Bernardino",
    "Victorville court filing",
    "civil filing San Bernardino County",
    "family law filing San Bernardino",
    "San Bernardino Superior Court filing",
    "Fontana court filing",
    "high desert court filing",
  ],
  openGraph: {
    title: `San Bernardino County Court Filing Services | Turbo Messengers`,
    description: `Court filing at all 6 San Bernardino County courthouses. Valley and high desert.`,
    type: "website",
    url: "https://turbomessengers.com/services/court-filing/san-bernardino",
  },
  alternates: {
    canonical: "/services/court-filing/san-bernardino",
  },
};

export default function CourtFilingSanBernardinoPage() {
  return (
    <EnhancedServicePage
      service={service}
      county={county}
      content={content}
      heroImage="/images/sb-courthouse.jpg"
    />
  );
}
