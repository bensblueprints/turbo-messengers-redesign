import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";
import { services } from "@/data/services";

const service = services["document-retrieval"];

export const metadata: Metadata = {
  title: `${service.name} | Turbo Messengers - Court Document Retrieval Services`,
  description: service.longDescription,
  keywords: [
    "document retrieval",
    "court records",
    "get court documents",
    "certified copies",
    "case file retrieval",
    "judgment copies",
    "court record search",
    "Southern California document retrieval",
    "Los Angeles court records",
    "legal document copies",
  ],
  openGraph: {
    title: `${service.name} | Turbo Messengers`,
    description: service.description,
    type: "website",
  },
};

export default function DocumentRetrievalPage() {
  return <ServicePage service={service} />;
}
