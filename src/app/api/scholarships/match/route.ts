import { NextResponse } from 'next/server';

export interface ScholarshipRecord {
  id: string;
  name: string;
  provider: string;
  amount: string;
  deadline: string;
  minAge: number;
  maxAge: number;
  minCgpa: number;
  maxIncomeLPA: number;
  eligibleGenders: string[]; // 'any', 'female', 'male'
  eligibleCategories: string[]; // 'all', 'General', 'OBC', 'SC', 'ST', 'EWS', 'Minority'
  eligibleStreams: string[]; // 'Engineering', 'Medical', 'Science', 'Arts', 'All'
  specialCriteria?: string;
  applicationLink: string;
  description: string;
}

export const SCHOLARSHIPS_DATABASE: ScholarshipRecord[] = [
  {
    id: "pragati-aicte",
    name: "Pragati Scholarship for Girl Students",
    provider: "AICTE, Ministry of Education, Govt. of India",
    amount: "₹50,000 per annum + College Fee Support",
    deadline: "2026-11-30",
    minAge: 17,
    maxAge: 30,
    minCgpa: 6.0,
    maxIncomeLPA: 8.0,
    eligibleGenders: ["female"],
    eligibleCategories: ["all"],
    eligibleStreams: ["Engineering", "Technical"],
    specialCriteria: "Admitted to 1st year of Degree/Diploma level course or 2nd year via lateral entry.",
    applicationLink: "https://scholarships.gov.in",
    description: "Empowering young women pursuing higher technical education in AICTE approved institutions."
  },
  {
    id: "csss-central",
    name: "Central Sector Scheme of Scholarships for College Students (CSSS)",
    provider: "Department of Higher Education, Govt. of India",
    amount: "₹12,000 / year (UG) & ₹20,000 / year (PG)",
    deadline: "2026-12-15",
    minAge: 18,
    maxAge: 25,
    minCgpa: 7.0,
    maxIncomeLPA: 4.5,
    eligibleGenders: ["any"],
    eligibleCategories: ["all"],
    eligibleStreams: ["All", "Engineering", "Science", "Arts", "Commerce"],
    specialCriteria: "Above 80th percentile in relevant stream in Class 12th board exams.",
    applicationLink: "https://scholarships.gov.in",
    description: "Financial assistance to meritorious students from low-income families to meet day-to-day college expenses."
  },
  {
    id: "reliance-foundation-ug",
    name: "Reliance Foundation Undergraduate Scholarships",
    provider: "Reliance Foundation",
    amount: "Up to ₹2,00,000 over course duration",
    deadline: "2026-10-15",
    minAge: 17,
    maxAge: 24,
    minCgpa: 6.5,
    maxIncomeLPA: 15.0,
    eligibleGenders: ["any"],
    eligibleCategories: ["all"],
    eligibleStreams: ["All", "Engineering", "Science", "Arts", "Commerce"],
    specialCriteria: "Enrolled in 1st year regular full-time undergraduate degree program.",
    applicationLink: "https://www.scholarships.reliancefoundation.org",
    description: "Merit-cum-means scholarship supporting ambitious undergraduates with leadership potential."
  },
  {
    id: "post-matric-sc-st",
    name: "Post Matric Scholarship for SC/ST Candidates",
    provider: "Ministry of Social Justice & Empowerment",
    amount: "Full Tuition Reimbursement + Maintenance Allowance",
    deadline: "2026-11-20",
    minAge: 16,
    maxAge: 35,
    minCgpa: 5.0,
    maxIncomeLPA: 2.5,
    eligibleGenders: ["any"],
    eligibleCategories: ["SC", "ST"],
    eligibleStreams: ["All", "Engineering", "Medical", "Science", "Arts"],
    specialCriteria: "Valid Caste and Income certificate issued by competent revenue authority.",
    applicationLink: "https://scholarships.gov.in",
    description: "Complete financial security covering institutional fees and hostel charges for marginalized communities."
  },
  {
    id: "kotak-kanya",
    name: "Kotak Kanya Scholarship Scheme",
    provider: "Kotak Education Foundation",
    amount: "₹1,50,000 per year until course completion",
    deadline: "2026-09-30",
    minAge: 17,
    maxAge: 23,
    minCgpa: 8.5,
    maxIncomeLPA: 6.0,
    eligibleGenders: ["female"],
    eligibleCategories: ["all"],
    eligibleStreams: ["Engineering", "Medical", "Law", "Architecture"],
    specialCriteria: "Minimum 85% marks or equivalent CGPA in 12th board exams.",
    applicationLink: "https://kotak.org",
    description: "High-value scholarship for meritorious female students in professional professional degree courses."
  },
  {
    id: "saksham-aicte",
    name: "Saksham Scholarship for Differently-Abled Students",
    provider: "AICTE, Govt. of India",
    amount: "₹50,000 per annum",
    deadline: "2026-11-30",
    minAge: 17,
    maxAge: 35,
    minCgpa: 5.5,
    maxIncomeLPA: 8.0,
    eligibleGenders: ["any"],
    eligibleCategories: ["all"],
    eligibleStreams: ["Engineering", "Technical"],
    specialCriteria: "Disability level not less than 40% (certified by medical board).",
    applicationLink: "https://scholarships.gov.in",
    description: "Support for specially-abled students to achieve professional technical education."
  },
  {
    id: "inspire-she",
    name: "INSPIRE Scholarship for Higher Education (SHE)",
    provider: "Department of Science and Technology (DST), Govt. of India",
    amount: "₹80,000 per annum (₹60,000 cash + ₹20,000 mentorship project)",
    deadline: "2026-12-31",
    minAge: 17,
    maxAge: 22,
    minCgpa: 7.5,
    maxIncomeLPA: 99.0, // pure merit based
    eligibleGenders: ["any"],
    eligibleCategories: ["all"],
    eligibleStreams: ["Science", "Engineering"],
    specialCriteria: "Top 1% in Class 12 board examination or rank in JEE Advanced / NEET.",
    applicationLink: "https://online-inspire.gov.in",
    description: "Attracting youth to study natural and basic sciences and pursue scientific research careers."
  },
  {
    id: "hdfc-badhte-kadam",
    name: "HDFC Bank Badhte Kadam Scholarship",
    provider: "HDFC Bank Parivartan",
    amount: "Up to ₹1,00,000",
    deadline: "2026-10-31",
    minAge: 17,
    maxAge: 26,
    minCgpa: 6.0,
    maxIncomeLPA: 6.0,
    eligibleGenders: ["any"],
    eligibleCategories: ["all"],
    eligibleStreams: ["All", "Engineering", "Commerce", "Arts"],
    specialCriteria: "Family facing crisis/hardship or students with disability.",
    applicationLink: "https://www.buddy4study.com/page/hdfc-bank-parivartan-ecss-scholarship",
    description: "Education support for deserving students encountering socio-economic difficulties."
  }
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      age = 20,
      gender = 'any',
      category = 'General',
      annualIncomeLPA = 4.0,
      cgpa = 8.2,
      stream = 'Engineering',
      isDifferentlyAbled = false,
    } = body;

    // Multi-Criteria Scoring & Matching Algorithm
    const scoredScholarships = SCHOLARSHIPS_DATABASE.map((s) => {
      let matchScore = 0;
      let isEligible = true;
      const reasons: string[] = [];
      const disqualifications: string[] = [];

      // 1. Age Criteria Check
      if (age < s.minAge || age > s.maxAge) {
        isEligible = false;
        disqualifications.push(`Age ${age} is outside eligible bracket (${s.minAge}-${s.maxAge} years)`);
      } else {
        matchScore += 20;
        reasons.push(`Age ${age} qualifies within ${s.minAge}-${s.maxAge} years`);
      }

      // 2. Gender Criteria Check
      if (s.eligibleGenders.includes('female') && gender.toLowerCase() !== 'female') {
        isEligible = false;
        disqualifications.push(`Reserved exclusively for female candidates`);
      } else {
        matchScore += 15;
      }

      // 3. Income Criteria Check
      if (annualIncomeLPA > s.maxIncomeLPA) {
        isEligible = false;
        disqualifications.push(`Family income (₹${annualIncomeLPA} LPA) exceeds ceiling of ₹${s.maxIncomeLPA} LPA`);
      } else {
        const incomeBuffer = (s.maxIncomeLPA - annualIncomeLPA) / s.maxIncomeLPA;
        matchScore += Math.min(25, Math.round(15 + incomeBuffer * 10));
        reasons.push(`Income under the ₹${s.maxIncomeLPA} LPA cutoff`);
      }

      // 4. CGPA / Merit Criteria Check
      if (cgpa < s.minCgpa) {
        isEligible = false;
        disqualifications.push(`CGPA ${cgpa} is below minimum requirement of ${s.minCgpa}`);
      } else {
        const meritBonus = Math.min(25, Math.round((cgpa / 10) * 25));
        matchScore += meritBonus;
        reasons.push(`Strong academic merit (CGPA ${cgpa} >= ${s.minCgpa})`);
      }

      // 5. Stream / Branch Criteria Check
      const streamMatches = s.eligibleStreams.includes('All') || s.eligibleStreams.includes(stream);
      if (!streamMatches) {
        isEligible = false;
        disqualifications.push(`Course stream '${stream}' is not covered under this scheme`);
      } else {
        matchScore += 15;
      }

      // 6. Disability Check
      if (s.id === 'saksham-aicte') {
        if (!isDifferentlyAbled) {
          isEligible = false;
          disqualifications.push('Requires verified disability certification (>= 40%)');
        } else {
          matchScore += 20;
          reasons.push('Meets required disability criteria');
        }
      }

      // Cap match score between 0 and 99
      const finalScore = isEligible ? Math.min(99, Math.max(50, matchScore)) : Math.min(45, Math.max(10, matchScore - 30));

      return {
        ...s,
        matchScore: finalScore,
        isEligible,
        reasons,
        disqualifications,
      };
    });

    // Sort by: Eligible first, then descending matchScore
    scoredScholarships.sort((a, b) => {
      if (a.isEligible && !b.isEligible) return -1;
      if (!a.isEligible && b.isEligible) return 1;
      return b.matchScore - a.matchScore;
    });

    return NextResponse.json({
      studentProfile: {
        age,
        gender,
        category,
        annualIncomeLPA,
        cgpa,
        stream,
        isDifferentlyAbled,
      },
      matchedScholarships: scoredScholarships,
      totalEligible: scoredScholarships.filter((s) => s.isEligible).length,
    });
  } catch (error: any) {
    console.error('Scholarship match error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to compute scholarship matches' },
      { status: 500 }
    );
  }
}
