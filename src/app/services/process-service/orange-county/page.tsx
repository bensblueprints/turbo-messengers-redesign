import type { Metadata } from "next";
import EnhancedServicePage from "@/components/EnhancedServicePage";
import { services, counties } from "@/data/services";
import { getCountyServiceContent } from "@/data/county-service-content";

const service = services["process-service"];
const county = counties["orange-county"];
const content = getCountyServiceContent("process-service", "orange-county")!;

export const metadata: Metadata = {
  title: `Process Servers in Orange County CA | Turbo Messengers`,
  description: `Professional process servers throughout Orange County including Irvine, Anaheim, Santa Ana, Newport Beach. Gated community experts. Same-day service. Call (818) 771-0904.`,
  keywords: [
    "process server Orange County",
    "Orange County process serving",
    "serve papers Orange County",
    "process service OC",
    "Irvine process server",
    "Anaheim process server",
    "Newport Beach process server",
    "Santa Ana process server",
    "Huntington Beach process server",
    "Costa Mesa process server",
    "gated community process server OC",
    "Central Justice Center process server",
    "same day process service Orange County",
    "rush process server OC",
    "serve subpoena Orange County",
  ],
  openGraph: {
    title: `Process Servers in Orange County | Turbo Messengers`,
    description: `Professional process servers throughout Orange County. Gated community experts. Same-day service available.`,
    type: "website",
    url: "https://turbomessengers.com/services/process-service/orange-county",
  },
  alternates: {
    canonical: "/services/process-service/orange-county",
  },
};

export default function ProcessServiceOrangeCountyPage() {
  return (
    <EnhancedServicePage
      service={service}
      county={county}
      content={content}
      heroImage="/images/oc-courthouse.jpg"
    />
  );
}
