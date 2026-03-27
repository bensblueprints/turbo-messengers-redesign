import type { Metadata } from "next";
import EnhancedServicePage from "@/components/EnhancedServicePage";
import { services, counties } from "@/data/services";
import { getCountyServiceContent } from "@/data/county-service-content";

const service = services["process-service"];
const county = counties["ventura"];
const content = getCountyServiceContent("process-service", "ventura")!;

export const metadata: Metadata = {
  title: `Process Servers in Ventura County CA | Turbo Messengers`,
  description: `Professional process servers throughout Ventura County including Thousand Oaks, Oxnard, Simi Valley, Camarillo. Gated community experts. Call (818) 771-0904.`,
  keywords: [
    "process server Ventura County",
    "Ventura process serving",
    "serve papers Ventura",
    "Thousand Oaks process server",
    "Oxnard process server",
    "Simi Valley process server",
    "Camarillo process server",
    "Moorpark process server",
    "Westlake Village process server",
    "Conejo Valley process server",
    "Ventura County Superior Court",
    "same day process service Ventura",
    "serve subpoena Ventura County",
  ],
  openGraph: {
    title: `Process Servers in Ventura County | Turbo Messengers`,
    description: `Professional process servers throughout Ventura County including Thousand Oaks and Oxnard.`,
    type: "website",
    url: "https://turbomessengers.com/services/process-service/ventura",
  },
  alternates: {
    canonical: "/services/process-service/ventura",
  },
};

export default function ProcessServiceVenturaPage() {
  return (
    <EnhancedServicePage
      service={service}
      county={county}
      content={content}
      heroImage="/images/ventura-courthouse.jpg"
    />
  );
}
