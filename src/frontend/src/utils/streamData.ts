// ============================================================
// Multi-Domain Stream Definitions
// ============================================================

export type StreamId =
  | "cse"
  | "mechanical"
  | "electrical"
  | "civil"
  | "mba"
  | "medical"
  | "commerce"
  | "arts";

export interface StreamRole {
  name: string;
  description: string;
  icon: string; // Lucide icon name
  color: string;
  requiredSkills: string[];
}

export interface SkillResource {
  youtube: string;
  docs: string;
  practice: string;
  certification: string;
  description: string;
  interviewQuestions: string[];
}

export interface JobPortal {
  name: string;
  url: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
}

export interface StreamDefinition {
  id: StreamId;
  label: string;
  icon: string;
  color: string;
  gradient: string;
  description: string;
  exampleRoles: string[];
  roles: StreamRole[];
  skillResources: Record<string, SkillResource>;
  jobPortals: JobPortal[];
  atsKeywords: string[];
  resumeTemplate: string;
}

export const STREAMS: Record<StreamId, StreamDefinition> = {
  cse: {
    id: "cse",
    label: "Computer Science / IT",
    icon: "Code2",
    color: "#7C5CFF",
    gradient: "from-violet-600 to-blue-500",
    description: "Software engineering, data science, and AI roles",
    exampleRoles: ["Software Developer", "Data Scientist", "AI Engineer"],
    roles: [
      {
        name: "Software Developer",
        description: "Build scalable software systems and applications",
        icon: "Code2",
        color: "#7C5CFF",
        requiredSkills: ["Python", "Java", "Data Structures", "OOP", "Git"],
      },
      {
        name: "Web Developer",
        description: "Create modern web applications and interfaces",
        icon: "Globe",
        color: "#4B8BFF",
        requiredSkills: ["HTML", "CSS", "JavaScript", "React", "TypeScript"],
      },
      {
        name: "Data Scientist",
        description: "Analyze data to derive actionable business insights",
        icon: "BarChart2",
        color: "#F59E0B",
        requiredSkills: [
          "Python",
          "Machine Learning",
          "Statistics",
          "Pandas",
          "SQL",
        ],
      },
      {
        name: "AI Engineer",
        description: "Build intelligent systems using deep learning",
        icon: "Brain",
        color: "#EC4899",
        requiredSkills: [
          "Python",
          "TensorFlow",
          "Deep Learning",
          "NLP",
          "Computer Vision",
        ],
      },
      {
        name: "Full Stack Developer",
        description: "End-to-end web application development",
        icon: "Layers",
        color: "#35D0C7",
        requiredSkills: ["React", "Node.js", "SQL", "MongoDB", "JavaScript"],
      },
    ],
    skillResources: {
      Python: {
        youtube: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
        docs: "https://docs.python.org/3/",
        practice: "https://www.hackerrank.com/domains/python",
        certification:
          "https://learn.microsoft.com/en-us/credentials/certifications/",
        description:
          "General purpose programming language for AI, web & automation",
        interviewQuestions: [
          "What are Python decorators?",
          "Explain list comprehensions vs generator expressions",
          "What is GIL in Python?",
          "How does memory management work in Python?",
        ],
      },
      JavaScript: {
        youtube: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
        docs: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
        practice: "https://javascript.info",
        certification:
          "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
        description:
          "The language of the web – essential for frontend & backend dev",
        interviewQuestions: [
          "Explain event loop in JavaScript",
          "What are closures?",
          "Difference between var, let, const?",
          "What is prototypal inheritance?",
        ],
      },
      React: {
        youtube: "https://www.youtube.com/watch?v=bMknfKXIFA8",
        docs: "https://react.dev",
        practice: "https://react.dev/learn",
        certification:
          "https://www.freecodecamp.org/learn/front-end-development-libraries/",
        description:
          "Most popular UI library for building interactive web apps",
        interviewQuestions: [
          "What is the virtual DOM?",
          "Explain useState vs useEffect",
          "What are React hooks?",
          "How does context API work?",
        ],
      },
      SQL: {
        youtube: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
        docs: "https://www.w3schools.com/sql/",
        practice: "https://sqlzoo.net",
        certification: "https://www.coursera.org/learn/sql-for-data-science",
        description: "Essential for data management in any software project",
        interviewQuestions: [
          "Difference between INNER JOIN and LEFT JOIN?",
          "What is database normalization?",
          "Explain ACID properties",
          "How to optimize slow SQL queries?",
        ],
      },
      "Machine Learning": {
        youtube: "https://www.youtube.com/watch?v=NWONeJKn6kc",
        docs: "https://scikit-learn.org/stable/user_guide.html",
        practice: "https://www.kaggle.com",
        certification: "https://coursera.org/learn/machine-learning",
        description: "Algorithms that enable computers to learn from data",
        interviewQuestions: [
          "Difference between supervised and unsupervised learning?",
          "What is overfitting?",
          "Explain gradient descent",
          "What is cross-validation?",
        ],
      },
      Git: {
        youtube: "https://www.youtube.com/watch?v=RGOj5yH7evk",
        docs: "https://git-scm.com/doc",
        practice: "https://learngitbranching.js.org",
        certification:
          "https://www.coursera.org/projects/introduction-git-github",
        description: "Version control system used in every software project",
        interviewQuestions: [
          "Difference between git merge and rebase?",
          "What is a pull request?",
          "How to resolve merge conflicts?",
          "Explain git branching strategies",
        ],
      },
      "Node.js": {
        youtube: "https://www.youtube.com/watch?v=Oe421EPjeBE",
        docs: "https://nodejs.org/en/docs/",
        practice: "https://nodeschool.io",
        certification:
          "https://www.freecodecamp.org/learn/back-end-development-and-apis/",
        description:
          "JavaScript runtime for building scalable backend services",
        interviewQuestions: [
          "What is the event loop in Node.js?",
          "Difference between require and import?",
          "How to handle async errors?",
          "What is middleware in Express?",
        ],
      },
    },
    jobPortals: [
      {
        name: "LinkedIn Jobs",
        url: "https://linkedin.com/jobs",
        description: "Professional network with millions of tech listings",
        icon: "Briefcase",
        color: "#0A66C2",
        bg: "rgba(10,102,194,0.12)",
      },
      {
        name: "LeetCode Jobs",
        url: "https://leetcode.com/jobs",
        description: "Jobs for competitive programmers",
        icon: "Code2",
        color: "#F59E0B",
        bg: "rgba(245,158,11,0.12)",
      },
      {
        name: "Internshala",
        url: "https://internshala.com",
        description: "#1 internship platform for students",
        icon: "GraduationCap",
        color: "#00BFA5",
        bg: "rgba(0,191,165,0.12)",
      },
      {
        name: "Naukri",
        url: "https://naukri.com",
        description: "India's largest job portal for tech professionals",
        icon: "Briefcase",
        color: "#FF6B35",
        bg: "rgba(255,107,53,0.12)",
      },
      {
        name: "Wellfound",
        url: "https://wellfound.com",
        description: "Startup jobs at top-funded companies",
        icon: "Zap",
        color: "#F97316",
        bg: "rgba(249,115,22,0.12)",
      },
    ],
    atsKeywords: [
      "algorithms",
      "api",
      "agile",
      "backend",
      "cloud",
      "coding",
      "database",
      "deployment",
      "frontend",
      "git",
      "javascript",
      "python",
      "react",
      "software",
      "typescript",
    ],
    resumeTemplate: "software",
  },

  mechanical: {
    id: "mechanical",
    label: "Mechanical Engineering",
    icon: "Cog",
    color: "#F97316",
    gradient: "from-orange-500 to-amber-400",
    description: "Design, production, and manufacturing engineering roles",
    exampleRoles: ["Design Engineer", "CAD Engineer", "Production Engineer"],
    roles: [
      {
        name: "Design Engineer",
        description: "Create mechanical designs using CAD tools",
        icon: "PenTool",
        color: "#F97316",
        requiredSkills: [
          "AutoCAD",
          "SolidWorks",
          "Engineering Drawing",
          "GD&T",
          "CATIA",
        ],
      },
      {
        name: "Production Engineer",
        description: "Optimize manufacturing processes and quality",
        icon: "Settings2",
        color: "#EF4444",
        requiredSkills: [
          "Manufacturing Processes",
          "Lean Manufacturing",
          "Six Sigma",
          "Quality Control",
          "PLC",
        ],
      },
      {
        name: "CAD Engineer",
        description: "3D modeling and technical drawing specialist",
        icon: "Cpu",
        color: "#A855F7",
        requiredSkills: [
          "AutoCAD",
          "CATIA",
          "SolidWorks",
          "ProE",
          "Engineering Design",
        ],
      },
      {
        name: "Automobile Engineer",
        description: "Design and develop automotive systems",
        icon: "Gauge",
        color: "#14B8A6",
        requiredSkills: [
          "IC Engines",
          "Vehicle Dynamics",
          "Automotive Engineering",
          "MATLAB",
          "Thermodynamics",
        ],
      },
    ],
    skillResources: {
      AutoCAD: {
        youtube: "https://www.youtube.com/watch?v=Z7e1lM45LMo",
        docs: "https://help.autodesk.com/view/ACD/2024/ENU/",
        practice: "https://www.autodesk.com/training-and-certification/",
        certification:
          "https://www.autodesk.com/certification/all-certifications/autocad",
        description: "Industry-standard 2D/3D CAD design software",
        interviewQuestions: [
          "What is the difference between Model Space and Paper Space?",
          "How do you use blocks in AutoCAD?",
          "What are dynamic blocks?",
          "Explain layer management in AutoCAD",
        ],
      },
      SolidWorks: {
        youtube: "https://www.youtube.com/watch?v=w4dKHJHWvao",
        docs: "https://help.solidworks.com/",
        practice: "https://www.solidworks.com/support/home-page",
        certification:
          "https://www.solidworks.com/sw/education/cswa-academic-certification.htm",
        description: "3D CAD software for product design and engineering",
        interviewQuestions: [
          "What is parametric modeling?",
          "How to create an assembly in SolidWorks?",
          "Explain FEA analysis in SolidWorks",
          "What is a design table?",
        ],
      },
      MATLAB: {
        youtube: "https://www.youtube.com/watch?v=7f50sQYjNRA",
        docs: "https://www.mathworks.com/help/matlab/",
        practice:
          "https://www.mathworks.com/learn/tutorials/matlab-onramp.html",
        certification: "https://www.mathworks.com/services/training.html",
        description: "Numerical computing and simulation platform",
        interviewQuestions: [
          "What is the difference between a script and a function in MATLAB?",
          "How do you perform matrix operations?",
          "What is Simulink used for?",
          "Explain ODE solvers in MATLAB",
        ],
      },
      "Lean Manufacturing": {
        youtube: "https://www.youtube.com/watch?v=vSMBBsObBl4",
        docs: "https://www.lean.org/explore-lean/what-is-lean/",
        practice: "https://www.coursera.org/learn/lean-manufacturing",
        certification: "https://www.coursera.org/learn/lean-manufacturing",
        description: "Minimize waste while maximizing productivity",
        interviewQuestions: [
          "What are the 8 wastes in lean manufacturing?",
          "Explain the 5S methodology",
          "What is Kaizen?",
          "How does kanban work?",
        ],
      },
      "Six Sigma": {
        youtube: "https://www.youtube.com/watch?v=N7KMvbLIRBo",
        docs: "https://asq.org/quality-resources/six-sigma",
        practice: "https://www.coursera.org/learn/six-sigma-define-measure",
        certification:
          "https://www.coursera.org/specializations/six-sigma-black-belt",
        description: "Data-driven approach to eliminate defects in processes",
        interviewQuestions: [
          "What is DMAIC methodology?",
          "Explain control charts",
          "What is process capability index?",
          "Difference between Six Sigma and Lean?",
        ],
      },
    },
    jobPortals: [
      {
        name: "Naukri (Mech)",
        url: "https://naukri.com/mechanical-engineer-jobs",
        description: "Core mechanical engineering jobs",
        icon: "Briefcase",
        color: "#FF6B35",
        bg: "rgba(255,107,53,0.12)",
      },
      {
        name: "LinkedIn",
        url: "https://linkedin.com/jobs",
        description: "Manufacturing and engineering opportunities",
        icon: "Briefcase",
        color: "#0A66C2",
        bg: "rgba(10,102,194,0.12)",
      },
      {
        name: "Internshala",
        url: "https://internshala.com/internships/mechanical-engineering-internship",
        description: "Mechanical engineering internships",
        icon: "GraduationCap",
        color: "#00BFA5",
        bg: "rgba(0,191,165,0.12)",
      },
      {
        name: "IIMJobs",
        url: "https://iimjobs.com",
        description: "Core sector engineering jobs",
        icon: "Award",
        color: "#6366F1",
        bg: "rgba(99,102,241,0.12)",
      },
      {
        name: "Tata Careers",
        url: "https://www.tata.com/careers",
        description: "Tata Group manufacturing & engineering",
        icon: "Building2",
        color: "#1D4ED8",
        bg: "rgba(29,78,216,0.12)",
      },
    ],
    atsKeywords: [
      "autocad",
      "catia",
      "solidworks",
      "manufacturing",
      "quality",
      "production",
      "mechanical design",
      "lean",
      "six sigma",
      "engineering",
    ],
    resumeTemplate: "mechanical",
  },

  electrical: {
    id: "electrical",
    label: "Electrical Engineering",
    icon: "Zap",
    color: "#FBBF24",
    gradient: "from-yellow-500 to-orange-400",
    description: "Power systems, embedded, and electronics engineering",
    exampleRoles: [
      "Power Systems Engineer",
      "Embedded Engineer",
      "VLSI Engineer",
    ],
    roles: [
      {
        name: "Power Systems Engineer",
        description: "Design and maintain electrical power infrastructure",
        icon: "Zap",
        color: "#FBBF24",
        requiredSkills: [
          "Power Systems",
          "MATLAB",
          "Protection & Control",
          "Electrical Machines",
          "PLC",
        ],
      },
      {
        name: "Embedded Engineer",
        description: "Develop software for embedded hardware systems",
        icon: "Cpu",
        color: "#6366F1",
        requiredSkills: [
          "C/C++",
          "Microcontrollers",
          "Embedded C",
          "RTOS",
          "PCB Design",
        ],
      },
      {
        name: "Maintenance Engineer",
        description: "Ensure reliability of electrical equipment",
        icon: "Settings2",
        color: "#10B981",
        requiredSkills: [
          "Electrical Maintenance",
          "Troubleshooting",
          "PLC",
          "SCADA",
          "Safety Protocols",
        ],
      },
      {
        name: "VLSI Engineer",
        description: "Design integrated circuits and chip architectures",
        icon: "CircuitBoard",
        color: "#EC4899",
        requiredSkills: [
          "VLSI Design",
          "Verilog",
          "FPGA",
          "Digital Electronics",
          "Analog Circuits",
        ],
      },
    ],
    skillResources: {
      MATLAB: {
        youtube: "https://www.youtube.com/watch?v=7f50sQYjNRA",
        docs: "https://www.mathworks.com/help/matlab/",
        practice:
          "https://www.mathworks.com/learn/tutorials/matlab-onramp.html",
        certification: "https://www.mathworks.com/services/training.html",
        description: "Simulation and modeling for electrical systems",
        interviewQuestions: [
          "How to model a power system in Simulink?",
          "What is FFT used for in signal processing?",
          "Explain PID controller design in MATLAB",
          "How to use MATLAB for circuit analysis?",
        ],
      },
      PLC: {
        youtube: "https://www.youtube.com/watch?v=g4mTt3_LKJE",
        docs: "https://www.siemens.com/global/en/products/automation/systems/industrial/plc.html",
        practice: "https://www.udemy.com/topic/plc/",
        certification: "https://www.coursera.org/learn/plc-programming",
        description: "Programmable Logic Controllers for industrial automation",
        interviewQuestions: [
          "What is ladder logic programming?",
          "Difference between PLC and DCS?",
          "What are input/output modules?",
          "How do timers work in PLC?",
        ],
      },
      "C/C++": {
        youtube: "https://www.youtube.com/watch?v=vLnPwxZdW4Y",
        docs: "https://en.cppreference.com/",
        practice: "https://www.hackerrank.com/domains/cpp",
        certification:
          "https://www.coursera.org/specializations/coding-for-everyone",
        description: "Foundation language for embedded and systems programming",
        interviewQuestions: [
          "Difference between stack and heap memory?",
          "What are pointers in C?",
          "Explain volatile keyword",
          "What is interrupt handling in embedded C?",
        ],
      },
      SCADA: {
        youtube: "https://www.youtube.com/watch?v=3TMBLzCfWiQ",
        docs: "https://inductiveautomation.com/resources/article/what-is-scada",
        practice: "https://www.udemy.com/topic/scada/",
        certification: "https://www.udemy.com/topic/scada/",
        description: "Supervisory Control and Data Acquisition systems",
        interviewQuestions: [
          "What is HMI in SCADA?",
          "Difference between SCADA and DCS?",
          "What is OPC protocol?",
          "How is data logged in SCADA systems?",
        ],
      },
    },
    jobPortals: [
      {
        name: "LinkedIn",
        url: "https://linkedin.com/jobs",
        description: "Electrical engineering opportunities",
        icon: "Briefcase",
        color: "#0A66C2",
        bg: "rgba(10,102,194,0.12)",
      },
      {
        name: "Naukri",
        url: "https://naukri.com/electrical-engineer-jobs",
        description: "Electrical & electronics engineering jobs",
        icon: "Briefcase",
        color: "#FF6B35",
        bg: "rgba(255,107,53,0.12)",
      },
      {
        name: "BHEL Careers",
        url: "https://www.bhel.com/careers",
        description: "Government PSU electrical engineering jobs",
        icon: "Building2",
        color: "#1D4ED8",
        bg: "rgba(29,78,216,0.12)",
      },
      {
        name: "L&T Careers",
        url: "https://lntecc.com/careers",
        description: "L&T engineering and construction jobs",
        icon: "Award",
        color: "#059669",
        bg: "rgba(5,150,105,0.12)",
      },
      {
        name: "Siemens India",
        url: "https://new.siemens.com/in/en/company/jobs.html",
        description: "Global electrical & automation company",
        icon: "Zap",
        color: "#009999",
        bg: "rgba(0,153,153,0.12)",
      },
    ],
    atsKeywords: [
      "matlab",
      "plc",
      "scada",
      "electrical",
      "power",
      "embedded",
      "microcontroller",
      "circuit",
      "maintenance",
    ],
    resumeTemplate: "electrical",
  },

  civil: {
    id: "civil",
    label: "Civil Engineering",
    icon: "Building2",
    color: "#10B981",
    gradient: "from-emerald-500 to-teal-400",
    description: "Structural, construction, and urban planning engineering",
    exampleRoles: ["Structural Engineer", "Site Engineer", "Urban Planner"],
    roles: [
      {
        name: "Structural Engineer",
        description: "Design safe and efficient structural systems",
        icon: "Building2",
        color: "#10B981",
        requiredSkills: [
          "AutoCAD Civil",
          "STAAD Pro",
          "Structural Analysis",
          "Construction Management",
          "RCC Design",
        ],
      },
      {
        name: "Site Engineer",
        description: "Oversee construction activities on-site",
        icon: "HardHat",
        color: "#F97316",
        requiredSkills: [
          "Construction Technology",
          "Project Management",
          "AutoCAD",
          "Estimation",
        ],
      },
      {
        name: "Urban Planner",
        description: "Plan sustainable cities and infrastructure",
        icon: "Map",
        color: "#6366F1",
        requiredSkills: [
          "GIS",
          "Urban Planning",
          "AutoCAD",
          "Revit",
          "Environmental Assessment",
        ],
      },
      {
        name: "Estimator",
        description: "Calculate project costs and resource requirements",
        icon: "Calculator",
        color: "#14B8A6",
        requiredSkills: [
          "Estimation",
          "Costing",
          "MS Project",
          "Construction Standards",
        ],
      },
    ],
    skillResources: {
      "AutoCAD Civil": {
        youtube: "https://www.youtube.com/watch?v=qrLHBFdE5pY",
        docs: "https://help.autodesk.com/view/CIV3D/2024/ENU/",
        practice: "https://www.autodesk.com/training-and-certification/",
        certification:
          "https://www.autodesk.com/certification/all-certifications/autocad-civil-3d",
        description: "AutoCAD specialized for civil engineering design",
        interviewQuestions: [
          "What is Civil 3D's surface creation process?",
          "How to create an alignment in Civil 3D?",
          "What are pipe networks?",
          "Explain grading in Civil 3D",
        ],
      },
      "STAAD Pro": {
        youtube: "https://www.youtube.com/watch?v=GIAKwY9Pcjg",
        docs: "https://www.bentley.com/software/staad-pro/",
        practice: "https://www.udemy.com/topic/staad-pro/",
        certification: "https://www.bentley.com/en/learning",
        description: "Structural analysis and design software",
        interviewQuestions: [
          "What is the difference between static and dynamic analysis?",
          "How to model a portal frame in STAAD?",
          "What is load combination?",
          "Explain P-Delta effect",
        ],
      },
      Revit: {
        youtube: "https://www.youtube.com/watch?v=6n0E_9RBZKY",
        docs: "https://help.autodesk.com/view/RVT/2024/ENU/",
        practice: "https://www.autodesk.com/training-and-certification/",
        certification:
          "https://www.autodesk.com/certification/all-certifications/revit",
        description: "BIM software for architectural and structural design",
        interviewQuestions: [
          "What is BIM and why is it important?",
          "Difference between families and types in Revit?",
          "How to create a project template?",
          "Explain Revit's parametric design capabilities",
        ],
      },
      GIS: {
        youtube: "https://www.youtube.com/watch?v=m-9g5K_8aTo",
        docs: "https://www.esri.com/en-us/what-is-gis/overview",
        practice: "https://learn.arcgis.com/en/",
        certification: "https://www.esri.com/training/",
        description: "Geographic Information Systems for spatial analysis",
        interviewQuestions: [
          "What is raster vs vector data in GIS?",
          "How to perform spatial analysis?",
          "What is a shapefile?",
          "Explain coordinate systems",
        ],
      },
    },
    jobPortals: [
      {
        name: "Naukri",
        url: "https://naukri.com/civil-engineer-jobs",
        description: "Civil engineering and construction jobs",
        icon: "Briefcase",
        color: "#FF6B35",
        bg: "rgba(255,107,53,0.12)",
      },
      {
        name: "LinkedIn",
        url: "https://linkedin.com/jobs",
        description: "Infrastructure and construction opportunities",
        icon: "Briefcase",
        color: "#0A66C2",
        bg: "rgba(10,102,194,0.12)",
      },
      {
        name: "L&T ECC",
        url: "https://lntecc.com/careers",
        description: "India's largest EPC company jobs",
        icon: "Building2",
        color: "#059669",
        bg: "rgba(5,150,105,0.12)",
      },
      {
        name: "Shapoorji Pallonji",
        url: "https://www.shapoorji.in/careers",
        description: "Construction and real estate careers",
        icon: "Award",
        color: "#7C5CFF",
        bg: "rgba(124,92,255,0.12)",
      },
      {
        name: "CPWD Careers",
        url: "https://cpwd.gov.in/",
        description: "Central Public Works Department jobs",
        icon: "MapPin",
        color: "#1D4ED8",
        bg: "rgba(29,78,216,0.12)",
      },
    ],
    atsKeywords: [
      "autocad",
      "structural",
      "construction",
      "project management",
      "revit",
      "site supervision",
      "estimation",
    ],
    resumeTemplate: "general",
  },

  mba: {
    id: "mba",
    label: "Management / MBA",
    icon: "Briefcase",
    color: "#6366F1",
    gradient: "from-indigo-600 to-purple-500",
    description: "Business, marketing, HR, and product management roles",
    exampleRoles: ["Business Analyst", "Product Manager", "Marketing Manager"],
    roles: [
      {
        name: "Business Analyst",
        description: "Bridge business needs with technology solutions",
        icon: "BarChart2",
        color: "#6366F1",
        requiredSkills: [
          "SQL",
          "Business Analysis",
          "Excel",
          "Tableau",
          "Communication",
        ],
      },
      {
        name: "Marketing Manager",
        description: "Lead marketing strategy and brand growth",
        icon: "TrendingUp",
        color: "#EC4899",
        requiredSkills: [
          "Digital Marketing",
          "SEO",
          "Social Media",
          "Analytics",
          "Communication",
        ],
      },
      {
        name: "HR Executive",
        description: "Manage talent acquisition and employee relations",
        icon: "Users",
        color: "#F59E0B",
        requiredSkills: [
          "HR Management",
          "Recruitment",
          "Payroll",
          "Employee Relations",
          "HRMS",
        ],
      },
      {
        name: "Product Manager",
        description: "Define product vision and drive roadmap execution",
        icon: "Target",
        color: "#10B981",
        requiredSkills: [
          "Product Management",
          "Agile",
          "Jira",
          "Market Research",
          "Roadmapping",
        ],
      },
    ],
    skillResources: {
      "Business Analysis": {
        youtube: "https://www.youtube.com/watch?v=JrwzMb8KWUI",
        docs: "https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok/",
        practice:
          "https://www.coursera.org/professional-certificates/ibm-business-analyst",
        certification: "https://www.iiba.org/certification/",
        description: "Analyze business processes to improve efficiency",
        interviewQuestions: [
          "What is a use case in business analysis?",
          "Explain the requirements elicitation process",
          "What is a gap analysis?",
          "How do you prioritize requirements?",
        ],
      },
      "Digital Marketing": {
        youtube: "https://www.youtube.com/watch?v=bixR-KIJKYM",
        docs: "https://learndigital.withgoogle.com/digitalgarage",
        practice: "https://ads.google.com/home/tools/keyword-planner/",
        certification:
          "https://learndigital.withgoogle.com/digitalgarage/learn",
        description: "Online marketing channels and campaign management",
        interviewQuestions: [
          "What is SEO and how does it work?",
          "Explain the marketing funnel",
          "What is ROI in digital marketing?",
          "How to run a Google Ads campaign?",
        ],
      },
      Excel: {
        youtube: "https://www.youtube.com/watch?v=Vl0H-qTclOg",
        docs: "https://support.microsoft.com/en-us/excel",
        practice: "https://www.excel-easy.com",
        certification:
          "https://learn.microsoft.com/en-us/certifications/mos-excel-expert-2019",
        description: "Data analysis and reporting using Microsoft Excel",
        interviewQuestions: [
          "What are VLOOKUP and HLOOKUP?",
          "How to create pivot tables?",
          "Explain conditional formatting",
          "What is SUMIF formula?",
        ],
      },
      "Product Management": {
        youtube: "https://www.youtube.com/watch?v=yBQ2SBqSqUQ",
        docs: "https://www.productplan.com/learn/what-is-product-management/",
        practice:
          "https://www.coursera.org/professional-certificates/google-project-management",
        certification: "https://www.pmi.org/certifications/product-management",
        description: "Strategy and execution of product development lifecycle",
        interviewQuestions: [
          "How do you prioritize a product backlog?",
          "What is an MVP?",
          "How to measure product success?",
          "Explain the product lifecycle",
        ],
      },
    },
    jobPortals: [
      {
        name: "LinkedIn Jobs",
        url: "https://linkedin.com/jobs",
        description: "Premium professional network for MBA grads",
        icon: "Briefcase",
        color: "#0A66C2",
        bg: "rgba(10,102,194,0.12)",
      },
      {
        name: "IIMJobs",
        url: "https://iimjobs.com",
        description: "Jobs specifically for management professionals",
        icon: "Award",
        color: "#6366F1",
        bg: "rgba(99,102,241,0.12)",
      },
      {
        name: "Naukri",
        url: "https://naukri.com",
        description: "Management and business development roles",
        icon: "Briefcase",
        color: "#FF6B35",
        bg: "rgba(255,107,53,0.12)",
      },
      {
        name: "Indeed",
        url: "https://indeed.co.in",
        description: "Business and management job listings",
        icon: "Search",
        color: "#003499",
        bg: "rgba(0,52,153,0.12)",
      },
      {
        name: "Instahyre",
        url: "https://instahyre.com",
        description: "AI-powered hiring for top companies",
        icon: "TrendingUp",
        color: "#10B981",
        bg: "rgba(16,185,129,0.12)",
      },
    ],
    atsKeywords: [
      "business analysis",
      "product management",
      "marketing",
      "revenue",
      "strategy",
      "leadership",
      "kpi",
      "roi",
      "stakeholder",
      "agile",
    ],
    resumeTemplate: "mba",
  },

  medical: {
    id: "medical",
    label: "Medical / Healthcare",
    icon: "Heart",
    color: "#EF4444",
    gradient: "from-red-500 to-pink-500",
    description: "Clinical research, healthcare administration, and pharma",
    exampleRoles: [
      "Clinical Researcher",
      "Healthcare Administrator",
      "Pharmacovigilance",
    ],
    roles: [
      {
        name: "Clinical Researcher",
        description: "Conduct and manage clinical trials",
        icon: "Activity",
        color: "#EF4444",
        requiredSkills: [
          "Clinical Research",
          "GCP",
          "CTMS",
          "Medical Writing",
          "Biostatistics",
        ],
      },
      {
        name: "Healthcare Administrator",
        description: "Manage hospital operations and healthcare systems",
        icon: "Building2",
        color: "#6366F1",
        requiredSkills: [
          "Hospital Administration",
          "Healthcare Management",
          "EMR/EHR",
          "Operations",
        ],
      },
      {
        name: "Medical Assistant",
        description:
          "Support clinical and administrative healthcare operations",
        icon: "Heart",
        color: "#EC4899",
        requiredSkills: [
          "Medical Coding",
          "ICD-10",
          "CPT",
          "Patient Care",
          "Healthcare IT",
        ],
      },
      {
        name: "Pharmacovigilance Specialist",
        description: "Monitor drug safety and adverse event reporting",
        icon: "Shield",
        color: "#10B981",
        requiredSkills: [
          "Drug Safety",
          "ICSR",
          "Pharmacovigilance",
          "MedDRA",
          "Regulations",
        ],
      },
    ],
    skillResources: {
      "Clinical Research": {
        youtube: "https://www.youtube.com/watch?v=0UEgFpV2OoA",
        docs: "https://ichgcp.net",
        practice: "https://www.coursera.org/specializations/clinical-research",
        certification: "https://www.scorecr.org",
        description: "Systematic study of health interventions in patients",
        interviewQuestions: [
          "What are the phases of clinical trials?",
          "What is GCP compliance?",
          "Explain informed consent process",
          "What is SAE reporting?",
        ],
      },
      "Medical Coding": {
        youtube: "https://www.youtube.com/watch?v=YEWgjl5JMv8",
        docs: "https://www.cms.gov/Medicare/Coding/ICD10",
        practice: "https://www.aapc.com/medical-coding/",
        certification: "https://www.aapc.com/certifications/cpc/",
        description: "Translate medical diagnoses into standardized codes",
        interviewQuestions: [
          "What is the difference between ICD-10 and CPT codes?",
          "What is upcoding and downcoding?",
          "How to code a surgical procedure?",
          "What is modifier -25?",
        ],
      },
      "Healthcare Management": {
        youtube: "https://www.youtube.com/watch?v=Y4ZwkR2tPkw",
        docs: "https://www.ache.org/learning-center/education-and-events/online-learning",
        practice: "https://www.coursera.org/learn/healthcare-administration",
        certification:
          "https://www.ache.org/career-resource-center/board-certification",
        description:
          "Administration and management of healthcare organizations",
        interviewQuestions: [
          "What are HIPAA regulations?",
          "How to improve patient satisfaction scores?",
          "What is hospital accreditation?",
          "Explain value-based care",
        ],
      },
    },
    jobPortals: [
      {
        name: "LinkedIn",
        url: "https://linkedin.com/jobs",
        description: "Healthcare and pharmaceutical job listings",
        icon: "Briefcase",
        color: "#0A66C2",
        bg: "rgba(10,102,194,0.12)",
      },
      {
        name: "Naukri Healthcare",
        url: "https://naukri.com/healthcare-jobs",
        description: "Medical and clinical research jobs",
        icon: "Heart",
        color: "#EF4444",
        bg: "rgba(239,68,68,0.12)",
      },
      {
        name: "Apollo Careers",
        url: "https://www.apollohospitals.com/careers/",
        description: "India's largest hospital network jobs",
        icon: "Activity",
        color: "#EC4899",
        bg: "rgba(236,72,153,0.12)",
      },
      {
        name: "Indeed",
        url: "https://indeed.co.in/healthcare-jobs",
        description: "Healthcare sector job listings",
        icon: "Search",
        color: "#003499",
        bg: "rgba(0,52,153,0.12)",
      },
      {
        name: "Fortis Careers",
        url: "https://www.fortishealthcare.com/careers",
        description: "Fortis hospital group opportunities",
        icon: "Building2",
        color: "#6366F1",
        bg: "rgba(99,102,241,0.12)",
      },
    ],
    atsKeywords: [
      "clinical",
      "healthcare",
      "medical",
      "patient care",
      "hospital",
      "pharmaceutical",
      "coding",
      "gcp",
      "regulatory",
    ],
    resumeTemplate: "medical",
  },

  commerce: {
    id: "commerce",
    label: "Commerce / Finance",
    icon: "TrendingUp",
    color: "#059669",
    gradient: "from-emerald-600 to-green-500",
    description: "Accounting, finance, banking, and taxation roles",
    exampleRoles: ["Financial Analyst", "Accountant", "Banking Associate"],
    roles: [
      {
        name: "Accountant",
        description: "Manage financial records and reporting",
        icon: "FileText",
        color: "#059669",
        requiredSkills: [
          "Tally ERP",
          "GST",
          "Accounting",
          "Financial Statements",
          "Taxation",
        ],
      },
      {
        name: "Financial Analyst",
        description: "Analyze financial data to guide investment decisions",
        icon: "TrendingUp",
        color: "#6366F1",
        requiredSkills: [
          "Excel",
          "Financial Modeling",
          "CFA concepts",
          "Valuation",
          "Bloomberg",
        ],
      },
      {
        name: "Banking Associate",
        description: "Provide banking services and manage customer accounts",
        icon: "DollarSign",
        color: "#F59E0B",
        requiredSkills: [
          "Banking Operations",
          "Credit Analysis",
          "KYC/AML",
          "Financial Products",
          "MS Office",
        ],
      },
      {
        name: "CA / CMA",
        description: "Chartered accountant and cost management specialist",
        icon: "Award",
        color: "#EF4444",
        requiredSkills: [
          "Accounting",
          "Audit",
          "Taxation",
          "Financial Reporting",
          "Compliance",
        ],
      },
    ],
    skillResources: {
      "Tally ERP": {
        youtube: "https://www.youtube.com/watch?v=T1JGSAkpPyc",
        docs: "https://help.tallysolutions.com/",
        practice: "https://tallysolutions.com/education/",
        certification: "https://tallysolutions.com/tally-education/",
        description: "Accounting software used widely in Indian businesses",
        interviewQuestions: [
          "What is ledger creation in Tally?",
          "How to pass journal entries in Tally?",
          "What is voucher entry?",
          "How to generate GST reports in Tally?",
        ],
      },
      "Financial Modeling": {
        youtube: "https://www.youtube.com/watch?v=4RBXiToWWww",
        docs: "https://corporatefinanceinstitute.com/resources/excel/financial-modeling/",
        practice:
          "https://corporatefinanceinstitute.com/resources/financial-modeling/",
        certification:
          "https://corporatefinanceinstitute.com/certifications/fmva/",
        description: "Build Excel models to forecast business performance",
        interviewQuestions: [
          "What are the three financial statements?",
          "How to link Income Statement to Balance Sheet?",
          "What is DCF valuation?",
          "How to build a three-statement model?",
        ],
      },
      GST: {
        youtube: "https://www.youtube.com/watch?v=pBuKFHdX3W0",
        docs: "https://www.gst.gov.in/",
        practice: "https://www.udemy.com/topic/gst/",
        certification: "https://cleartax.in/gst-course",
        description: "Goods & Services Tax – essential for Indian commerce",
        interviewQuestions: [
          "What is Input Tax Credit (ITC)?",
          "What are the different GST slabs?",
          "How to file GSTR-3B?",
          "Difference between CGST, SGST, IGST?",
        ],
      },
    },
    jobPortals: [
      {
        name: "LinkedIn",
        url: "https://linkedin.com/jobs",
        description: "Finance and accounting job listings",
        icon: "Briefcase",
        color: "#0A66C2",
        bg: "rgba(10,102,194,0.12)",
      },
      {
        name: "Naukri Finance",
        url: "https://naukri.com/finance-jobs",
        description: "CA, CMA, and finance roles",
        icon: "TrendingUp",
        color: "#059669",
        bg: "rgba(5,150,105,0.12)",
      },
      {
        name: "Indeed",
        url: "https://indeed.co.in/finance-jobs",
        description: "Banking, insurance, and finance jobs",
        icon: "Search",
        color: "#003499",
        bg: "rgba(0,52,153,0.12)",
      },
      {
        name: "CA Jobs",
        url: "https://www.icai.org/",
        description: "ICAI job placement portal for CAs",
        icon: "Award",
        color: "#7C5CFF",
        bg: "rgba(124,92,255,0.12)",
      },
      {
        name: "IBPS Portal",
        url: "https://www.ibps.in",
        description: "Bank recruitment exams and notifications",
        icon: "Building2",
        color: "#F59E0B",
        bg: "rgba(245,158,11,0.12)",
      },
    ],
    atsKeywords: [
      "accounting",
      "finance",
      "tally",
      "gst",
      "taxation",
      "financial analysis",
      "audit",
      "banking",
      "excel",
    ],
    resumeTemplate: "finance",
  },

  arts: {
    id: "arts",
    label: "Arts / Design",
    icon: "Palette",
    color: "#EC4899",
    gradient: "from-pink-500 to-rose-400",
    description: "UI/UX, graphic design, content, and creative roles",
    exampleRoles: ["UI/UX Designer", "Graphic Designer", "Content Creator"],
    roles: [
      {
        name: "UI/UX Designer",
        description: "Create intuitive digital experiences and interfaces",
        icon: "Palette",
        color: "#EC4899",
        requiredSkills: [
          "Figma",
          "Adobe XD",
          "Wireframing",
          "User Research",
          "Prototyping",
        ],
      },
      {
        name: "Graphic Designer",
        description: "Create visual content for brands and marketing",
        icon: "Image",
        color: "#6366F1",
        requiredSkills: [
          "Adobe Photoshop",
          "Illustrator",
          "InDesign",
          "Typography",
          "Branding",
        ],
      },
      {
        name: "Content Creator",
        description: "Create engaging digital content across platforms",
        icon: "PenTool",
        color: "#F59E0B",
        requiredSkills: [
          "Content Writing",
          "SEO",
          "Social Media",
          "Video Editing",
          "Photography",
        ],
      },
      {
        name: "Fashion Designer",
        description: "Design apparel and fashion collections",
        icon: "Scissors",
        color: "#14B8A6",
        requiredSkills: [
          "Pattern Making",
          "Garment Construction",
          "Fashion Illustration",
          "Textile Knowledge",
          "Merchandising",
        ],
      },
    ],
    skillResources: {
      Figma: {
        youtube: "https://www.youtube.com/watch?v=FTFaQWZBqQ8",
        docs: "https://help.figma.com/hc/en-us",
        practice: "https://www.figma.com/community",
        certification: "https://www.coursera.org/learn/ui-ux-design",
        description: "Collaborative UI/UX design and prototyping tool",
        interviewQuestions: [
          "What is auto layout in Figma?",
          "How to create reusable components?",
          "What is prototyping in Figma?",
          "Explain the design handoff process",
        ],
      },
      "Adobe Photoshop": {
        youtube: "https://www.youtube.com/watch?v=IyR_uYsRdPs",
        docs: "https://helpx.adobe.com/photoshop/user-guide.html",
        practice: "https://www.adobe.com/learn/photoshop.html",
        certification: "https://www.adobe.com/products/certify.html",
        description: "Industry-standard image editing and digital art software",
        interviewQuestions: [
          "What is the difference between raster and vector graphics?",
          "What are smart objects in Photoshop?",
          "How to use layer masks?",
          "Explain non-destructive editing",
        ],
      },
      "Content Writing": {
        youtube: "https://www.youtube.com/watch?v=Wn_eBrIDUuc",
        docs: "https://contentmarketinginstitute.com/resources/",
        practice: "https://www.grammarly.com/blog/category/writing-tips/",
        certification:
          "https://www.hubspot.com/resources/courses/content-marketing",
        description: "Write compelling content for digital platforms",
        interviewQuestions: [
          "How do you research topics for content?",
          "What is content tone and voice?",
          "Explain SEO writing techniques",
          "How to repurpose content across platforms?",
        ],
      },
      "Video Editing": {
        youtube: "https://www.youtube.com/watch?v=O6ERELse_QY",
        docs: "https://helpx.adobe.com/premiere-pro/user-guide.html",
        practice: "https://www.adobe.com/learn/premiere-pro.html",
        certification: "https://www.adobe.com/products/certify.html",
        description: "Edit and produce professional video content",
        interviewQuestions: [
          "What is the editing workflow for a video project?",
          "What are color grading and color correction?",
          "Explain keyframe animation",
          "What is audio sync and how to fix it?",
        ],
      },
    },
    jobPortals: [
      {
        name: "LinkedIn",
        url: "https://linkedin.com/jobs",
        description: "Design and creative job opportunities",
        icon: "Briefcase",
        color: "#0A66C2",
        bg: "rgba(10,102,194,0.12)",
      },
      {
        name: "Behance",
        url: "https://www.behance.net/joblist",
        description: "Creative portfolio and job network",
        icon: "Palette",
        color: "#1769FF",
        bg: "rgba(23,105,255,0.12)",
      },
      {
        name: "Dribbble",
        url: "https://dribbble.com/jobs",
        description: "Design community job board",
        icon: "Image",
        color: "#EA4C89",
        bg: "rgba(234,76,137,0.12)",
      },
      {
        name: "Indeed",
        url: "https://indeed.co.in/design-jobs",
        description: "Design and media job listings",
        icon: "Search",
        color: "#003499",
        bg: "rgba(0,52,153,0.12)",
      },
      {
        name: "Instahyre",
        url: "https://instahyre.com",
        description: "Creative and design startup jobs",
        icon: "TrendingUp",
        color: "#10B981",
        bg: "rgba(16,185,129,0.12)",
      },
    ],
    atsKeywords: [
      "design",
      "figma",
      "adobe",
      "creative",
      "ux",
      "ui",
      "branding",
      "visual",
      "content",
      "portfolio",
    ],
    resumeTemplate: "general",
  },
};

