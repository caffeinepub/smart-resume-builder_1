import { MessageSquare, Shuffle } from "lucide-react";
import { useState } from "react";
import AppShell from "../components/AppShell";
import { getUserStream } from "../utils/auth";
import { getStreamById } from "../utils/streamData";

// ============================================================
// Stream-aware Interview Question Banks
// ============================================================
const STREAM_INTERVIEW_BANKS: Record<string, Record<string, string[]>> = {
  cse: {
    "HR Questions": [
      "Tell me about yourself.",
      "Why do you want to join our company?",
      "Where do you see yourself in 5 years?",
      "What are your greatest strengths?",
      "What are your weaknesses and how do you address them?",
      "Describe a challenging project you worked on and how you handled it.",
      "Why are you leaving your current job / Why are you looking for a new opportunity?",
      "How do you handle pressure and tight deadlines?",
      "Tell me about a time you worked effectively in a team.",
      "What motivates you to perform your best at work?",
    ],
    "Technical Questions": [
      "Explain the four pillars of Object-Oriented Programming (OOP).",
      "What is a REST API and how does it work?",
      "What is the difference between SQL and NoSQL databases?",
      "Explain the SOLID principles in software development.",
      "What is Docker and why is it used?",
      "Explain microservices architecture and its advantages.",
      "What is CI/CD and why is it important?",
      "What is the difference between authentication and authorization?",
      "Explain the concept of Big O notation.",
      "What is version control and how does Git work?",
    ],
    "Coding Questions": [
      "Write a function to reverse a linked list.",
      "Check if a given string is a palindrome.",
      "Find the duplicate number in an array of n integers.",
      "Implement binary search on a sorted array.",
      "Print the Fibonacci series up to n terms.",
      "Solve the Two Sum problem: find indices of two numbers that add to a target.",
      "Write code to check if two strings are anagrams.",
      "Implement a stack using two queues.",
      "Find the maximum subarray sum (Kadane's Algorithm).",
      "Write a function to flatten a nested array.",
    ],
    "System Design": [
      "How would you design a URL shortener like bit.ly?",
      "Design a real-time chat system like WhatsApp.",
      "How does DNS work? Explain the resolution process.",
      "Explain load balancing and different load balancing strategies.",
      "What is the CAP theorem? Give examples.",
      "How would you design a scalable notification system?",
      "Explain database sharding and when you would use it.",
      "How would you design a rate limiter for an API?",
      "What is caching? Explain Redis vs Memcached.",
      "How would you design an e-commerce product search system?",
    ],
  },

  mechanical: {
    "HR & Soft Skills": [
      "Tell me about yourself and your engineering background.",
      "Describe a time you solved a difficult mechanical problem in a team setting.",
      "How do you prioritize safety in a manufacturing environment?",
      "Where do you see yourself in 5 years in the engineering field?",
      "Tell me about a project where you had to manage tight deadlines and design constraints.",
      "How do you keep up with the latest developments in mechanical engineering?",
      "Describe a situation where your technical decision was questioned. How did you handle it?",
      "What motivates you in engineering work — design, production, or research?",
      "How do you work in cross-functional teams (with electrical, civil, or management teams)?",
      "What are your greatest strengths as a mechanical engineer?",
    ],
    "Core Mechanical": [
      "Explain the difference between stress and strain. How is Young's modulus related?",
      "Describe the working principle of an Otto cycle vs Diesel cycle.",
      "What is a heat exchanger and what are its types? Where are they used?",
      "Explain the difference between casting and forging. When would you choose each?",
      "What is the significance of material hardness, toughness, and ductility in design?",
      "Explain CAD (Computer-Aided Design) and name the tools you've used.",
      "What is tolerance in engineering? Explain tolerance stack-up.",
      "What is cavitation in fluid machinery and how is it prevented?",
      "What is preventive vs predictive maintenance? When would you use each?",
      "Explain the concept of automation in manufacturing. What is Industry 4.0?",
    ],
    "Technical Interview": [
      "Walk me through a CAD project you completed. What were the challenges?",
      "How would you approach a design problem with conflicting constraints (weight vs strength)?",
      "What is FMEA (Failure Mode and Effects Analysis) and how have you applied it?",
      "Explain the principles of lean manufacturing and give an example of waste reduction.",
      "What are ISO 9001 standards and why are they important in manufacturing?",
      "How do you ensure quality control in a production process?",
      "Describe a plant layout design challenge and how you would approach it.",
      "What is GD&T (Geometric Dimensioning and Tolerancing) and when is it used?",
      "How would you analyze a machine failure and recommend corrective action?",
      "Explain your approach to project planning for a new product development cycle.",
    ],
    "Situational Questions": [
      "You discover a critical safety flaw in a product that is about to be shipped. What do you do?",
      "A client insists on a design that you know will fail. How do you handle it?",
      "Your team is behind schedule due to a supplier delay. What steps do you take?",
      "You are given a broken machine to repair with limited information. How do you diagnose it?",
      "You need to reduce manufacturing costs by 15% without compromising quality. Describe your approach.",
      "A colleague makes an error that leads to a production line stoppage. How do you respond?",
      "You are asked to implement a new technology on the shop floor. How do you manage resistance to change?",
      "During an audit, you discover that a process is not following the SOP. What do you do?",
      "You are leading a cross-functional team with conflicting priorities. How do you align everyone?",
      "Your manager asks you to approve a design that does not meet safety standards. What do you do?",
    ],
  },

  electrical: {
    "HR & Soft Skills": [
      "Tell me about yourself and your electrical engineering background.",
      "Describe a time you troubleshot a complex electrical problem under pressure.",
      "How do you ensure electrical safety in your work environment?",
      "Where do you see yourself in 5 years in the power/embedded/electronics field?",
      "Tell me about a challenging project — what technical obstacles did you face?",
      "How do you stay current with developments in electrical engineering (standards, new tech)?",
      "Describe a situation where you disagreed with a design decision. How did you resolve it?",
      "How do you handle working in both lab and field environments?",
      "Tell me about your experience collaborating with mechanical or software teams.",
      "What are your key strengths as an electrical engineer?",
    ],
    "Core Electrical": [
      "Explain the working principle of a synchronous motor vs an induction motor.",
      "What is a power factor and why is power factor correction important?",
      "Explain the working of a differential protection relay for a transformer.",
      "What is a PID controller? How do you tune its parameters?",
      "Explain the concept of microcontroller vs microprocessor. When do you use each?",
      "What is sampling rate in signal processing and how does it relate to Nyquist theorem?",
      "What is SCADA and where is it used in electrical systems?",
      "Explain electrical safety standards (IS 732, IS 900) in electrical installations.",
      "What is IEC wiring standard and how does it differ from IS standard?",
      "What is demand-side energy management? How can industries reduce energy costs?",
    ],
    "Technical Interview": [
      "Walk me through the design of a power supply circuit you built.",
      "How would you design a PCB layout for a microcontroller-based system?",
      "Explain how you would write PLC ladder logic for a conveyor system with safety interlocks.",
      "A motor is tripping on overcurrent. Describe your troubleshooting approach.",
      "How would you calculate cable sizing for an industrial load?",
      "Describe a project where you designed or implemented an embedded system.",
      "What tools do you use for circuit simulation? Walk through a design you simulated.",
      "How would you implement IoT connectivity in an existing industrial system?",
      "Explain how to read and interpret a single-line diagram (SLD) of a substation.",
      "How would you ensure EMC (Electromagnetic Compatibility) in a circuit design?",
    ],
    "Situational Questions": [
      "An electrical fault shuts down a critical production line. Describe your immediate steps.",
      "You find that an installed electrical panel does not comply with IS standards. What do you do?",
      "You are asked to commission a new HT panel with incomplete documentation. How do you proceed?",
      "Your team must select between two different motor drives for a project. Walk through your evaluation.",
      "A client wants to add more load to an existing electrical installation. How do you assess feasibility?",
      "During testing, you detect an abnormal reading in a protection relay. What is your response?",
      "You are given budget to upgrade an aging substation. How do you prioritize the upgrades?",
      "A software glitch causes erratic behavior in your SCADA system during live operation. What do you do?",
      "Your team has conflicting views on selecting AC vs DC for a new industrial project. How do you decide?",
      "You discover a safety violation by a contractor during an inspection. How do you handle it?",
    ],
  },

  civil: {
    "HR & Soft Skills": [
      "Tell me about yourself and your civil engineering background.",
      "Describe a challenging construction project and how you managed the technical challenges.",
      "How do you approach site safety and ensuring workers follow safety protocols?",
      "Where do you see yourself in 5 years — design office, site management, or consulting?",
      "Tell me about a time you had to deal with unexpected site conditions. What did you do?",
      "How do you manage multiple stakeholders including clients, contractors, and authorities?",
      "Describe a situation where a project faced delays. How did you recover the schedule?",
      "How do you ensure quality control during construction?",
      "Have you worked with cross-discipline teams? How do you coordinate with architects and MEP?",
      "What are your key strengths as a civil engineer?",
    ],
    "Core Civil": [
      "Explain the difference between limit state design and working stress design for RCC.",
      "What is the bearing capacity of soil and how is it determined in the field?",
      "Describe the process of preparing a BOQ (Bill of Quantities) for a construction project.",
      "What quality tests are performed on concrete before and after pouring?",
      "Explain how you would design a simple retaining wall for a slope.",
      "What is IS 456 and what are its key provisions for RCC design?",
      "What is CPM (Critical Path Method) in project planning? How do you identify the critical path?",
      "What are the key considerations for site safety management under IS 7969 and other standards?",
      "Explain the difference between OPC and PPC cement and when to use each.",
      "What is a Contract Agreement and what are the key clauses to check in a construction contract?",
    ],
    "Technical Interview": [
      "Walk me through the structural design process for a residential building.",
      "How would you approach the design of a water retaining structure?",
      "Describe your experience with STAAD Pro or ETABS for structural analysis.",
      "How do you handle a situation where actual site conditions differ from the design drawings?",
      "Explain how you prepare and review shop drawings.",
      "What are the steps involved in getting building plan approval from local authorities?",
      "How would you approach value engineering on a project to reduce cost without sacrificing quality?",
      "Describe how you would plan the construction sequence for a multi-storey building.",
      "What checks do you perform before accepting concrete from a ready-mix plant?",
      "How do you document site issues and manage RFIs (Request for Information)?",
    ],
    "Situational Questions": [
      "During excavation, you discover unexpected poor soil conditions. What do you do?",
      "A contractor claims the design drawings are impractical. How do you resolve this?",
      "Your project is running 2 months behind schedule. What steps do you take to recover?",
      "You receive test results showing concrete strength is below specification. What is your course of action?",
      "A local authority objects to part of your building design. How do you handle it?",
      "A key material supplier fails to deliver on time, delaying critical work. What do you do?",
      "Your client wants to add a floor to an existing building mid-construction. How do you assess this?",
      "A serious safety incident occurs on your site. What are your immediate and follow-up actions?",
      "You are asked to approve a variation order that you believe is not within scope. How do you respond?",
      "Budget overrun is projected at 20% of the original contract value. How do you address this?",
    ],
  },

  mba: {
    "HR & Behavioral": [
      "Tell me about yourself and your management background.",
      "Why do you want to pursue a career in management/business?",
      "Give an example of a leadership situation where you had to influence without authority.",
      "Describe a time you dealt with a difficult team member. What was the outcome?",
      "Where do you see yourself in 5 years — functional specialist or general management?",
      "Tell me about a time you had to make a decision with incomplete information.",
      "How do you prioritize when you have multiple conflicting deadlines?",
      "Describe a situation where you demonstrated analytical skills to solve a business problem.",
      "What is your management style? Give a specific example.",
      "Why should we hire you over other MBA candidates?",
    ],
    "Case Study Questions": [
      "A new competitor has entered your market with a 30% lower price. How should your company respond?",
      "How would you evaluate whether your company should enter a new international market?",
      "A company's revenue is declining despite increased marketing spend. What is driving this and how do you fix it?",
      "Two companies want to merge. Walk through the key considerations for evaluating this M&A deal.",
      "A competitor is gaining market share rapidly. What strategic options do you recommend?",
      "How would you develop a growth strategy for a company that has hit a revenue plateau?",
      "Walk me through a new product launch strategy for a B2B SaaS company.",
      "A company needs to cut costs by 20% while maintaining service quality. How would you approach this?",
      "How would you redesign a company's supply chain to improve efficiency and reduce costs?",
      "A traditional company wants to undergo digital transformation. What is your roadmap?",
    ],
    "Business Knowledge": [
      "Explain Porter's Five Forces with an example from a current industry.",
      "What is a Blue Ocean Strategy and how does it differ from competing in an existing market?",
      "Explain the BCG Growth-Share Matrix and how you would use it for portfolio analysis.",
      "What is the difference between management accounting and financial accounting?",
      "Explain the concept of Net Promoter Score (NPS) and how it drives business decisions.",
      "What is agile project management and when would you apply it vs waterfall?",
      "Explain the Balanced Scorecard framework and its four perspectives.",
      "What is change management and what models (Kotter, ADKAR) guide it?",
      "Explain the difference between coaching, mentoring, and managing.",
      "What is ESG (Environmental, Social, Governance) and why is it important for businesses today?",
    ],
    "Leadership & Situational": [
      "Your team is consistently missing targets. As their manager, what steps do you take?",
      "A high-performing employee is clashing with the team. How do you handle it?",
      "You are asked to lead a change initiative that your team is resistant to. What is your approach?",
      "You have two competing projects and limited resources. How do you decide which to prioritize?",
      "A major client threatens to leave because of service issues. What do you do?",
      "You inherit a team with low morale and poor performance. What are your first 90 days?",
      "You need to give critical feedback to a senior colleague. How do you approach this?",
      "You are asked to cut your team's budget by 25%. How do you decide what to cut?",
      "An ethical issue arises in a business deal that could bring short-term profit. What do you do?",
      "You need to build a high-performing team from scratch. What is your hiring and onboarding strategy?",
    ],
  },

  medical: {
    "HR & Soft Skills": [
      "Tell me about yourself and your healthcare background.",
      "Why did you choose a career in the healthcare or medical field?",
      "How do you handle a situation where a patient or family member is upset or aggressive?",
      "Describe a time when you worked under high pressure. How did you manage patient care?",
      "Where do you see yourself in 5 years — clinical practice, research, or healthcare management?",
      "How do you keep up with medical knowledge and evidence-based practices?",
      "Describe a situation where you had to deliver difficult news. How did you handle it?",
      "How do you ensure patient confidentiality in your day-to-day work?",
      "Tell me about a time you worked in a multidisciplinary team for patient care.",
      "What are your key strengths as a healthcare professional?",
    ],
    "Clinical Knowledge": [
      "What are the classic signs and symptoms of acute myocardial infarction (heart attack)?",
      "Describe the standard approach to managing a diabetic ketoacidosis (DKA) case.",
      "Explain the difference between a Type 1 and Type 2 error in clinical research.",
      "What is evidence-based medicine and how do you apply it in clinical practice?",
      "Describe the principles of pharmacokinetics: absorption, distribution, metabolism, excretion.",
      "What are the layers and key structures of the heart relevant to cardiac procedures?",
      "Explain the pathophysiology of pneumonia and its standard treatment approach.",
      "How do you interpret a basic blood count (CBC) report? What abnormalities concern you?",
      "What are the standard phases of clinical trials and what does each evaluate?",
      "Describe a medical scenario where patient autonomy conflicted with your clinical judgment. What did you do?",
    ],
    "Healthcare Scenarios": [
      "A patient refuses a life-saving procedure. How do you approach this situation?",
      "You notice a colleague administering an incorrect medication dose. What do you do?",
      "A patient with limited English asks about their diagnosis. How do you communicate effectively?",
      "You receive two emergency admissions simultaneously with limited staff. How do you triage?",
      "A patient's family demands aggressive intervention, but the prognosis is very poor. How do you navigate this?",
      "You discover a data error in a patient's medical record that could affect treatment. What is your action?",
      "A clinical guideline contradicts what your senior doctor is doing. How do you handle this?",
      "A patient comes in with symptoms that do not fit any clear diagnosis. Describe your approach.",
      "There is an outbreak of hospital-acquired infection on your ward. What steps do you initiate?",
      "You are asked to do a procedure you are not fully confident in without supervision. What do you say?",
    ],
    "Research & Management": [
      "What is the difference between a randomized controlled trial (RCT) and an observational study?",
      "How would you critically appraise a medical research paper?",
      "What are the key components of a clinical research protocol?",
      "Explain the concept of quality improvement (QI) in healthcare with an example.",
      "How would you implement a new clinical guideline across a hospital department?",
      "What are the key patient safety indicators and how are they monitored?",
      "Explain the GCP (Good Clinical Practice) guidelines and their importance in clinical trials.",
      "How is healthcare resource allocation done — who decides, and by what principles?",
      "What is lean healthcare and how can it reduce waste in hospital operations?",
      "How would you use data analytics to improve patient outcomes in a clinical department?",
    ],
  },

  commerce: {
    "HR & Behavioral": [
      "Tell me about yourself and your commerce/finance background.",
      "Why did you choose commerce/finance as your career path?",
      "Describe a time you identified a financial error that saved the company money.",
      "Where do you see yourself in 5 years — audit, taxation, banking, or financial analysis?",
      "How do you handle pressure during audit season or financial year-end closing?",
      "Tell me about a time you had to explain complex financial data to a non-financial audience.",
      "How do you stay current with changes in tax laws, accounting standards, and financial regulations?",
      "Describe a situation where your attention to detail prevented a significant mistake.",
      "How do you prioritize multiple deadlines like TDS returns, GST filing, and audit?",
      "What are your key strengths as a finance/commerce professional?",
    ],
    "Accounting & Finance": [
      "Walk me through the preparation of a complete set of final accounts.",
      "Explain the difference between revenue recognition under AS-9 and Ind AS 115.",
      "What are deferred tax assets and liabilities? When do they arise?",
      "Explain the audit process — planning, execution, and reporting phases.",
      "How does GST reconciliation work? What are the common mismatches between GSTR-2A and purchase register?",
      "Explain the difference between secured and unsecured creditors in a bankruptcy proceeding.",
      "What are the key differences between FD, RD, PPF, and ELSS from an investor's perspective?",
      "Explain the RBI's monetary policy tools and how they affect the banking sector.",
      "What is financial due diligence and when is it required?",
      "How do you calculate the return on equity (ROE) and what does it indicate?",
    ],
    "Technical Finance": [
      "Build a simple 3-statement financial model. What are the key linkages between P&L, Balance Sheet, and Cash Flow?",
      "How would you value a company using DCF (Discounted Cash Flow) method?",
      "Explain the difference between equity value and enterprise value.",
      "What is a leveraged buyout (LBO) and when is it used?",
      "Explain options pricing — what factors affect the price of a call option (Black-Scholes)?",
      "What is portfolio diversification? Explain systematic vs unsystematic risk.",
      "How do you build a sensitivity analysis in a financial model?",
      "Explain the concept of yield to maturity (YTM) for a bond.",
      "What is credit risk and how do banks assess it for a loan application?",
      "Explain mark-to-market accounting and its impact during financial crises.",
    ],
    "Situational Questions": [
      "You discover a significant accounting irregularity during an internal audit. What do you do?",
      "The company's cash flow is tightening. What steps do you recommend to improve liquidity?",
      "A client asks you to book revenue before the service is delivered to meet quarterly targets. How do you respond?",
      "Tax rates change mid-year, affecting your company's deferred tax calculations. How do you handle this?",
      "You are preparing financial statements and find the numbers do not reconcile. Walk through your process.",
      "A bank asks for audited financials but your audit is delayed. How do you manage the stakeholder?",
      "You are asked to forecast revenue for a new product with no historical data. What approach do you use?",
      "A senior manager asks you to delay recording an expense to improve the quarter's results. What do you do?",
      "Your company is planning an IPO. What financial reporting requirements must you prepare for?",
      "Inflation is rising significantly. How does this impact your company's financial planning and reporting?",
    ],
  },

  arts: {
    "HR & Behavioral": [
      "Tell me about yourself and your creative background.",
      "Why did you choose a career in design/arts/media?",
      "How do you handle criticism of your creative work from a client or art director?",
      "Describe a project where you had tight deadlines and creative constraints. How did you manage?",
      "Where do you see yourself in 5 years — freelance, agency, in-house, or your own studio?",
      "Tell me about a creative project you are most proud of. What made it successful?",
      "How do you stay inspired and keep your creative skills sharp?",
      "Describe a time you had a creative disagreement with a client or colleague. How did you resolve it?",
      "How do you balance your personal creative vision with client requirements?",
      "What are your key strengths as a creative professional?",
    ],
    "Design & Creativity": [
      "Walk me through your design process from brief to final delivery.",
      "How do you conduct user research before starting a design project?",
      "Explain how you would create a brand identity from scratch for a new startup.",
      "A client's brief is vague. How do you extract the necessary information to begin designing?",
      "How do you approach creative problem-solving when you are stuck or facing a block?",
      "What tools and software are in your design workflow? How do you decide what to use when?",
      "How do you manage version control and file organization in your projects?",
      "Describe how you present your design work to a non-design audience.",
      "How do you handle last-minute scope changes from a client?",
      "What is your approach to design critique — both giving and receiving feedback?",
    ],
    "Technical Skills": [
      "Walk me through how you would create a scalable logo using vector tools in Illustrator.",
      "How do you use Figma's component and variant system in a design project?",
      "Describe your Photoshop workflow for photo retouching and composition.",
      "How would you create a 15-second animated intro in After Effects? Walk through the steps.",
      "What is your approach to preparing files for print (CMYK, bleed, resolution)?",
      "How do you ensure your designs are accessible (color contrast, text size, alt tags)?",
      "What is the difference between SVG and PNG? When would you use each?",
      "How do you export and hand off designs to a developer using Figma or Zeplin?",
      "Describe how you use grids and guides in InDesign for a magazine layout.",
      "How do you approach responsive design — ensuring your UI works across screen sizes?",
    ],
    "Portfolio & Presentation": [
      "Walk me through your portfolio. Which project are you most proud of and why?",
      "Why did you make a specific design decision in your featured project? What alternatives did you consider?",
      "How do you curate your portfolio — what work do you include and what do you leave out?",
      "How do you present your work to a client who has limited design knowledge?",
      "Describe a project in your portfolio that did not go as planned. What did you learn?",
      "How do you demonstrate your design process — not just the final output?",
      "What feedback have you received about your work that has helped you improve the most?",
      "How do you update and maintain your portfolio over time?",
      "If a client dislikes your concept entirely, how do you respond and what do you do next?",
      "How do you communicate the business impact of your design work, not just the aesthetics?",
    ],
  },
};

