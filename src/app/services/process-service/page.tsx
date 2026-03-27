import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";
import { services } from "@/data/services";

const service = services["process-service"];

export const metadata: Metadata = {
  title: `${service.name} | Turbo Messengers - Southern California Process Servers`,
  description: service.longDescription,
  keywords: [
    "process server",
    "process service",
    "serve legal documents",
    "summons service",
    "subpoena service",
    "Southern California process server",
    "Los Angeles process server",
    "Orange County process server",
    "registered process server",
    "bonded process server",
  ],
  openGraph: {
    title: `${service.name} | Turbo Messengers`,
    description: service.description,
    type: "website",
  },
};

export default function ProcessServicePage() {
  return <ServicePage service={service} />;
}
