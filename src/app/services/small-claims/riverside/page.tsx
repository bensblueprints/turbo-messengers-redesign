import type { Metadata } from "next";
import EnhancedServicePage from "@/components/EnhancedServicePage";
import { services, counties } from "@/data/services";
import { getCountyServiceContent } from "@/data/county-service-content";

const service = services["small-claims"];
const county = counties["riverside"];
const content = getCountyServiceContent("small-claims", "riverside")!;

export const metadata: Metadata = {
  title: `Riverside County Small Claims Court Help | Document Preparation | Turbo Messengers`,
  description: `Small claims preparation and filing throughout Riverside County. Inland Empire to Coachella Valley. Sue for up to $12,500. Service included. Call (818) 771-0904.`,
  keywords: [
    "small claims Riverside County",
    "Riverside small claims court",
    "small claims help Riverside",
    "file small claims Riverside",
    "small claims preparation Inland Empire",
    "sue someone Riverside",
    "small claims court Riverside County",
    "small claims Corona",
    "small claims Murrieta",
    "small claims Temecula",
    "small claims Palm Springs",
    "California small claims limit",
  ],
  openGraph: {
    title: `Riverside County Small Claims Court Help | Turbo Messengers`,
    description: `Small claims preparation and filing throughout Riverside County. Service included.`,
    type: "website",
    url: "https://turbomessengers.com/services/small-claims/riverside",
  },
  alternates: {
    canonical: "/services/small-claims/riverside",
  },
};

export default function SmallClaimsRiversidePage() {
  return (
    <EnhancedServicePage
      service={service}
      county={county}
      content={content}
      heroImage="/images/riverside-courthouse.jpg"
    />
  );
}