const STREAM_TAB_ICONS: Record<string, Record<string, string>> = {
  cse: {
    "HR Questions": "👤",
    "Technical Questions": "⚙️",
    "Coding Questions": "💻",
    "System Design": "🏗️",
  },
  mechanical: {
    "HR & Soft Skills": "👤",
    "Core Mechanical": "⚙️",
    "Technical Interview": "🔧",
    "Situational Questions": "🎭",
  },
  electrical: {
    "HR & Soft Skills": "👤",
    "Core Electrical": "⚡",
    "Technical Interview": "🔌",
    "Situational Questions": "🎭",
  },
  civil: {
    "HR & Soft Skills": "👤",
    "Core Civil": "🏗️",
    "Technical Interview": "🔨",
    "Situational Questions": "🎭",
  },
  mba: {
    "HR & Behavioral": "👤",
    "Case Study Questions": "💼",
    "Business Knowledge": "📊",
    "Leadership & Situational": "🎯",
  },
  medical: {
    "HR & Soft Skills": "👤",
    "Clinical Knowledge": "🫘",
    "Healthcare Scenarios": "🏥",
    "Research & Management": "🔬",
  },
  commerce: {
    "HR & Behavioral": "👤",
    "Accounting & Finance": "📊",
    "Technical Finance": "💰",
    "Situational Questions": "🎭",
  },
  arts: {
    "HR & Behavioral": "👤",
    "Design & Creativity": "🎨",
    "Technical Skills": "💻",
    "Portfolio & Presentation": "🖼️",
  },
};

