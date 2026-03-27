import type { Metadata } from "next";
import EnhancedServicePage from "@/components/EnhancedServicePage";
import { services, counties } from "@/data/services";
import { getCountyServiceContent } from "@/data/county-service-content";

const service = services["small-claims"];
const county = counties["san-bernardino"];
const content = getCountyServiceContent("small-claims", "san-bernardino")!;

export const metadata: Metadata = {
  title: `San Bernardino County Small Claims Court Help | Document Preparation | Turbo Messengers`,
  description: `Small claims preparation and filing throughout San Bernardino County. Ontario to Victorville coverage. Sue for up to $12,500. Call (818) 771-0904.`,
  keywords: [
    "small claims San Bernardino County",
    "San Bernardino small claims court",
    "small claims help San Bernardino",
    "file small claims San Bernardino",
    "small claims preparation Inland Empire",
    "sue someone San Bernardino",
    "small claims court San Bernardino County",
    "small claims Ontario",
    "small claims Rancho Cucamonga",
    "small claims Victorville",
    "small claims Fontana",
    "California small claims limit",
  ],
  openGraph: {
    title: `San Bernardino County Small Claims Court Help | Turbo Messengers`,
    description: `Small claims preparation and filing throughout San Bernardino County.`,
    type: "website",
    url: "https://turbomessengers.com/services/small-claims/san-bernardino",
  },
  alternates: {
    canonical: "/services/small-claims/san-bernardino",
  },
};

export default function SmallClaimsSanBernardinoPage() {
  return (
    <EnhancedServicePage
      service={service}
      county={county}
      content={content}
      heroImage="/images/sb-courthouse.jpg"
    />
  );
}
