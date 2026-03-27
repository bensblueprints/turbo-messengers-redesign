import type { Metadata } from "next";
import EnhancedServicePage from "@/components/EnhancedServicePage";
import { services, counties } from "@/data/services";
import { getCountyServiceContent } from "@/data/county-service-content";

const service = services["document-retrieval"];
const county = counties["orange-county"];
const content = getCountyServiceContent("document-retrieval", "orange-county")!;

export const metadata: Metadata = {
  title: `Orange County Court Document Retrieval | Same-Day Service | Turbo Messengers`,
  description: `Fast court document retrieval from all 5 Orange County justice centers. Certified copies, judgments, filed pleadings. Same-day service. Call (818) 771-0904.`,
  keywords: [
    "document retrieval Orange County",
    "court records Orange County",
    "get court documents OC",
    "certified copies Orange County",
    "OC Superior Court records",
    "retrieve court records OC",
    "judgment copy Orange County",
    "court file search OC",
    "Central Justice Center records",
    "legal document copies Orange County",
    "court document service OC",
    "retrieve filed documents Orange County",
  ],
  openGraph: {
    title: `Orange County Court Document Retrieval | Turbo Messengers`,
    description: `Same-day court document retrieval from all 5 OC justice centers. Certified copies available.`,
    type: "website",
    url: "https://turbomessengers.com/services/document-retrieval/orange-county",
  },
  alternates: {
    canonical: "/services/document-retrieval/orange-county",
  },
};

export default function DocumentRetrievalOrangeCountyPage() {
  return (
    <EnhancedServicePage
      service={service}
      county={county}
      content={content}
      heroImage="/images/oc-courthouse.jpg"
    />
  );
}