export default function InterviewPrep() {
  const userStream = getUserStream();
  const streamDef = getStreamById(userStream);

  // Use stream-specific bank, fallback to cse
  const questionBank =
    STREAM_INTERVIEW_BANKS[userStream] ?? STREAM_INTERVIEW_BANKS.cse;
  const tabIcons = STREAM_TAB_ICONS[userStream] ?? STREAM_TAB_ICONS.cse;
  const TABS = Object.keys(questionBank);

  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [randomQuestion, setRandomQuestion] = useState<string | null>(null);

  const questions = questionBank[activeTab] ?? [];

  const generateRandom = () => {
    const pool = questionBank[activeTab] ?? [];
    const q = pool[Math.floor(Math.random() * pool.length)];
    setRandomQuestion(q);
    const el = document.getElementById("random-question-card");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <AppShell title="Interview Prep" subtitle="Prepare for your dream job">
      <div className="max-w-4xl mx-auto" data-ocid="interview_prep.page">
        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Interview Preparation Hub
            </h1>
            <p className="text-white/40 text-sm">
              {streamDef.label} interview questions — HR, Technical &amp;
              Situational
            </p>
          </div>
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-full border flex-shrink-0"
            style={{
              color: streamDef.color,
              background: `${streamDef.color}15`,
              borderColor: `${streamDef.color}35`,
            }}
            data-ocid="interview_prep.stream.badge"
          >
            {streamDef.label}
          </span>
        </div>

        {/* Tabs */}
        <div
          className="flex flex-wrap gap-2 mb-6"
          data-ocid="interview_prep.filter.tab"
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setRandomQuestion(null);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === tab
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
              data-ocid={`interview_prep.${tab
                .toLowerCase()
                .replace(/ /g, "_")}.tab`}
            >
              <span>{tabIcons[tab] ?? "💬"}</span> {tab}
            </button>
          ))}
        </div>

        {/* Random Question Generator */}
        <div className="mb-6 flex items-center gap-4">
          <button
            type="button"
            onClick={generateRandom}
            className="btn-primary flex items-center gap-2"
            data-ocid="interview_prep.random.button"
          >
            <Shuffle size={16} /> 🎢 Generate Random Question
          </button>
          <span className="text-white/30 text-sm">
            {questions.length} questions in this section
          </span>
        </div>

        {/* Random Question Highlight */}
        {randomQuestion && (
          <div
            id="random-question-card"
            className="mb-6 p-5 rounded-2xl border-2 animate-fade-in-up"
            style={{
              background:
                "linear-gradient(135deg, rgba(124,92,255,0.2), rgba(53,208,199,0.1))",
              borderColor: "rgba(124,92,255,0.5)",
            }}
            data-ocid="interview_prep.random.card"
          >
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={16} className="text-purple-400" />
              <span className="text-purple-300 text-xs font-semibold uppercase tracking-wider">
                Random Question
              </span>
            </div>
            <p className="text-white font-semibold text-lg leading-relaxed">
              {randomQuestion}
            </p>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-3" data-ocid="interview_prep.list">
          {questions.map((q, i) => (
            <div
              key={q}
              className="glass-card p-4 flex gap-4 items-start animate-fade-in-up glass-card-hover"
              style={{ animationDelay: `${i * 0.04}s` }}
              data-ocid={`interview_prep.item.${i + 1}`}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5"
                style={{
                  background: `${streamDef.color}20`,
                  color: streamDef.color,
                }}
              >
                {i + 1}
              </div>
              <p className="text-white/85 text-sm leading-relaxed">{q}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
