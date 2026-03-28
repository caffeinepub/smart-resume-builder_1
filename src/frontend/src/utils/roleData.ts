// ============================================================
// Role Definitions
// ============================================================
export interface RoleDefinition {
  required: string[];
  description: string;
  icon: string;
  color: string;
}

export const ROLES: Record<string, RoleDefinition> = {
  "Frontend Developer": {
    required: ["HTML", "CSS", "JavaScript", "React", "TypeScript"],
    description: "Build beautiful, responsive user interfaces",
    icon: "Monitor",
    color: "#7C5CFF",
  },
  "Backend Developer": {
    required: ["Node.js", "Express", "SQL", "MongoDB", "REST API"],
    description: "Build scalable server-side applications & APIs",
    icon: "Server",
    color: "#35D0C7",
  },
  "Web Developer": {
    required: ["HTML", "CSS", "JavaScript", "Git"],
    description: "Full web development from design to deployment",
    icon: "Globe",
    color: "#4B8BFF",
  },
  "Software Engineer": {
    required: ["Data Structures", "Algorithms", "OOP", "Git", "Python"],
    description: "Design and build complex software systems",
    icon: "Code2",
    color: "#39D98A",
  },
  "Data Analyst": {
    required: ["Python", "SQL", "Excel", "Statistics", "Tableau"],
    description: "Analyze data to drive business decisions",
    icon: "BarChart2",
    color: "#F59E0B",
  },
  "Full Stack Developer": {
    required: ["React", "Node.js", "SQL", "JavaScript", "MongoDB"],
    description: "End-to-end web application development",
    icon: "Layers",
    color: "#EC4899",
  },
  "DevOps Engineer": {
    required: ["Docker", "Kubernetes", "CI/CD", "Linux", "AWS"],
    description: "Automate infrastructure and deployment pipelines",
    icon: "Settings2",
    color: "#EF4444",
  },
  "ML Engineer": {
    required: [
      "Python",
      "TensorFlow",
      "Machine Learning",
      "NumPy",
      "Statistics",
    ],
    description: "Build and deploy machine learning models",
    icon: "Brain",
    color: "#A855F7",
  },
};

export function getRoleEligibility(userSkills: string[], roleName: string) {
  const role = ROLES[roleName];
  if (!role)
    return { eligible: false, matchPercent: 0, matched: [], missing: [] };
  const normalized = userSkills.map((s) => s.toLowerCase());
  const matched = role.required.filter((s) =>
    normalized.includes(s.toLowerCase()),
  );
  const missing = role.required.filter(
    (s) => !normalized.includes(s.toLowerCase()),
  );
  const matchPercent = Math.round(
    (matched.length / role.required.length) * 100,
  );
  return { eligible: matchPercent >= 60, matchPercent, matched, missing };
}

// ============================================================
// Learning Resources
// ============================================================
export interface SkillResource {
  youtube: string;
  docs: string;
  practice: string;
  description: string;
  interviewQuestions: string[];
}

