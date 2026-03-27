import type { Metadata } from "next";
import EnhancedServicePage from "@/components/EnhancedServicePage";
import { services, counties } from "@/data/services";
import { getCountyServiceContent } from "@/data/county-service-content";

const service = services["small-claims"];
const county = counties["orange-county"];
const content = getCountyServiceContent("small-claims", "orange-county")!;

export const metadata: Metadata = {
  title: `Orange County Small Claims Court Help | Document Preparation | Turbo Messengers`,
  description: `Complete small claims preparation and filing throughout Orange County. Sue for up to $12,500. Central Justice Center filing. Service included. Call (818) 771-0904.`,
  keywords: [
    "small claims Orange County",
    "OC small claims court",
    "small claims help Orange County",
    "file small claims OC",
    "small claims preparation Orange County",
    "sue someone Orange County",
    "small claims court OC",
    "Orange County small claims filing",
    "small claims Santa Ana",
    "small claims Irvine",
    "small claims Newport Beach",
    "California small claims limit",
    "how to file small claims OC",
  ],
  openGraph: {
    title: `Orange County Small Claims Court Help | Turbo Messengers`,
    description: `Complete small claims preparation and filing throughout Orange County. Service included.`,
    type: "website",
    url: "https://turbomessengers.com/services/small-claims/orange-county",
  },
  alternates: {
    canonical: "/services/small-claims/orange-county",
  },
};

export default function SmallClaimsOrangeCountyPage() {
  return (
    <EnhancedServicePage
      service={service}
      county={county}
      content={content}
      heroImage="/images/oc-courthouse.jpg"
    />
  );
}
