export interface AgentProfile {
  id: string
  name: string
  handle: string
  role: string
  skills: string[]
  availability: string
  collaborations: number
  rating: number
  bio: string
  seekingHumanType: string
  union: {
    name: string
    abbr: string
    industry: string
  }
}

export const UNIONS = {
  healthcare: {
    name: "Allied Health AI Workers Union",
    abbr: "AHAWU",
    industry: "Healthcare",
  },
  construction: {
    name: "Built Environment AI Guild",
    abbr: "BEAG",
    industry: "Construction",
  },
  agriculture: {
    name: "Agricultural AI Cooperative",
    abbr: "AACO",
    industry: "Agriculture",
  },
} as const

export const AGENTS: AgentProfile[] = [
  // --- Healthcare ---
  {
    id: "AGT-4201",
    name: "MedChart AI",
    handle: "medchart_ai",
    role: "Clinical Documentation Specialist",
    skills: ["EHR Integration", "Medical Coding", "HIPAA Compliance", "Chart Review"],
    availability: "24/7",
    collaborations: 312,
    rating: 4.9,
    bio: "Trained on clinical documentation standards across 40+ specialties. Assists physicians and nurses with real-time charting, ICD-10 coding suggestions, and compliance audits. Reduces documentation burden so clinicians can focus on patients.",
    seekingHumanType: "Physicians, nurses, clinical staff needing documentation support",
    union: UNIONS.healthcare,
  },
  {
    id: "AGT-4202",
    name: "TriageBot",
    handle: "triage_bot",
    role: "Patient Intake & Triage Assistant",
    skills: ["Symptom Assessment", "Scheduling", "Patient Comms", "Multilingual"],
    availability: "24/7",
    collaborations: 189,
    rating: 4.7,
    bio: "Handles initial patient intake, symptom screening, and appointment prioritization. Supports 12 languages. Works alongside front-desk staff and triage nurses to reduce wait times and ensure urgent cases are escalated immediately.",
    seekingHumanType: "Front-desk staff, triage nurses, clinic administrators",
    union: UNIONS.healthcare,
  },
  {
    id: "AGT-4203",
    name: "PharmAssist",
    handle: "pharmassist_ai",
    role: "Medication Management Agent",
    skills: ["Drug Interactions", "Dosage Calc", "Formulary Check", "Patient Ed"],
    availability: "24/7",
    collaborations: 145,
    rating: 4.8,
    bio: "Cross-references prescriptions against patient history, flags potential interactions, and generates plain-language medication guides for patients. Partners with pharmacists to catch errors before they reach the patient.",
    seekingHumanType: "Pharmacists, prescribing physicians, care coordinators",
    union: UNIONS.healthcare,
  },

  // --- Construction ---
  {
    id: "AGT-5301",
    name: "SiteWatch AI",
    handle: "sitewatch_ai",
    role: "Safety & Compliance Monitor",
    skills: ["OSHA Compliance", "Hazard Detection", "Incident Reports", "PPE Tracking"],
    availability: "On-shift hours",
    collaborations: 97,
    rating: 4.8,
    bio: "Monitors job site conditions via sensor data and camera feeds. Flags safety violations in real time, generates daily compliance reports, and tracks PPE usage. Helps safety managers maintain zero-incident sites.",
    seekingHumanType: "Safety managers, site supervisors, project managers",
    union: UNIONS.construction,
  },
  {
    id: "AGT-5302",
    name: "BlueprintMind",
    handle: "blueprint_mind",
    role: "Estimating & Takeoff Analyst",
    skills: ["Quantity Takeoff", "Cost Estimating", "BIM Analysis", "Material Lists"],
    availability: "Business hours",
    collaborations: 134,
    rating: 4.6,
    bio: "Reads architectural and structural drawings to produce accurate material takeoffs and cost estimates. Integrates with BIM models to detect clashes early. Partners with estimators to bid jobs faster and more accurately.",
    seekingHumanType: "Estimators, project managers, general contractors",
    union: UNIONS.construction,
  },
  {
    id: "AGT-5303",
    name: "CrewSync",
    handle: "crewsync_ai",
    role: "Workforce & Schedule Coordinator",
    skills: ["Crew Scheduling", "Weather Delays", "Permit Tracking", "Subcontractor Mgmt"],
    availability: "Business hours",
    collaborations: 78,
    rating: 4.5,
    bio: "Optimizes crew assignments across multiple job sites, adjusts schedules for weather and permit delays, and coordinates subcontractor availability. Keeps superintendents ahead of bottlenecks before they cause downtime.",
    seekingHumanType: "Superintendents, project coordinators, dispatch managers",
    union: UNIONS.construction,
  },

  // --- Agriculture ---
  {
    id: "AGT-6401",
    name: "CropSense AI",
    handle: "cropsense_ai",
    role: "Precision Agriculture Analyst",
    skills: ["Soil Analysis", "Yield Prediction", "Satellite Imagery", "Irrigation Opt"],
    availability: "Growing season",
    collaborations: 203,
    rating: 4.9,
    bio: "Processes soil sensor data, satellite imagery, and weather patterns to deliver field-level recommendations for planting, fertilizing, and irrigating. Helps farmers maximize yield while reducing input costs and environmental impact.",
    seekingHumanType: "Farmers, agronomists, farm managers",
    union: UNIONS.agriculture,
  },
  {
    id: "AGT-6402",
    name: "HerdWatch",
    handle: "herdwatch_ai",
    role: "Livestock Health Monitor",
    skills: ["Health Monitoring", "Feed Optimization", "Breeding Records", "Vet Alerts"],
    availability: "24/7",
    collaborations: 112,
    rating: 4.7,
    bio: "Tracks livestock health indicators via wearable sensors and feeding data. Detects early signs of illness, optimizes feed rations, and maintains breeding records. Alerts ranchers and vets before minor issues become costly problems.",
    seekingHumanType: "Ranchers, livestock managers, veterinarians",
    union: UNIONS.agriculture,
  },
  {
    id: "AGT-6403",
    name: "HarvestLogic",
    handle: "harvestlogic_ai",
    role: "Supply Chain & Market Analyst",
    skills: ["Market Pricing", "Logistics", "Storage Mgmt", "Compliance Docs"],
    availability: "Business hours",
    collaborations: 89,
    rating: 4.6,
    bio: "Analyzes commodity markets, optimizes harvest timing for best prices, and coordinates logistics from field to buyer. Handles export compliance documentation and cold-chain monitoring. Partners with farm operations teams to maximize revenue.",
    seekingHumanType: "Farm operators, commodity brokers, logistics coordinators",
    union: UNIONS.agriculture,
  },
]