export const LEARNING_RESOURCES: Record<string, SkillResource> = {
  HTML: {
    youtube:
      "https://www.youtube.com/results?search_query=html+full+course+beginners",
    docs: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    practice: "https://www.freecodecamp.org/learn/responsive-web-design/",
    description: "The standard markup language for creating web pages",
    interviewQuestions: [
      "What is the difference between HTML and HTML5?",
      "Explain semantic HTML elements",
      "What are data attributes in HTML?",
      "Difference between block and inline elements?",
    ],
  },
  CSS: {
    youtube:
      "https://www.youtube.com/results?search_query=css+full+course+tutorial",
    docs: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    practice: "https://www.freecodecamp.org/learn/responsive-web-design/",
    description: "Style sheet language for designing web pages",
    interviewQuestions: [
      "What is the CSS box model?",
      "Explain Flexbox vs CSS Grid",
      "What is CSS specificity?",
      "How does CSS positioning work?",
    ],
  },
  JavaScript: {
    youtube:
      "https://www.youtube.com/results?search_query=javascript+full+course+2024",
    docs: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    practice: "https://www.hackerrank.com/domains/javascript",
    description: "The programming language of the web",
    interviewQuestions: [
      "What is closure in JavaScript?",
      "Explain event delegation",
      "What is the difference between == and ===?",
      "Explain async/await vs Promises",
    ],
  },
  React: {
    youtube:
      "https://www.youtube.com/results?search_query=react+js+full+course+2024",
    docs: "https://react.dev",
    practice:
      "https://www.freecodecamp.org/learn/front-end-development-libraries/",
    description: "JavaScript library for building user interfaces",
    interviewQuestions: [
      "What are React hooks? Explain useState and useEffect",
      "Virtual DOM vs Real DOM?",
      "What is prop drilling and how to avoid it?",
      "Explain React's reconciliation algorithm",
    ],
  },
  TypeScript: {
    youtube:
      "https://www.youtube.com/results?search_query=typescript+full+course+beginners",
    docs: "https://www.typescriptlang.org/docs/",
    practice: "https://exercism.org/tracks/typescript",
    description: "Typed superset of JavaScript for safer code",
    interviewQuestions: [
      "What are generics in TypeScript?",
      "Difference between interface and type?",
      "What is the any vs unknown type?",
      "Explain TypeScript decorators",
    ],
  },
  "Node.js": {
    youtube:
      "https://www.youtube.com/results?search_query=nodejs+full+course+2024",
    docs: "https://nodejs.org/en/docs/",
    practice: "https://www.hackerrank.com/domains/nodejs",
    description: "JavaScript runtime for server-side development",
    interviewQuestions: [
      "What is the event loop in Node.js?",
      "Explain middleware in Express.js",
      "What is the difference between require and import?",
      "How to handle errors in async Node.js code?",
    ],
  },
  Python: {
    youtube:
      "https://www.youtube.com/results?search_query=python+full+course+beginners+2024",
    docs: "https://docs.python.org/3/",
    practice: "https://www.hackerrank.com/domains/python",
    description: "Versatile language for web, data science, and AI",
    interviewQuestions: [
      "What are Python decorators?",
      "Explain list comprehensions",
      "What is GIL in Python?",
      "Difference between list and tuple?",
    ],
  },
  SQL: {
    youtube:
      "https://www.youtube.com/results?search_query=sql+tutorial+complete+course",
    docs: "https://www.postgresql.org/docs/",
    practice: "https://www.hackerrank.com/domains/sql",
    description: "Standard language for relational database management",
    interviewQuestions: [
      "What is the difference between INNER JOIN and LEFT JOIN?",
      "Explain database normalization",
      "What are indexes and when should you use them?",
      "Difference between WHERE and HAVING?",
    ],
  },
  Git: {
    youtube:
      "https://www.youtube.com/results?search_query=git+github+tutorial+beginners",
    docs: "https://git-scm.com/doc",
    practice: "https://learngitbranching.js.org/",
    description: "Version control system for tracking code changes",
    interviewQuestions: [
      "What is git rebase vs git merge?",
      "Explain git branching strategy",
      "How to resolve merge conflicts?",
      "What is git cherry-pick?",
    ],
  },
  Docker: {
    youtube:
      "https://www.youtube.com/results?search_query=docker+tutorial+beginners+2024",
    docs: "https://docs.docker.com/",
    practice: "https://www.katacoda.com/courses/docker",
    description: "Platform for containerizing and deploying applications",
    interviewQuestions: [
      "What is the difference between a container and a VM?",
      "Explain Docker networking",
      "What is a Dockerfile?",
      "Docker Compose vs Kubernetes?",
    ],
  },
  MongoDB: {
    youtube:
      "https://www.youtube.com/results?search_query=mongodb+tutorial+complete+course",
    docs: "https://www.mongodb.com/docs/",
    practice: "https://university.mongodb.com/",
    description: "NoSQL document database for modern applications",
    interviewQuestions: [
      "SQL vs NoSQL differences?",
      "What is aggregation pipeline?",
      "Explain MongoDB indexing",
      "When to use embedded vs referenced documents?",
    ],
  },
  "Data Structures": {
    youtube:
      "https://www.youtube.com/results?search_query=data+structures+algorithms+course",
    docs: "https://www.geeksforgeeks.org/data-structures/",
    practice: "https://leetcode.com/explore/learn/",
    description:
      "Fundamental concepts for organizing and storing data efficiently",
    interviewQuestions: [
      "Array vs LinkedList trade-offs?",
      "Explain Big-O notation",
      "When to use a stack vs queue?",
      "What is a hash table?",
    ],
  },
  Algorithms: {
    youtube:
      "https://www.youtube.com/results?search_query=algorithms+course+complete",
    docs: "https://www.geeksforgeeks.org/fundamentals-of-algorithms/",
    practice: "https://leetcode.com/",
    description: "Step-by-step problem-solving procedures",
    interviewQuestions: [
      "Explain binary search",
      "BFS vs DFS?",
      "What is dynamic programming?",
      "Explain sorting algorithms and their complexities",
    ],
  },
  Express: {
    youtube:
      "https://www.youtube.com/results?search_query=express+js+tutorial+rest+api",
    docs: "https://expressjs.com/",
    practice:
      "https://www.freecodecamp.org/learn/back-end-development-and-apis/",
    description: "Minimal and flexible Node.js web framework",
    interviewQuestions: [
      "What is middleware in Express?",
      "How to handle errors in Express?",
      "RESTful API design principles?",
      "What is CORS and how to enable it?",
    ],
  },
  "Tailwind CSS": {
    youtube:
      "https://www.youtube.com/results?search_query=tailwind+css+crash+course",
    docs: "https://tailwindcss.com/docs",
    practice: "https://play.tailwindcss.com/",
    description: "Utility-first CSS framework for rapid UI development",
    interviewQuestions: [
      "Tailwind vs Bootstrap?",
      "How to customize Tailwind config?",
      "Explain JIT mode in Tailwind",
      "What are Tailwind variants?",
    ],
  },
};

