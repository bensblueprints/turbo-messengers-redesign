import type { Metadata } from "next";
import EnhancedServicePage from "@/components/EnhancedServicePage";
import { services, counties } from "@/data/services";
import { getCountyServiceContent } from "@/data/county-service-content";

const service = services["document-retrieval"];
const county = counties["riverside"];
const content = getCountyServiceContent("document-retrieval", "riverside")!;

export const metadata: Metadata = {
  title: `Riverside County Court Document Retrieval | Inland Empire | Turbo Messengers`,
  description: `Court document retrieval from all 6 Riverside County courthouses. Certified copies, judgments, filed pleadings. Corona to Indio coverage. Call (818) 771-0904.`,
  keywords: [
    "document retrieval Riverside County",
    "court records Riverside",
    "get court documents Riverside",
    "certified copies Riverside County",
    "Riverside Superior Court records",
    "retrieve court records Riverside",
    "judgment copy Riverside",
    "Riverside Hall of Justice records",
    "Indio court records",
    "Murrieta court records",
    "Inland Empire court documents",
    "Coachella Valley court records",
  ],
  openGraph: {
    title: `Riverside County Court Document Retrieval | Turbo Messengers`,
    description: `Court document retrieval from all 6 Riverside County courthouses.`,
    type: "website",
    url: "https://turbomessengers.com/services/document-retrieval/riverside",
  },
  alternates: {
    canonical: "/services/document-retrieval/riverside",
  },
};

export default function DocumentRetrievalRiversidePage() {
  return (
    <EnhancedServicePage
      service={service}
      county={county}
      content={content}
      heroImage="/images/riverside-courthouse.jpg"
    />
  );
}
