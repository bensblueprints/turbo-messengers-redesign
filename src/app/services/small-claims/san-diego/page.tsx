import type { Metadata } from "next";
import EnhancedServicePage from "@/components/EnhancedServicePage";
import { services, counties } from "@/data/services";
import { getCountyServiceContent } from "@/data/county-service-content";

const service = services["small-claims"];
const county = counties["san-diego"];
const content = getCountyServiceContent("small-claims", "san-diego")!;

export const metadata: Metadata = {
  title: `San Diego County Small Claims Court Help | Document Preparation | Turbo Messengers`,
  description: `Small claims preparation and filing throughout San Diego County. Oceanside to Chula Vista. Sue for up to $12,500. Service included. Call (818) 771-0904.`,
  keywords: [
    "small claims San Diego",
    "San Diego small claims court",
    "small claims help San Diego",
    "file small claims San Diego",
    "small claims preparation San Diego",
    "sue someone San Diego",
    "small claims court San Diego County",
    "small claims Chula Vista",
    "small claims Oceanside",
    "small claims Escondido",
    "small claims Carlsbad",
    "California small claims limit",
  ],
  openGraph: {
    title: `San Diego County Small Claims Court Help | Turbo Messengers`,
    description: `Small claims preparation and filing throughout San Diego County.`,
    type: "website",
    url: "https://turbomessengers.com/services/small-claims/san-diego",
  },
  alternates: {
    canonical: "/services/small-claims/san-diego",
  },
};

export default function SmallClaimsSanDiegoPage() {
  return (
    <EnhancedServicePage
      service={service}
      county={county}
      content={content}
      heroImage="/images/sd-courthouse.jpg"
    />
  );
}
