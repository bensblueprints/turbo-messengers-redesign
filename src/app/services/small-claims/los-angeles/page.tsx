import type { Metadata } from "next";
import EnhancedServicePage from "@/components/EnhancedServicePage";
import { services, counties } from "@/data/services";
import { getCountyServiceContent } from "@/data/county-service-content";

const service = services["small-claims"];
const county = counties["los-angeles"];
const content = getCountyServiceContent("small-claims", "los-angeles")!;

export const metadata: Metadata = {
  title: `Los Angeles Small Claims Court Help | Document Preparation | Turbo Messengers`,
  description: `Complete small claims document preparation and filing throughout Los Angeles County. Sue for up to $12,500. 78% win rate. Filing at all LA courts. Call (818) 771-0904.`,
  keywords: [
    "small claims Los Angeles",
    "LA small claims court",
    "small claims help Los Angeles",
    "file small claims LA",
    "small claims preparation LA",
    "sue someone Los Angeles",
    "small claims court LA County",
    "Los Angeles small claims filing",
    "small claims lawyer alternative LA",
    "small claims limit California",
    "how to file small claims LA",
    "small claims document preparation",
  ],
  openGraph: {
    title: `Los Angeles Small Claims Court Help | Turbo Messengers`,
    description: `Complete small claims preparation and filing throughout LA County. 78% client win rate.`,
    type: "website",
    url: "https://turbomessengers.com/services/small-claims/los-angeles",
  },
  alternates: {
    canonical: "/services/small-claims/los-angeles",
  },
};

export default function SmallClaimsLosAngelesPage() {
  return (
    <EnhancedServicePage
      service={service}
      county={county}
      content={content}
      heroImage="/images/la-courthouse.jpg"
    />
  );
}
