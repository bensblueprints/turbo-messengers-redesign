import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";
import { services, counties } from "@/data/services";

const service = services["document-retrieval"];
const county = counties["los-angeles"];

export const metadata: Metadata = {
  title: `${service.name} in ${county.name} | Turbo Messengers`,
  description: `Professional ${service.name.toLowerCase()} throughout ${county.name}. ${service.description} Fast retrieval of court records and filed documents.`,
  keywords: [
    `document retrieval ${county.name}`,
    `court records ${county.name}`,
    "Los Angeles court records",
    "get court documents LA",
    "certified copies Los Angeles",
    "case file retrieval",
    ...county.cities.slice(0, 5).map(city => `document retrieval ${city}`),
  ],
  openGraph: {
    title: `${service.name} in ${county.name} | Turbo Messengers`,
    description: `Professional ${service.name.toLowerCase()} throughout ${county.name}`,
    type: "website",
  },
};

export default function DocumentRetrievalLosAngelesPage() {
  return <ServicePage service={service} county={county} />;
}
