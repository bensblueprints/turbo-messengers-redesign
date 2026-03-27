import type { Metadata } from "next";
import EnhancedServicePage from "@/components/EnhancedServicePage";
import { services, counties } from "@/data/services";
import { getCountyServiceContent } from "@/data/county-service-content";

const service = services["process-service"];
const county = counties["san-diego"];
const content = getCountyServiceContent("process-service", "san-diego")!;

export const metadata: Metadata = {
  title: `Process Servers in San Diego County CA | Turbo Messengers`,
  description: `Professional process servers throughout San Diego County from Oceanside to Chula Vista. Military base expertise. Same-day service. Call (818) 771-0904.`,
  keywords: [
    "process server San Diego",
    "San Diego process serving",
    "serve papers San Diego",
    "San Diego process server",
    "Chula Vista process server",
    "Oceanside process server",
    "Escondido process server",
    "Carlsbad process server",
    "La Jolla process server",
    "El Cajon process server",
    "military process server San Diego",
    "San Diego Central Courthouse",
    "same day process service San Diego",
    "serve subpoena San Diego County",
  ],
  openGraph: {
    title: `Process Servers in San Diego County | Turbo Messengers`,
    description: `Professional process servers throughout San Diego County. Military base expertise. Same-day service.`,
    type: "website",
    url: "https://turbomessengers.com/services/process-service/san-diego",
  },
  alternates: {
    canonical: "/services/process-service/san-diego",
  },
};

export default function ProcessServiceSanDiegoPage() {
  return (
    <EnhancedServicePage
      service={service}
      county={county}
      content={content}
      heroImage="/images/sd-courthouse.jpg"
    />
  );
}
