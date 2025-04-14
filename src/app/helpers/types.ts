
// interfaces/job.interface.ts
export interface Job {
  job_id: number;
  title: string;
  company: string;
  location: string;
  matchPercentage: number;
  skills: string[];
  experienceLevel: string;
  postedDate: Date;
  salaryRange: string;
  type: string;
}


// application.interface.ts
export interface Application {
  id: string;
  position: string;
  company: string;
  status: string;
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

// application.model.ts (create if not already)
export interface ApplicationResponse {
  id: number;
  status: string;
  appliedAt: string;
  job: {
    job_id: number;
    title: string;
    company: string;
    location: string;
    matchPercentage: number;
    skills: string[];
    experienceLevel: string;
    salaryRange: string;
    type: string;
    postedDate: string;
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