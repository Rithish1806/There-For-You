export interface StudentProfile {
  id: string;
  projectId: string;
  name: string;
  email: string;
  department: string;
  semester: string;
  cgpa: number;
  attendance: number;
  placementReadiness: number;
  targetRole: string;
  skills: string[];
}

export const demoStudent: StudentProfile = {
  id: "7376242AL195",
  projectId: "2026MIN525",
  name: "Sreethar E",
  email: "sreethar.e@student.university.edu",
  department: "Artificial Intelligence and Data Science",
  semester: "S5",
  cgpa: 8.2,
  attendance: 87,
  placementReadiness: 72,
  targetRole: "Software Engineer",
  skills: ["Python", "C++", "SQL", "DSA", "Machine Learning"]
};
