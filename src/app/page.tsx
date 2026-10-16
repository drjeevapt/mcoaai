import { Hero } from "@/components/home/Hero";
import { WhyMcoa } from "@/components/home/WhyMcoa";
import { CoursesShowcase } from "@/components/home/CoursesShowcase";
import { FounderSection } from "@/components/home/FounderSection";
import { BranchesSection } from "@/components/home/BranchesSection";
import { LeadInquiryModal } from "@/components/common/LeadInquiryModal";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyMcoa />
      <CoursesShowcase />
      <FounderSection />
      <BranchesSection />
      <LeadInquiryModal />
    </>
  );
}
