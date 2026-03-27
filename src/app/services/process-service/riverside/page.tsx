import type { Metadata } from "next";
import EnhancedServicePage from "@/components/EnhancedServicePage";
import { services, counties } from "@/data/services";
import { getCountyServiceContent } from "@/data/county-service-content";

const service = services["process-service"];
const county = counties["riverside"];
const content = getCountyServiceContent("process-service", "riverside")!;

export const metadata: Metadata = {
  title: `Process Servers in Riverside County CA | Inland Empire | Turbo Messengers`,
  description: `Professional process servers throughout Riverside County from Corona to Palm Springs. Inland Empire & Coachella Valley coverage. Same-day service. Call (818) 771-0904.`,
  keywords: [
    "process server Riverside County",
    "Riverside process serving",
    "serve papers Riverside",
    "Inland Empire process server",
    "Corona process server",
    "Murrieta process server",
    "Temecula process server",
    "Palm Springs process server",
    "Palm Desert process server",
    "Moreno Valley process server",
    "Riverside Hall of Justice",
    "same day process service Riverside",
    "Coachella Valley process server",
    "serve subpoena Riverside County",
  ],
  openGraph: {
    title: `Process Servers in Riverside County | Turbo Messengers`,
    description: `Professional process servers throughout Riverside County from Corona to Palm Springs.`,
    type: "website",
    url: "https://turbomessengers.com/services/process-service/riverside",
  },
  alternates: {
    canonical: "/services/process-service/riverside",
  },
};

export default function ProcessServiceRiversidePage() {
  return (
    <EnhancedServicePage
      service={service}
      county={county}
      content={content}
      heroImage="/images/riverside-courthouse.jpg"
    />
  );
}
