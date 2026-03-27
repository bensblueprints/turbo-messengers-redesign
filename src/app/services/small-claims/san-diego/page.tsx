import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";
import { services, counties } from "@/data/services";

const service = services["small-claims"];
const county = counties["san-diego"];

export const metadata: Metadata = {
  title: `${service.name} in ${county.name} | Turbo Messengers`,
  description: `Professional ${service.name.toLowerCase()} assistance throughout ${county.name}. ${service.description} Expert help with small claims preparation and filing.`,
  keywords: [
    `small claims ${county.name}`,
    `small claims court ${county.name}`,
    "San Diego small claims",
    "sue in small claims San Diego",
    "small claims preparation",
    "small claims limit California",
    ...county.cities.slice(0, 5).map(city => `small claims ${city}`),
  ],
  openGraph: {
    title: `${service.name} in ${county.name} | Turbo Messengers`,
    description: `Professional ${service.name.toLowerCase()} assistance throughout ${county.name}`,
    type: "website",
  },
};

export default function SmallClaimsSanDiegoPage() {
  return <ServicePage service={service} county={county} />;
}
