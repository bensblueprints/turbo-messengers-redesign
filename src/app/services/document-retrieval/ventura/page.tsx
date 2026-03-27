import type { Metadata } from "next";
import EnhancedServicePage from "@/components/EnhancedServicePage";
import { services, counties } from "@/data/services";
import { getCountyServiceContent } from "@/data/county-service-content";

const service = services["document-retrieval"];
const county = counties["ventura"];
const content = getCountyServiceContent("document-retrieval", "ventura")!;

export const metadata: Metadata = {
  title: `Ventura County Court Document Retrieval | Same-Day Service | Turbo Messengers`,
  description: `Fast court document retrieval from all Ventura County courthouses. Certified copies, judgments, filed pleadings. Same-day service. Call (818) 771-0904.`,
  keywords: [
    "document retrieval Ventura County",
    "court records Ventura",
    "get court documents Ventura",
    "certified copies Ventura County",
    "Ventura Superior Court records",
    "retrieve court records Ventura",
    "judgment copy Ventura",
    "Ventura Hall of Justice records",
    "Simi Valley court records",
    "Thousand Oaks court documents",
    "Oxnard court records",
  ],
  openGraph: {
    title: `Ventura County Court Document Retrieval | Turbo Messengers`,
    description: `Same-day court document retrieval from all Ventura County courthouses.`,
    type: "website",
    url: "https://turbomessengers.com/services/document-retrieval/ventura",
  },
  alternates: {
    canonical: "/services/document-retrieval/ventura",
  },
};

export default function DocumentRetrievalVenturaPage() {
  return (
    <EnhancedServicePage
      service={service}
      county={county}
      content={content}
      heroImage="/images/ventura-courthouse.jpg"
    />
  );
}
