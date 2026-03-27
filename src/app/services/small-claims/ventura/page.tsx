import type { Metadata } from "next";
import EnhancedServicePage from "@/components/EnhancedServicePage";
import { services, counties } from "@/data/services";
import { getCountyServiceContent } from "@/data/county-service-content";

const service = services["small-claims"];
const county = counties["ventura"];
const content = getCountyServiceContent("small-claims", "ventura")!;

export const metadata: Metadata = {
  title: `Ventura County Small Claims Court Help | Document Preparation | Turbo Messengers`,
  description: `Small claims preparation and filing throughout Ventura County. Thousand Oaks to Oxnard. Sue for up to $12,500. Service included. Call (818) 771-0904.`,
  keywords: [
    "small claims Ventura County",
    "Ventura small claims court",
    "small claims help Ventura",
    "file small claims Ventura",
    "small claims preparation Ventura",
    "sue someone Ventura",
    "small claims court Ventura County",
    "small claims Thousand Oaks",
    "small claims Oxnard",
    "small claims Simi Valley",
    "small claims Camarillo",
    "California small claims limit",
  ],
  openGraph: {
    title: `Ventura County Small Claims Court Help | Turbo Messengers`,
    description: `Small claims preparation and filing throughout Ventura County.`,
    type: "website",
    url: "https://turbomessengers.com/services/small-claims/ventura",
  },
  alternates: {
    canonical: "/services/small-claims/ventura",
  },
};

export default function SmallClaimsVenturaPage() {
  return (
    <EnhancedServicePage
      service={service}
      county={county}
      content={content}
      heroImage="/images/ventura-courthouse.jpg"
    />
  );
}