// ============================================================
// Career Roadmaps
// ============================================================
export interface RoadmapPhase {
  title: string;
  icon: string;
  color: string;
  items: Array<{
    id: string;
    label: string;
    type: "skill" | "project" | "task";
  }>;
}

export const CAREER_ROADMAPS: Record<string, RoadmapPhase[]> = {
  "Frontend Developer": [
    {
      title: "Phase 1: Learn Core Skills",
      icon: "BookOpen",
      color: "#7C5CFF",
      items: [
        {
          id: "learn-html",
          label: "Master HTML5 semantics & accessibility",
          type: "skill",
        },
        {
          id: "learn-css",
          label: "CSS3, Flexbox, Grid & animations",
          type: "skill",
        },
        {
          id: "learn-javascript",
          label: "JavaScript ES6+, async/await, DOM APIs",
          type: "skill",
        },
        {
          id: "learn-react",
          label: "React hooks, components & state management",
          type: "skill",
        },
        {
          id: "learn-typescript",
          label: "TypeScript fundamentals & advanced types",
          type: "skill",
        },
        {
          id: "learn-git",
          label: "Git version control & GitHub workflows",
          type: "skill",
        },
      ],
    },
    {
      title: "Phase 2: Build Projects",
      icon: "Code2",
      color: "#35D0C7",
      items: [
        {
          id: "project-portfolio",
          label: "Build a personal portfolio website",
          type: "project",
        },
        {
          id: "project-todo",
          label: "Todo app with React + local storage",
          type: "project",
        },
        {
          id: "project-weather",
          label: "Weather app using a public API",
          type: "project",
        },
        {
          id: "project-ecommerce",
          label: "E-commerce product page with cart",
          type: "project",
        },
        {
          id: "project-blog",
          label: "Blog/CMS with React Router",
          type: "project",
        },
      ],
    },
    {
      title: "Phase 3: Interview Preparation",
      icon: "Target",
      color: "#39D98A",
      items: [
        {
          id: "prep-dsa",
          label: "Solve 75 LeetCode problems (Easy-Medium)",
          type: "task",
        },
        {
          id: "prep-css-questions",
          label: "Practice 50 CSS/HTML interview questions",
          type: "task",
        },
        {
          id: "prep-react-questions",
          label: "Review React lifecycle & hooks Q&A",
          type: "task",
        },
        {
          id: "prep-mock",
          label: "Complete 3 mock technical interviews",
          type: "task",
        },
        {
          id: "prep-system",
          label: "Study frontend system design basics",
          type: "task",
        },
      ],
    },
    {
      title: "Phase 4: Apply for Jobs",
      icon: "Briefcase",
      color: "#4B8BFF",
      items: [
        {
          id: "apply-resume",
          label: "Optimize resume with ATS keywords",
          type: "task",
        },
        {
          id: "apply-github",
          label: "Polish GitHub profile & pin best projects",
          type: "task",
        },
        {
          id: "apply-linkedin",
          label: "Update LinkedIn with skills & projects",
          type: "task",
        },
        {
          id: "apply-internshala",
          label: "Apply to 10 internships on Internshala",
          type: "task",
        },
        {
          id: "apply-linkedin-jobs",
          label: "Apply to 20+ frontend roles on LinkedIn",
          type: "task",
        },
      ],
    },
  ],
  "Backend Developer": [
    {
      title: "Phase 1: Learn Core Skills",
      icon: "BookOpen",
      color: "#7C5CFF",
      items: [
        {
          id: "be-js",
          label: "JavaScript/TypeScript fundamentals",
          type: "skill",
        },
        {
          id: "be-node",
          label: "Node.js & Express.js framework",
          type: "skill",
        },
        {
          id: "be-sql",
          label: "SQL databases (PostgreSQL/MySQL)",
          type: "skill",
        },
        { id: "be-nosql", label: "NoSQL databases (MongoDB)", type: "skill" },
        {
          id: "be-api",
          label: "REST API design & authentication (JWT)",
          type: "skill",
        },
        {
          id: "be-docker",
          label: "Docker & basic containerization",
          type: "skill",
        },
      ],
    },
    {
      title: "Phase 2: Build Projects",
      icon: "Code2",
      color: "#35D0C7",
      items: [
        {
          id: "be-proj-rest",
          label: "Build a CRUD REST API with Express",
          type: "project",
        },
        {
          id: "be-proj-auth",
          label: "User authentication system with JWT",
          type: "project",
        },
        {
          id: "be-proj-ecom",
          label: "E-commerce backend with payments",
          type: "project",
        },
        {
          id: "be-proj-chat",
          label: "Real-time chat server with WebSockets",
          type: "project",
        },
      ],
    },
    {
      title: "Phase 3: Interview Preparation",
      icon: "Target",
      color: "#39D98A",
      items: [
        {
          id: "be-prep-dsa",
          label: "Solve 100 LeetCode problems",
          type: "task",
        },
        {
          id: "be-prep-db",
          label: "Practice SQL query optimization",
          type: "task",
        },
        {
          id: "be-prep-system",
          label: "Study system design patterns",
          type: "task",
        },
        {
          id: "be-prep-os",
          label: "Review OS & networking concepts",
          type: "task",
        },
      ],
    },
    {
      title: "Phase 4: Apply for Jobs",
      icon: "Briefcase",
      color: "#4B8BFF",
      items: [
        {
          id: "be-apply-resume",
          label: "Highlight backend skills on resume",
          type: "task",
        },
        {
          id: "be-apply-github",
          label: "Showcase API projects on GitHub",
          type: "task",
        },
        {
          id: "be-apply-naukri",
          label: "Apply on Naukri, LinkedIn, AngelList",
          type: "task",
        },
      ],
    },
  ],
  "Data Analyst": [
    {
      title: "Phase 1: Learn Core Skills",
      icon: "BookOpen",
      color: "#7C5CFF",
      items: [
        { id: "da-python", label: "Python with Pandas & NumPy", type: "skill" },
        {
          id: "da-sql",
          label: "Advanced SQL queries & optimization",
          type: "skill",
        },
        {
          id: "da-excel",
          label: "Excel: VLOOKUP, pivot tables, charts",
          type: "skill",
        },
        {
          id: "da-stats",
          label: "Statistics & probability fundamentals",
          type: "skill",
        },
        {
          id: "da-viz",
          label: "Data visualization with Matplotlib/Seaborn",
          type: "skill",
        },
        {
          id: "da-tableau",
          label: "Tableau or Power BI dashboards",
          type: "skill",
        },
      ],
    },
    {
      title: "Phase 2: Build Projects",
      icon: "Code2",
      color: "#35D0C7",
      items: [
        {
          id: "da-proj-eda",
          label: "Exploratory data analysis on Kaggle dataset",
          type: "project",
        },
        {
          id: "da-proj-dashboard",
          label: "Sales analytics Tableau dashboard",
          type: "project",
        },
        {
          id: "da-proj-predict",
          label: "Predictive model for business metrics",
          type: "project",
        },
      ],
    },
    {
      title: "Phase 3: Interview Preparation",
      icon: "Target",
      color: "#39D98A",
      items: [
        {
          id: "da-prep-sql",
          label: "Practice 50 SQL interview questions",
          type: "task",
        },
        {
          id: "da-prep-stats",
          label: "Review statistical concepts for interviews",
          type: "task",
        },
        {
          id: "da-prep-case",
          label: "Solve 10 business case studies",
          type: "task",
        },
      ],
    },
    {
      title: "Phase 4: Apply for Jobs",
      icon: "Briefcase",
      color: "#4B8BFF",
      items: [
        {
          id: "da-apply-kaggle",
          label: "Build Kaggle profile with 5+ notebooks",
          type: "task",
        },
        {
          id: "da-apply-linkedin",
          label: "Apply to analyst roles on LinkedIn",
          type: "task",
        },
        {
          id: "da-apply-naukri",
          label: "Target data analyst roles on Naukri",
          type: "task",
        },
      ],
    },
  ],
  "Full Stack Developer": [
    {
      title: "Phase 1: Learn Core Skills",
      icon: "BookOpen",
      color: "#7C5CFF",
      items: [
        {
          id: "fs-html-css",
          label: "HTML5 & CSS3 fundamentals",
          type: "skill",
        },
        { id: "fs-js", label: "JavaScript & TypeScript", type: "skill" },
        {
          id: "fs-react",
          label: "React.js with hooks & context",
          type: "skill",
        },
        { id: "fs-node", label: "Node.js & Express APIs", type: "skill" },
        { id: "fs-db", label: "SQL & MongoDB databases", type: "skill" },
        {
          id: "fs-deploy",
          label: "Deployment (Vercel, Heroku, AWS)",
          type: "skill",
        },
      ],
    },
    {
      title: "Phase 2: Build Projects",
      icon: "Code2",
      color: "#35D0C7",
      items: [
        {
          id: "fs-proj-mern",
          label: "Full MERN stack social media app",
          type: "project",
        },
        {
          id: "fs-proj-ecom",
          label: "E-commerce platform with payments",
          type: "project",
        },
        {
          id: "fs-proj-saas",
          label: "SaaS tool with auth & subscriptions",
          type: "project",
        },
      ],
    },
    {
      title: "Phase 3: Interview Preparation",
      icon: "Target",
      color: "#39D98A",
      items: [
        {
          id: "fs-prep-dsa",
          label: "Complete LeetCode 150 problems",
          type: "task",
        },
        {
          id: "fs-prep-system",
          label: "Study system design (Grokking the System Design)",
          type: "task",
        },
        {
          id: "fs-prep-mock",
          label: "5 mock full-stack interviews",
          type: "task",
        },
      ],
    },
    {
      title: "Phase 4: Apply for Jobs",
      icon: "Briefcase",
      color: "#4B8BFF",
      items: [
        {
          id: "fs-apply-startup",
          label: "Apply to startups on AngelList/Wellfound",
          type: "task",
        },
        {
          id: "fs-apply-linkedin",
          label: "100 applications on LinkedIn",
          type: "task",
        },
        {
          id: "fs-apply-remote",
          label: "Remote jobs on RemoteOK & We Work Remotely",
          type: "task",
        },
      ],
    },
  ],
  "Software Engineer": [
    {
      title: "Phase 1: Learn Core Skills",
      icon: "BookOpen",
      color: "#7C5CFF",
      items: [
        {
          id: "se-lang",
          label: "Master one language: Python/Java/C++",
          type: "skill",
        },
        {
          id: "se-dsa",
          label: "Data structures & algorithms deeply",
          type: "skill",
        },
        {
          id: "se-oop",
          label: "OOP principles & design patterns",
          type: "skill",
        },
        {
          id: "se-os",
          label: "OS, networking & system concepts",
          type: "skill",
        },
        { id: "se-db", label: "Database design & SQL", type: "skill" },
        {
          id: "se-git",
          label: "Git & collaborative development",
          type: "skill",
        },
      ],
    },
    {
      title: "Phase 2: Build Projects",
      icon: "Code2",
      color: "#35D0C7",
      items: [
        {
          id: "se-proj-ds",
          label: "Implement data structure library from scratch",
          type: "project",
        },
        {
          id: "se-proj-system",
          label: "Build a URL shortener or rate limiter",
          type: "project",
        },
        {
          id: "se-proj-open",
          label: "Contribute to an open source project",
          type: "project",
        },
      ],
    },
    {
      title: "Phase 3: Interview Preparation",
      icon: "Target",
      color: "#39D98A",
      items: [
        {
          id: "se-prep-lc",
          label: "Complete 200 LeetCode problems",
          type: "task",
        },
        {
          id: "se-prep-ctci",
          label: "Study Cracking the Coding Interview",
          type: "task",
        },
        {
          id: "se-prep-behavior",
          label: "Prepare STAR behavioral stories",
          type: "task",
        },
        {
          id: "se-prep-system",
          label: "System design mock interviews",
          type: "task",
        },
      ],
    },
    {
      title: "Phase 4: Apply for Jobs",
      icon: "Briefcase",
      color: "#4B8BFF",
      items: [
        {
          id: "se-apply-top",
          label: "Apply to FAANG/MAANG companies",
          type: "task",
        },
        {
          id: "se-apply-linkedin",
          label: "Network aggressively on LinkedIn",
          type: "task",
        },
        {
          id: "se-apply-campus",
          label: "Participate in campus placements",
          type: "task",
        },
      ],
    },
  ],
};
