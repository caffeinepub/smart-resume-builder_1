import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DashboardStats {
    eligibleRoles: bigint;
    careerReadiness: bigint;
    atsScore: bigint;
    resumeCompletion: bigint;
    missingSkills: bigint;
}
export interface ATSResult {
    missingSections: Array<string>;
    suggestions: Array<string>;
    textHash: string;
    score: bigint;
    missingSkills: Array<string>;
}
export interface CertificationEntry {
    name: string;
    year: bigint;
    issuer: string;
}
export interface Resume {
    projects: Array<ProjectEntry>;
    name: string;
    education: Array<EducationEntry>;
    email: string;
    experience: Array<ExperienceEntry>;
    summary: string;
    phone: string;
    certifications: Array<CertificationEntry>;
    skills: Array<string>;
}
export interface ExperienceEntry {
    startYear: bigint;
    responsibilities: Array<string>;
    endYear: bigint;
    company: string;
    position: string;
}
export interface CareerProfile {
    readinessScore: bigint;
    completedSteps: Array<string>;
    targetRole: string;
}
export interface ProjectEntry {
    name: string;
    description: string;
    technologies: Array<string>;
}
export interface EducationEntry {
    field: string;
    startYear: bigint;
    endYear: bigint;
    institution: string;
    degree: string;
}
export interface backendInterface {
    deleteAllUserData(user: Principal): Promise<void>;
    getATSResult(user: Principal): Promise<ATSResult>;
    getAggregatedStats(user: Principal): Promise<{
        ats: ATSResult;
        resume: Resume;
        careerProfile: CareerProfile;
        dashboardStats: DashboardStats;
    }>;
    getAllATSResults(): Promise<Array<ATSResult>>;
    getAllCareerProfiles(): Promise<Array<CareerProfile>>;
    getAllResumes(): Promise<Array<Resume>>;
    getCareerProfile(user: Principal): Promise<CareerProfile>;
    getDashboardStats(user: Principal): Promise<DashboardStats>;
    getResume(user: Principal): Promise<Resume>;
    getTopReadinessProfiles(limit: bigint): Promise<Array<CareerProfile>>;
    saveATSResult(result: ATSResult): Promise<void>;
    saveCareerProfile(profile: CareerProfile): Promise<void>;
    saveFullProfile(resume: Resume, ats: ATSResult, profile: CareerProfile): Promise<void>;
    saveResume(resume: Resume): Promise<void>;
}
