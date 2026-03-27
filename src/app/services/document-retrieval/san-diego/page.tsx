import type { Metadata } from "next";
import EnhancedServicePage from "@/components/EnhancedServicePage";
import { services, counties } from "@/data/services";
import { getCountyServiceContent } from "@/data/county-service-content";

const service = services["document-retrieval"];
const county = counties["san-diego"];
const content = getCountyServiceContent("document-retrieval", "san-diego")!;

export const metadata: Metadata = {
  title: `San Diego County Court Document Retrieval | Same-Day Service | Turbo Messengers`,
  description: `Court document retrieval from all 6 San Diego County courthouses. Certified copies, judgments, filed pleadings. Same-day service. Call (818) 771-0904.`,
  keywords: [
    "document retrieval San Diego",
    "court records San Diego",
    "get court documents San Diego",
    "certified copies San Diego County",
    "San Diego Superior Court records",
    "retrieve court records San Diego",
    "judgment copy San Diego",
    "San Diego Central Courthouse records",
    "Vista court records",
    "Chula Vista court records",
    "El Cajon court records",
    "North County court documents",
  ],
  openGraph: {
    title: `San Diego County Court Document Retrieval | Turbo Messengers`,
    description: `Court document retrieval from all 6 San Diego County courthouses.`,
    type: "website",
    url: "https://turbomessengers.com/services/document-retrieval/san-diego",
  },
  alternates: {
    canonical: "/services/document-retrieval/san-diego",
  },
};

export default function DocumentRetrievalSanDiegoPage() {
  return (
    <EnhancedServicePage
      service={service}
      county={county}
      content={content}
      heroImage="/images/sd-courthouse.jpg"
    />
  );
}
