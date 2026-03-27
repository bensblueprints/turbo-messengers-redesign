import type { Metadata } from "next";
import EnhancedServicePage from "@/components/EnhancedServicePage";
import { services, counties } from "@/data/services";
import { getCountyServiceContent } from "@/data/county-service-content";

const service = services["process-service"];
const county = counties["san-bernardino"];
const content = getCountyServiceContent("process-service", "san-bernardino")!;

export const metadata: Metadata = {
  title: `Process Servers in San Bernardino County CA | Turbo Messengers`,
  description: `Professional process servers throughout San Bernardino County from Ontario to Victorville. Largest county in America covered. Same-day service. Call (818) 771-0904.`,
  keywords: [
    "process server San Bernardino County",
    "San Bernardino process serving",
    "serve papers San Bernardino",
    "Inland Empire process server",
    "Ontario process server",
    "Rancho Cucamonga process server",
    "Fontana process server",
    "Victorville process server",
    "Hesperia process server",
    "Upland process server",
    "high desert process server",
    "San Bernardino Justice Center",
    "same day process service San Bernardino",
    "serve subpoena San Bernardino County",
  ],
  openGraph: {
    title: `Process Servers in San Bernardino County | Turbo Messengers`,
    description: `Professional process servers throughout San Bernardino County from Ontario to Victorville.`,
    type: "website",
    url: "https://turbomessengers.com/services/process-service/san-bernardino",
  },
  alternates: {
    canonical: "/services/process-service/san-bernardino",
  },
};

export default function ProcessServiceSanBernardinoPage() {
  return (
    <EnhancedServicePage
      service={service}
      county={county}
      content={content}
      heroImage="/images/sb-courthouse.jpg"
    />
  );
}
