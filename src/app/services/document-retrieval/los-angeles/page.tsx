import type { Metadata } from "next";
import EnhancedServicePage from "@/components/EnhancedServicePage";
import { services, counties } from "@/data/services";
import { getCountyServiceContent } from "@/data/county-service-content";

const service = services["document-retrieval"];
const county = counties["los-angeles"];
const content = getCountyServiceContent("document-retrieval", "los-angeles")!;

export const metadata: Metadata = {
  title: `Los Angeles Court Document Retrieval | Same-Day Service | Turbo Messengers`,
  description: `Fast court document retrieval from all 12 Los Angeles Superior Court locations. Certified copies, judgments, filed pleadings. Same-day service. Call (818) 771-0904.`,
  keywords: [
    "document retrieval Los Angeles",
    "court records Los Angeles",
    "get court documents LA",
    "certified copies Los Angeles",
    "LA Superior Court records",
    "retrieve court records LA",
    "judgment copy Los Angeles",
    "court file search LA",
    "Stanley Mosk records",
    "legal document copies LA",
    "court document service LA",
    "retrieve filed documents Los Angeles",
  ],
  openGraph: {
    title: `Los Angeles Court Document Retrieval | Turbo Messengers`,
    description: `Same-day court document retrieval from all 12 LA Superior Court locations. Certified copies available.`,
    type: "website",
    url: "https://turbomessengers.com/services/document-retrieval/los-angeles",
  },
  alternates: {
    canonical: "/services/document-retrieval/los-angeles",
  },
};

export default function DocumentRetrievalLosAngelesPage() {
  return (
    <EnhancedServicePage
      service={service}
      county={county}
      content={content}
      heroImage="/images/la-courthouse.jpg"
    />
  );
}
