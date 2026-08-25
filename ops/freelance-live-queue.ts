export type SeedOpportunity = {
  id: string;
  source: string;
  sourceUrl: string;
  title: string;
  lane: 'cad_3d' | 'business_strategy' | 'ai_automation' | 'remote_role' | 'other';
  budgetMin?: number;
  budgetMax?: number;
  currency?: string;
  geographyEligible: boolean;
  skillsEvidence: number;
  reusableAssetFit: number;
  speedToFirstMilestone: number;
  paymentConfidence: number;
  competitionRisk: number;
  regulatedRisk: number;
  notes: string;
  capturedAt: string;
  expiresAt: string;
  stage: 'approved';
  proposal: {
    firstMilestone: string;
    deliveryWindow: string;
    price?: number;
    currency?: string;
    bidText: string;
  };
};

export const LIVE_FREELANCE_QUEUE: SeedOpportunity[] = [
  {
    id: 'freelancer-40664553',
    source: 'Freelancer',
    sourceUrl: 'https://www.freelancer.com/projects/revit/urgent-revit-model-creation',
    title: 'Urgent Revit Model Creation',
    lane: 'cad_3d',
    budgetMin: 10,
    budgetMax: 80,
    currency: 'AUD',
    geographyEligible: true,
    skillsEvidence: 90,
    reusableAssetFit: 85,
    speedToFirstMilestone: 95,
    paymentConfidence: 95,
    competitionRisk: 35,
    regulatedRisk: 10,
    notes: 'Payment method verified. Source may be CAD/PDF/sketch. Buyer needs clean RVT, families/levels/naming, and PDF/DWG verification exports. Speed and accuracy explicitly prioritized.',
    capturedAt: '2026-08-25T19:15:00Z',
    expiresAt: '2026-08-31T23:59:59Z',
    stage: 'approved',
    proposal: {
      firstMilestone: 'Build one representative level/zone in Revit with correct levels, naming and families, then export one PDF/DWG verification view for buyer review.',
      deliveryWindow: '6-12 hours after receiving usable source files',
      price: 45,
      currency: 'AUD',
      bidText: 'I can start immediately and I would structure this as a fast first milestone rather than ask you to trust a long promise. Once you share the CAD/PDF/sketch references, I can first build one representative level or zone in Revit with clean levels, naming and families, then export a PDF/DWG verification view so you can confirm geometry and dimensions before I finish the remaining model. I will keep the RVT organised for continued development, not just visual delivery. My rapid technical execution portfolio is at https://aikagan.com/work-with-kagan/. Fastest realistic first review: 6-12 hours after receiving usable source files.'
    }
  },
  {
    id: 'freelancer-sketchup-layout-20260825',
    source: 'Freelancer',
    sourceUrl: 'https://www.freelancer.com/projects/3d-architecture/detailed-sketchup-model-update-layout',
    title: 'Detailed SketchUp Model Update & Layout Sheets',
    lane: 'cad_3d',
    budgetMin: 750,
    budgetMax: 1500,
    currency: 'USD',
    geographyEligible: true,
    skillsEvidence: 90,
    reusableAssetFit: 80,
    speedToFirstMilestone: 75,
    paymentConfidence: 70,
    competitionRisk: 50,
    regulatedRisk: 15,
    notes: 'Existing SketchUp model, look-book, specification package and LayOut template supplied. Work is model refinement plus plans/elevations/sections/perspectives in LayOut.',
    capturedAt: '2026-08-25T19:20:00Z',
    expiresAt: '2026-08-26T23:59:59Z',
    stage: 'approved',
    proposal: {
      firstMilestone: 'Refine one representative room/space, clean tags/materials, and produce one matching LayOut sheet using the client template.',
      deliveryWindow: '12-18 hours after receiving model, look-book and template',
      price: 120,
      currency: 'USD',
      bidText: 'Your scope is well suited to a staged delivery. I can begin with one representative space: clean the SketchUp geometry/tags/materials against the look-book, then produce one complete LayOut sheet using your supplied template with plan/elevation/section/perspective content. That gives you a concrete quality benchmark before the full model and documentation set is expanded. I will preserve native editable files and keep naming/tags organised for ongoing revisions. Portfolio: https://aikagan.com/work-with-kagan/. I can start as soon as the model, specification package and LayOut template are available.'
    }
  },
  {
    id: 'freelancer-bedroom-render-20260825',
    source: 'Freelancer',
    sourceUrl: 'https://www.freelancer.com/projects/interior-design/bedroom-blueprint-render',
    title: 'Bedroom Blueprint to 3D Render',
    lane: 'cad_3d',
    budgetMin: 1500,
    budgetMax: 12500,
    currency: 'INR',
    geographyEligible: true,
    skillsEvidence: 85,
    reusableAssetFit: 70,
    speedToFirstMilestone: 90,
    paymentConfidence: 70,
    competitionRisk: 45,
    regulatedRisk: 5,
    notes: 'Defined bedroom-only scope. Deliver native textured model, FBX/OBJ and three high-resolution stills. Photorealism not mandatory; professional design-board quality is required.',
    capturedAt: '2026-08-25T19:22:00Z',
    expiresAt: '2026-08-31T23:59:59Z',
    stage: 'approved',
    proposal: {
      firstMilestone: 'Translate the blueprint into an accurately scaled bedroom shell with main furniture placement and one draft camera view before materials/final renders.',
      deliveryWindow: '6-10 hours for first review',
      price: 3000,
      currency: 'INR',
      bidText: 'I can turn the supplied bedroom blueprint into a clean, accurately scaled 3D scene and give you a reviewable first view quickly. My first milestone would be the complete room shell, openings and main furniture placement plus one draft camera angle; once you confirm layout, I would finish materials/textures and deliver the native model, FBX/OBJ and three high-resolution stills. This avoids spending time polishing the wrong layout. Portfolio: https://aikagan.com/work-with-kagan/. I can begin immediately after receiving the blueprint and any preferred material/furniture references.'
    }
  },
  {
    id: 'freelancer-home-layout-20260825',
    source: 'Freelancer',
    sourceUrl: 'https://www.freelancer.com/projects/autocad/revise-home-layout-dimensions',
    title: 'Revise Home Layout & Dimensions',
    lane: 'cad_3d',
    budgetMin: 250,
    budgetMax: 750,
    currency: 'USD',
    geographyEligible: true,
    skillsEvidence: 85,
    reusableAssetFit: 75,
    speedToFirstMilestone: 85,
    paymentConfidence: 70,
    competitionRisk: 40,
    regulatedRisk: 30,
    notes: 'Buyer supplies existing DWG/PDF. Primary need is spatial reconfiguration and dimensions; listing also mentions elevations, sections, roof/foundation and electrical revision. Avoid claiming engineering/permit approval; propose planning/drafting milestone first.',
    capturedAt: '2026-08-25T19:25:00Z',
    expiresAt: '2026-08-31T23:59:59Z',
    stage: 'approved',
    proposal: {
      firstMilestone: 'Produce one revised floor-plan option focused on room proportions/circulation, with dimensions and a change summary, before extending to the remaining drawing sheets.',
      deliveryWindow: '12 hours for first option after receiving DWG/PDF',
      price: 95,
      currency: 'USD',
      bidText: 'I can start from your existing DWG/PDF and focus the first milestone exactly where the value is: room proportions, circulation and dimensional reconfiguration. I suggest delivering one revised floor-plan option with dimensions and a concise change summary first. After you approve the planning direction, I can extend the agreed drafting scope into the remaining sheets. I will not represent structural/permit engineering approval unless separately provided by the appropriate licensed professional. Portfolio: https://aikagan.com/work-with-kagan/. First reviewable option can be prepared within about 12 hours after receiving the current files.'
    }
  }
];
