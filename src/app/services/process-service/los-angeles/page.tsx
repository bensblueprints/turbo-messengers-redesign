import type { Metadata } from "next";
import EnhancedServicePage from "@/components/EnhancedServicePage";
import { services, counties } from "@/data/services";
import { getCountyServiceContent } from "@/data/county-service-content";

const service = services["process-service"];
const county = counties["los-angeles"];
const content = getCountyServiceContent("process-service", "los-angeles")!;

export const metadata: Metadata = {
  title: `Process Servers in Los Angeles County | Turbo Messengers`,
  description: `Professional process servers serving legal documents throughout Los Angeles County since 2009. Same-day service at all 12 LA Superior Court locations. 98% first-attempt success rate. Call (818) 771-0904.`,
  keywords: [
    "process server Los Angeles",
    "Los Angeles process serving",
    "serve papers Los Angeles",
    "process service LA County",
    "LA process server",
    "Stanley Mosk Courthouse process server",
    "Van Nuys process server",
    "Torrance process server",
    "Beverly Hills process server",
    "Santa Monica process server",
    "Pasadena process server",
    "Long Beach process server",
    "Glendale process server",
    "Burbank process server",
    "same day process service Los Angeles",
    "rush process server LA",
    "serve subpoena Los Angeles",
    "serve summons LA County",
  ],
  openGraph: {
    title: `Process Servers in Los Angeles County | Turbo Messengers`,
    description: `Professional process servers throughout Los Angeles County. 98% first-attempt success rate. Same-day service available.`,
    type: "website",
    url: "https://turbomessengers.com/services/process-service/los-angeles",
  },
  alternates: {
    canonical: "/services/process-service/los-angeles",
  },
};

export default function ProcessServiceLosAngelesPage() {
  return (
    <EnhancedServicePage
      service={service}
      county={county}
      content={content}
      heroImage="/images/la-courthouse.jpg"
    />
  );
}
