import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";
import { services, counties } from "@/data/services";

const service = services["court-filing"];
const county = counties["ventura"];

export const metadata: Metadata = {
  title: `${service.name} in ${county.name} | Turbo Messengers`,
  description: `Professional ${service.name.toLowerCase()} throughout ${county.name}. ${service.description} Same-day filing at all ${county.name} courts.`,
  keywords: [
    `court filing ${county.name}`,
    `file court documents ${county.name}`,
    "Ventura court filing",
    "Ventura County Superior Court filing",
    "same day court filing Ventura",
    ...county.cities.slice(0, 5).map(city => `court filing ${city}`),
  ],
  openGraph: {
    title: `${service.name} in ${county.name} | Turbo Messengers`,
    description: `Professional ${service.name.toLowerCase()} throughout ${county.name}`,
    type: "website",
  },
};

export default function CourtFilingVenturaPage() {
  return <ServicePage service={service} county={county} />;
}
