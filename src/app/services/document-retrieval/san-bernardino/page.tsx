import type { Metadata } from "next";
import EnhancedServicePage from "@/components/EnhancedServicePage";
import { services, counties } from "@/data/services";
import { getCountyServiceContent } from "@/data/county-service-content";

const service = services["document-retrieval"];
const county = counties["san-bernardino"];
const content = getCountyServiceContent("document-retrieval", "san-bernardino")!;

export const metadata: Metadata = {
  title: `San Bernardino County Court Document Retrieval | Turbo Messengers`,
  description: `Court document retrieval from all 6 San Bernardino County courthouses. Valley to high desert coverage. Certified copies available. Call (818) 771-0904.`,
  keywords: [
    "document retrieval San Bernardino County",
    "court records San Bernardino",
    "get court documents San Bernardino",
    "certified copies San Bernardino County",
    "San Bernardino Superior Court records",
    "retrieve court records San Bernardino",
    "judgment copy San Bernardino",
    "San Bernardino Justice Center records",
    "Victorville court records",
    "Rancho Cucamonga court records",
    "Inland Empire court documents",
    "high desert court records",
  ],
  openGraph: {
    title: `San Bernardino County Court Document Retrieval | Turbo Messengers`,
    description: `Court document retrieval from all 6 San Bernardino County courthouses.`,
    type: "website",
    url: "https://turbomessengers.com/services/document-retrieval/san-bernardino",
  },
  alternates: {
    canonical: "/services/document-retrieval/san-bernardino",
  },
};

export default function DocumentRetrievalSanBernardinoPage() {
  return (
    <EnhancedServicePage
      service={service}
      county={county}
      content={content}
      heroImage="/images/sb-courthouse.jpg"
    />
  );
}
