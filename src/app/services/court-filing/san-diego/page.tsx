import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";
import { services, counties } from "@/data/services";

const service = services["court-filing"];
const county = counties["san-diego"];

export const metadata: Metadata = {
  title: `${service.name} in ${county.name} | Turbo Messengers`,
  description: `Professional ${service.name.toLowerCase()} throughout ${county.name}. ${service.description} Same-day filing at all ${county.name} courts.`,
  keywords: [
    `court filing ${county.name}`,
    `file court documents ${county.name}`,
    "San Diego court filing",
    "San Diego Central Courthouse filing",
    "San Diego Superior Court filing",
    "same day court filing San Diego",
    ...county.cities.slice(0, 5).map(city => `court filing ${city}`),
  ],
  openGraph: {
    title: `${service.name} in ${county.name} | Turbo Messengers`,
    description: `Professional ${service.name.toLowerCase()} throughout ${county.name}`,
    type: "website",
  },
};

export default function CourtFilingSanDiegoPage() {
  return <ServicePage service={service} county={county} />;
}
