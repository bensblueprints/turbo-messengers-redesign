import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";
import { services } from "@/data/services";

const service = services["small-claims"];

export const metadata: Metadata = {
  title: `${service.name} | Turbo Messengers - Small Claims Court Assistance`,
  description: service.longDescription,
  keywords: [
    "small claims court",
    "small claims filing",
    "small claims preparation",
    "sue in small claims",
    "small claims documents",
    "California small claims",
    "small claims help",
    "small claims limit",
    "judgment collection",
    "small claims service",
  ],
  openGraph: {
    title: `${service.name} | Turbo Messengers`,
    description: service.description,
    type: "website",
  },
};

export default function SmallClaimsPage() {
  return <ServicePage service={service} />;
}
