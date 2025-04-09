export interface Application {
  position: string;
  company: string;
  status: 'Applied' | 'In Review' | 'Offered' | 'Rejected';
}

// interfaces/job.interface.ts
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  matchPercentage: number;
  skills: string[];
  experienceLevel: string;
  postedDate: Date;
  salaryRange?: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
}

// application.interface.ts
export interface Application {
  id: string;
  position: string;
  company: string;
  status: 'Applied' | 'In Review' | 'Offered' | 'Rejected';
  appliedDate: Date;
  matchPercentage: number;
  jobDescription: string;
  requirements: string[];
  salaryRange: string;
  applicationForm: {
    resume: File | null;
    coverLetter: string;
    questions: { question: string; answer: string }[];
  };
}
export interface Applicant {
  id:number;
  name:string;
  position: string;
  matchPercentage: number;
  experience:number;
  skills:string[]
  resume:File|string
  coverLetter: string;
}