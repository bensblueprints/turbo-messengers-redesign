import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";
import { services, counties } from "@/data/services";

const service = services["process-service"];
const county = counties["san-bernardino"];

export const metadata: Metadata = {
  title: `${service.name} in ${county.name} | Turbo Messengers`,
  description: `Professional ${service.name.toLowerCase()} throughout ${county.name}. ${service.description} Same-day service available at all ${county.name} courts.`,
  keywords: [
    `process server ${county.name}`,
    `process service ${county.name}`,
    "San Bernardino process server",
    "serve papers San Bernardino",
    "San Bernardino Justice Center",
    "Inland Empire process server",
    ...county.cities.slice(0, 5).map(city => `process server ${city}`),
  ],
  openGraph: {
    title: `${service.name} in ${county.name} | Turbo Messengers`,
    description: `Professional ${service.name.toLowerCase()} throughout ${county.name}`,
    type: "website",
  },
};

export default function ProcessServiceSanBernardinoPage() {
  return <ServicePage service={service} county={county} />;
}