// ============================================================
// Helper Functions
// ============================================================

const DEFAULT_STREAM: StreamId = "cse";

export function getStreamById(id: StreamId | string): StreamDefinition {
  if (id && id in STREAMS) {
    return STREAMS[id as StreamId];
  }
  return STREAMS[DEFAULT_STREAM];
}

export function getAllStreams(): StreamDefinition[] {
  return Object.values(STREAMS);
}

export function getStreamRoles(streamId: StreamId | string): StreamRole[] {
  return getStreamById(streamId).roles;
}

export function getStreamSkillResource(
  streamId: StreamId | string,
  skill: string,
): SkillResource | null {
  const stream = getStreamById(streamId);
  const key = Object.keys(stream.skillResources).find(
    (k) => k.toLowerCase() === skill.toLowerCase(),
  );
  return key ? stream.skillResources[key] : null;
}

export function getStreamJobPortals(streamId: StreamId | string): JobPortal[] {
  return getStreamById(streamId).jobPortals;
}

export function getStreamRoleEligibility(
  skills: string[],
  role: StreamRole,
): {
  eligible: boolean;
  matchPercent: number;
  matched: string[];
  missing: string[];
} {
  const normalizedSkills = skills.map((s) => s.toLowerCase());
  const matched = role.requiredSkills.filter((req) =>
    normalizedSkills.some(
      (s) => s.includes(req.toLowerCase()) || req.toLowerCase().includes(s),
    ),
  );
  const missing = role.requiredSkills.filter(
    (req) =>
      !normalizedSkills.some(
        (s) => s.includes(req.toLowerCase()) || req.toLowerCase().includes(s),
      ),
  );
  const matchPercent = Math.round(
    (matched.length / role.requiredSkills.length) * 100,
  );
  return { eligible: matchPercent >= 60, matchPercent, matched, missing };
}
