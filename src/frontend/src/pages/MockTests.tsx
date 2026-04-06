import {
  CheckCircle2,
  ClipboardCheck,
  RotateCcw,
  Timer,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AppShell from "../components/AppShell";
import { getUserKey, getUserStream } from "../utils/auth";
import { getStreamById } from "../utils/streamData";

interface Question {
  q: string;
  options: string[];
  answer: number;
}

// ============================================================
// Shared Aptitude Questions (used by all streams)
// ============================================================
const APTITUDE_QUESTIONS: Question[] = [
  {
    q: "If 20% of a number is 50, what is the number?",
    options: ["200", "250", "300", "150"],
    answer: 1,
  },
  {
    q: "A train travels 60 km in 45 minutes. What is its speed in km/h?",
    options: ["80", "75", "90", "70"],
    answer: 0,
  },
  {
    q: "What is the next number in the series: 2, 6, 12, 20, ?",
    options: ["28", "30", "32", "36"],
    answer: 1,
  },
  {
    q: "A can do a work in 10 days, B in 15 days. How many days to finish together?",
    options: ["5", "6", "7", "8"],
    answer: 1,
  },
  {
    q: "If 5 workers can build a wall in 12 days, 3 workers take:",
    options: ["15 days", "18 days", "20 days", "22 days"],
    answer: 2,
  },
  {
    q: "What is 15% of 240?",
    options: ["36", "34", "40", "32"],
    answer: 0,
  },
  {
    q: "Find the odd one out: 2, 3, 5, 7, 9, 11",
    options: ["9", "2", "11", "3"],
    answer: 0,
  },
  {
    q: "A shopkeeper sells an item at 20% profit. If cost is ₹500, selling price is:",
    options: ["₹550", "₹580", "₹600", "₹620"],
    answer: 2,
  },
  {
    q: "If BOOK is coded as 2-15-15-11, how is DOOR coded?",
    options: ["4-14-14-17", "4-15-15-18", "3-15-15-18", "4-15-14-17"],
    answer: 1,
  },
  {
    q: "Simple interest on ₹2000 for 3 years at 5% per annum is:",
    options: ["₹200", "₹250", "₹300", "₹350"],
    answer: 2,
  },
];

// ============================================================
// Stream-specific Question Banks
// ============================================================
const STREAM_QUESTION_BANKS: Record<string, Record<string, Question[]>> = {
  cse: {
    Aptitude: APTITUDE_QUESTIONS,
    Programming: [
      {
        q: "What is the output of: print(type(5/2)) in Python 3?",
        options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "Error"],
        answer: 1,
      },
      {
        q: "Which of these is a mutable data type in Python?",
        options: ["tuple", "string", "list", "int"],
        answer: 2,
      },
      {
        q: "What does 'typeof null' return in JavaScript?",
        options: ["'null'", "'undefined'", "'object'", "'boolean'"],
        answer: 2,
      },
      {
        q: "Which Python keyword is used to define a function?",
        options: ["func", "define", "def", "function"],
        answer: 2,
      },
      {
        q: "What is the output of: [1,2,3].length in JavaScript?",
        options: ["3", "2", "undefined", "Error"],
        answer: 0,
      },
      {
        q: "Which loop is guaranteed to execute at least once?",
        options: ["for", "while", "do-while", "foreach"],
        answer: 2,
      },
      {
        q: "What is the correct way to declare a constant in JavaScript?",
        options: ["var", "let", "const", "fixed"],
        answer: 2,
      },
      {
        q: "In Python, what does len([1,2,3,4]) return?",
        options: ["3", "4", "5", "Error"],
        answer: 1,
      },
      {
        q: "Which of these is NOT a Python data type?",
        options: ["dict", "set", "array", "tuple"],
        answer: 2,
      },
      {
        q: "What does === mean in JavaScript?",
        options: [
          "Assignment",
          "Equal value only",
          "Equal value and type",
          "Not equal",
        ],
        answer: 2,
      },
    ],
    "Web Development": [
      {
        q: "Which HTML tag is used for the largest heading?",
        options: ["<h6>", "<head>", "<h1>", "<header>"],
        answer: 2,
      },
      {
        q: "What does CSS stand for?",
        options: [
          "Computer Style Sheet",
          "Creative Style System",
          "Cascading Style Sheets",
          "Colorful Style Sheets",
        ],
        answer: 2,
      },
      {
        q: "Which CSS property controls text size?",
        options: ["text-style", "font-size", "text-size", "font-style"],
        answer: 1,
      },
      {
        q: "What is the correct HTML for adding a background color?",
        options: [
          "<body bg='yellow'>",
          "<body style='background-color:yellow'>",
          "<background>yellow</background>",
          "<body color='yellow'>",
        ],
        answer: 1,
      },
      {
        q: "Which JavaScript method is used to find an HTML element by id?",
        options: [
          "getElementById()",
          "getElement()",
          "findElementById()",
          "queryById()",
        ],
        answer: 0,
      },
      {
        q: "What does 'flex' in CSS refer to?",
        options: [
          "Font flexibility",
          "Flexbox layout model",
          "Flexible images",
          "Float extension",
        ],
        answer: 1,
      },
      {
        q: "Which HTML5 tag is used to play video?",
        options: ["<media>", "<movie>", "<video>", "<play>"],
        answer: 2,
      },
      {
        q: "What is the default display value of a <div> element?",
        options: ["inline", "block", "flex", "inline-block"],
        answer: 1,
      },
      {
        q: "Which HTTP method is used to send data to a server?",
        options: ["GET", "POST", "FETCH", "SEND"],
        answer: 1,
      },
      {
        q: "What does JSON stand for?",
        options: [
          "JavaScript Object Note",
          "Java Standard Object Notation",
          "JavaScript Object Notation",
          "Java Script Open Notation",
        ],
        answer: 2,
      },
    ],
    DSA: [
      {
        q: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        answer: 1,
      },
      {
        q: "Which data structure uses LIFO principle?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        answer: 1,
      },
      {
        q: "What is the worst-case time complexity of QuickSort?",
        options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
        answer: 2,
      },
      {
        q: "Which data structure is best for implementing breadth-first search?",
        options: ["Stack", "Queue", "Heap", "Graph"],
        answer: 1,
      },
      {
        q: "What is the space complexity of merge sort?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        answer: 2,
      },
      {
        q: "In a singly linked list, what does each node contain?",
        options: [
          "Data only",
          "Data and pointer to next",
          "Data and two pointers",
          "Only pointers",
        ],
        answer: 1,
      },
      {
        q: "Which sorting algorithm has the best average-case performance?",
        options: [
          "Bubble Sort",
          "Selection Sort",
          "Merge Sort",
          "Insertion Sort",
        ],
        answer: 2,
      },
      {
        q: "Time complexity to access an element in an array by index?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
        answer: 2,
      },
      {
        q: "A binary tree with n nodes has how many null pointers?",
        options: ["n", "n+1", "2n", "n-1"],
        answer: 1,
      },
      {
        q: "Which algorithm finds the shortest path in an unweighted graph?",
        options: ["DFS", "BFS", "Dijkstra", "Bellman-Ford"],
        answer: 1,
      },
    ],
  },

  mechanical: {
    Aptitude: APTITUDE_QUESTIONS,
    "Engineering Mechanics": [
      {
        q: "A force of 100N acts at 30° to the horizontal. Its horizontal component is:",
        options: ["50N", "86.6N", "100N", "70N"],
        answer: 1,
      },
      {
        q: "Newton's Second Law of Motion states that F =",
        options: ["m/a", "m×a", "m+a", "m-a"],
        answer: 1,
      },
      {
        q: "The coefficient of friction is defined as the ratio of:",
        options: [
          "Normal force to friction force",
          "Friction force to normal force",
          "Applied force to normal force",
          "Weight to friction force",
        ],
        answer: 1,
      },
      {
        q: "Moment of a force about a point is:",
        options: [
          "Force × distance",
          "Force / distance",
          "Force + distance",
          "Force - distance",
        ],
        answer: 0,
      },
      {
        q: "The center of gravity of a uniform rod lies at:",
        options: [
          "One-third of its length",
          "One-fourth of its length",
          "Midpoint",
          "Two-thirds of its length",
        ],
        answer: 2,
      },
      {
        q: "A projectile is launched horizontally. Its horizontal velocity:",
        options: [
          "Increases continuously",
          "Decreases continuously",
          "Remains constant",
          "Becomes zero at maximum height",
        ],
        answer: 2,
      },
      {
        q: "Work-Energy theorem states that the net work done on a body equals:",
        options: [
          "Change in potential energy",
          "Change in kinetic energy",
          "Total mechanical energy",
          "Change in momentum",
        ],
        answer: 1,
      },
      {
        q: "Impulse is defined as:",
        options: [
          "Force × distance",
          "Force × time",
          "Mass × velocity",
          "Mass × acceleration",
        ],
        answer: 1,
      },
      {
        q: "In simple harmonic motion, the restoring force is:",
        options: [
          "Proportional to displacement",
          "Constant",
          "Zero at maximum displacement",
          "Proportional to velocity",
        ],
        answer: 0,
      },
      {
        q: "The velocity ratio of a simple gear system with driver gear having 20 teeth and driven gear having 40 teeth is:",
        options: ["0.5", "2", "1", "4"],
        answer: 0,
      },
    ],
    Thermodynamics: [
      {
        q: "The First Law of Thermodynamics is based on the conservation of:",
        options: ["Mass", "Energy", "Momentum", "Temperature"],
        answer: 1,
      },
      {
        q: "The Second Law of Thermodynamics states that:",
        options: [
          "Energy cannot be created or destroyed",
          "Heat flows from hot to cold bodies naturally",
          "All processes are reversible",
          "Entropy always decreases",
        ],
        answer: 1,
      },
      {
        q: "The efficiency of a Carnot engine operating between 600K and 300K is:",
        options: ["25%", "50%", "75%", "100%"],
        answer: 1,
      },
      {
        q: "Enthalpy (H) is defined as:",
        options: ["H = U - PV", "H = U + PV", "H = PV", "H = U/PV"],
        answer: 1,
      },
      {
        q: "Entropy in a reversible process:",
        options: [
          "Always increases",
          "Always decreases",
          "Remains constant",
          "Becomes zero",
        ],
        answer: 2,
      },
      {
        q: "For an ideal gas, the product PV at constant temperature is:",
        options: ["Variable", "Constant", "Zero", "Infinite"],
        answer: 1,
      },
      {
        q: "The three modes of heat transfer are:",
        options: [
          "Conduction, Convection, Radiation",
          "Conduction, Diffusion, Radiation",
          "Convection, Diffusion, Absorption",
          "Radiation, Reflection, Absorption",
        ],
        answer: 0,
      },
      {
        q: "In the Rankine cycle (steam power cycle), which process increases pressure?",
        options: ["Turbine expansion", "Condenser", "Pump", "Boiler"],
        answer: 2,
      },
      {
        q: "COP (Coefficient of Performance) of a refrigerator is:",
        options: [
          "Work input / Heat extracted",
          "Heat extracted / Work input",
          "Heat rejected / Work input",
          "Work input / Heat rejected",
        ],
        answer: 1,
      },
      {
        q: "Specific heat at constant pressure (Cp) is always ______ specific heat at constant volume (Cv):",
        options: ["Less than", "Equal to", "Greater than", "Half of"],
        answer: 2,
      },
    ],
    Manufacturing: [
      {
        q: "In sand casting, the pattern is used to:",
        options: [
          "Melt the metal",
          "Create the mold cavity",
          "Finish the surface",
          "Control cooling rate",
        ],
        answer: 1,
      },
      {
        q: "Forging is a manufacturing process that involves:",
        options: [
          "Melting and pouring metal",
          "Compressive deformation of metal",
          "Removing material by cutting",
          "Joining two metals",
        ],
        answer: 1,
      },
      {
        q: "Which type of welding uses electric arc to melt and join metals?",
        options: [
          "TIG welding",
          "MIG welding",
          "SMAW (Stick welding)",
          "All of the above",
        ],
        answer: 3,
      },
      {
        q: "CNC stands for:",
        options: [
          "Computer Numeric Control",
          "Controlled Numeric Computing",
          "Computer Network Control",
          "Central Numeric Controller",
        ],
        answer: 0,
      },
      {
        q: "In a lathe operation, the workpiece rotates while the cutting tool:",
        options: [
          "Rotates in same direction",
          "Remains stationary",
          "Moves linearly",
          "Rotates in opposite direction",
        ],
        answer: 2,
      },
      {
        q: "Tolerance in manufacturing refers to:",
        options: [
          "The maximum allowable variation in dimension",
          "The exact dimension required",
          "The surface finish quality",
          "The material hardness",
        ],
        answer: 0,
      },
      {
        q: "Surface roughness Ra represents:",
        options: [
          "Maximum peak-to-valley height",
          "Arithmetic mean deviation of the surface profile",
          "Root mean square roughness",
          "Maximum roughness depth",
        ],
        answer: 1,
      },
      {
        q: "Press working operations include:",
        options: [
          "Blanking and piercing",
          "Forging only",
          "Casting only",
          "Welding only",
        ],
        answer: 0,
      },
      {
        q: "Powder metallurgy is used to make parts that are:",
        options: [
          "Large and heavy",
          "Small with complex shapes or special materials",
          "Only made of aluminium",
          "Easily machinable",
        ],
        answer: 1,
      },
      {
        q: "NDT (Non-Destructive Testing) methods include:",
        options: [
          "Tensile testing",
          "Ultrasonic testing",
          "Bend testing",
          "Hardness testing",
        ],
        answer: 1,
      },
    ],
  },

  electrical: {
    Aptitude: APTITUDE_QUESTIONS,
    "Circuit Theory": [
      {
        q: "Ohm's Law states that V = IR. If R doubles and I stays the same, V will:",
        options: ["Halve", "Stay the same", "Double", "Quadruple"],
        answer: 2,
      },
      {
        q: "Kirchhoff's Voltage Law (KVL) states that:",
        options: [
          "Sum of currents at a node equals zero",
          "Sum of voltages in a closed loop equals zero",
          "Power is conserved in a circuit",
          "Voltage is the same across all components",
        ],
        answer: 1,
      },
      {
        q: "Thevenin's theorem replaces a complex circuit with:",
        options: [
          "A current source and parallel resistance",
          "A voltage source and series resistance",
          "Two voltage sources",
          "A single resistor",
        ],
        answer: 1,
      },
      {
        q: "Norton's theorem replaces a complex circuit with:",
        options: [
          "A voltage source and series resistance",
          "A current source and parallel resistance",
          "Two current sources",
          "A single capacitor",
        ],
        answer: 1,
      },
      {
        q: "Power factor is defined as the cosine of the angle between:",
        options: [
          "Voltage and current",
          "Resistance and reactance",
          "Impedance and resistance",
          "Voltage and impedance",
        ],
        answer: 0,
      },
      {
        q: "Impedance in an AC circuit is:",
        options: [
          "Resistance only",
          "Reactance only",
          "Combination of resistance and reactance",
          "Reciprocal of conductance",
        ],
        answer: 2,
      },
      {
        q: "At resonance in a series RLC circuit:",
        options: [
          "Impedance is maximum",
          "Current is minimum",
          "Impedance equals resistance (minimum)",
          "Voltage across R is zero",
        ],
        answer: 2,
      },
      {
        q: "The time constant of an RC circuit is:",
        options: ["R/C", "R+C", "R×C", "C/R"],
        answer: 2,
      },
      {
        q: "A transformer with 100 primary turns and 50 secondary turns has a turns ratio of:",
        options: ["2:1 (step-down)", "1:2 (step-up)", "1:1", "4:1"],
        answer: 0,
      },
      {
        q: "Superposition theorem is applicable to:",
        options: [
          "Non-linear circuits only",
          "Linear circuits only",
          "Both linear and non-linear",
          "Only DC circuits",
        ],
        answer: 1,
      },
    ],
    "Digital Electronics": [
      {
        q: "The output of an AND gate is HIGH only when:",
        options: [
          "Any input is HIGH",
          "All inputs are HIGH",
          "Any input is LOW",
          "All inputs are LOW",
        ],
        answer: 1,
      },
      {
        q: "De Morgan's theorem states that NOT(A AND B) =",
        options: [
          "NOT A AND NOT B",
          "NOT A OR NOT B",
          "A OR B",
          "NOT A XOR NOT B",
        ],
        answer: 1,
      },
      {
        q: "A D flip-flop stores:",
        options: ["2 bits", "4 bits", "1 bit", "8 bits"],
        answer: 2,
      },
      {
        q: "A 4-bit binary counter can count up to:",
        options: ["8", "15", "16", "31"],
        answer: 1,
      },
      {
        q: "A multiplexer (MUX) is a device that:",
        options: [
          "Converts digital to analog",
          "Selects one of many inputs and routes to a single output",
          "Converts analog to digital",
          "Amplifies digital signals",
        ],
        answer: 1,
      },
      {
        q: "ADC (Analog-to-Digital Converter) resolution of 8 bits gives how many levels?",
        options: ["128", "256", "512", "1024"],
        answer: 1,
      },
      {
        q: "An Intel 8085 microprocessor has a data bus width of:",
        options: ["4 bits", "8 bits", "16 bits", "32 bits"],
        answer: 1,
      },
      {
        q: "RAM is considered:",
        options: [
          "Non-volatile memory",
          "Read-only memory",
          "Volatile memory",
          "Secondary memory",
        ],
        answer: 2,
      },
      {
        q: "The decimal equivalent of binary 1011 is:",
        options: ["9", "10", "11", "12"],
        answer: 2,
      },
      {
        q: "The hexadecimal equivalent of decimal 255 is:",
        options: ["EF", "FE", "FF", "F0"],
        answer: 2,
      },
    ],
    "Power Systems": [
      {
        q: "A synchronous generator is used to convert:",
        options: [
          "Electrical energy to mechanical energy",
          "Mechanical energy to electrical energy",
          "DC to AC",
          "AC to DC",
        ],
        answer: 1,
      },
      {
        q: "In transmission lines, the purpose of bundled conductors is to:",
        options: [
          "Increase resistance",
          "Reduce corona effect and inductance",
          "Increase capacitance",
          "Improve aesthetics",
        ],
        answer: 1,
      },
      {
        q: "A distance relay in power systems operates based on:",
        options: [
          "Overcurrent only",
          "Impedance of the line",
          "Overvoltage",
          "Frequency deviation",
        ],
        answer: 1,
      },
      {
        q: "Load flow analysis in power systems is used to find:",
        options: [
          "Fault current",
          "Voltage and power flow in steady state",
          "Transient stability",
          "Motor starting conditions",
        ],
        answer: 1,
      },
      {
        q: "In the per-unit system, the per-unit impedance of a transformer:",
        options: [
          "Changes with the base chosen",
          "Is the same referred to either side",
          "Is always 1 pu",
          "Depends on frequency",
        ],
        answer: 1,
      },
      {
        q: "A three-phase symmetrical fault is:",
        options: [
          "The most common fault type",
          "The most severe and least common fault",
          "A single line to ground fault",
          "A double line fault",
        ],
        answer: 1,
      },
      {
        q: "HVDC transmission is preferred over HVAC for:",
        options: [
          "Short distances only",
          "Very long distances and submarine cables",
          "Urban distribution",
          "Low voltage applications",
        ],
        answer: 1,
      },
      {
        q: "Reactive power (VAR) is associated with:",
        options: [
          "Resistive loads",
          "Inductive and capacitive loads",
          "DC circuits only",
          "Resistive and capacitive loads",
        ],
        answer: 1,
      },
      {
        q: "The purpose of earthing in electrical systems is to:",
        options: [
          "Increase system voltage",
          "Provide a safe path for fault currents",
          "Reduce power consumption",
          "Improve power factor",
        ],
        answer: 1,
      },
      {
        q: "Total Harmonic Distortion (THD) is a measure of:",
        options: [
          "Power quality",
          "Voltage level",
          "Current magnitude",
          "Frequency deviation",
        ],
        answer: 0,
      },
    ],
  },

  civil: {
    Aptitude: APTITUDE_QUESTIONS,
    "Structural Engineering": [
      {
        q: "Bending moment at a fixed end of a cantilever beam with point load W at free end is:",
        options: ["WL", "WL/2", "WL/4", "2WL"],
        answer: 0,
      },
      {
        q: "A simply supported beam has maximum bending moment at:",
        options: [
          "Supports",
          "Midspan (for UDL)",
          "Quarter span",
          "Three-quarter span",
        ],
        answer: 1,
      },
      {
        q: "A determinate beam has:",
        options: [
          "More members than required",
          "Exactly the right number of members for equilibrium",
          "Fewer members than required",
          "No supports",
        ],
        answer: 1,
      },
      {
        q: "The deflection of a simply supported beam with central point load W is (EI = flexural rigidity):",
        options: ["WL³/48EI", "WL³/4EI", "WL³/8EI", "WL³/16EI"],
        answer: 0,
      },
      {
        q: "Euler's formula for column buckling load Pcr =",
        options: ["πEI/L²", "π²EI/L²", "2πEI/L²", "πEI/2L²"],
        answer: 1,
      },
      {
        q: "A pin-jointed structure in which members carry only axial loads is called:",
        options: ["Frame", "Beam", "Truss", "Arch"],
        answer: 2,
      },
      {
        q: "Young's modulus of steel is approximately:",
        options: ["70 GPa", "200 GPa", "500 GPa", "100 GPa"],
        answer: 1,
      },
      {
        q: "IS 456 is the Indian standard code for:",
        options: [
          "Steel structures",
          "Plain and reinforced concrete",
          "Prestressed concrete",
          "Timber structures",
        ],
        answer: 1,
      },
      {
        q: "The cover to reinforcement in RCC structures is provided to:",
        options: [
          "Improve aesthetics",
          "Protect steel from corrosion and fire",
          "Reduce concrete quantity",
          "Increase beam depth",
        ],
        answer: 1,
      },
      {
        q: "Shear force at a section is defined as the algebraic sum of all forces:",
        options: [
          "To the right of the section",
          "To the left or right of the section",
          "At the supports only",
          "At midspan",
        ],
        answer: 1,
      },
    ],
    "Geotechnical Engineering": [
      {
        q: "According to USCS, a soil with more than 50% passing through 75 micron sieve is classified as:",
        options: ["Gravel", "Sand", "Fine-grained soil", "Coarse-grained soil"],
        answer: 2,
      },
      {
        q: "Atterberg limits are used to classify:",
        options: [
          "Coarse-grained soils",
          "Fine-grained (cohesive) soils",
          "Gravel",
          "Rock",
        ],
        answer: 1,
      },
      {
        q: "Standard Proctor compaction test uses a hammer of:",
        options: [
          "5.5 lb dropped from 12 inches",
          "10 lb dropped from 18 inches",
          "5.5 lb dropped from 18 inches",
          "10 lb dropped from 12 inches",
        ],
        answer: 0,
      },
      {
        q: "Consolidation settlement in clay is primarily due to:",
        options: [
          "Immediate elastic compression",
          "Drainage of pore water from voids",
          "Shear failure",
          "Heaving of soil",
        ],
        answer: 1,
      },
      {
        q: "Terzaghi's bearing capacity equation accounts for:",
        options: [
          "Shear failure only",
          "Cohesion, surcharge, and depth of foundation",
          "Settlement only",
          "Liquefaction potential",
        ],
        answer: 1,
      },
      {
        q: "A pile foundation transfers load to deeper layers through:",
        options: [
          "End bearing only",
          "Skin friction only",
          "Both end bearing and skin friction",
          "Neither",
        ],
        answer: 2,
      },
      {
        q: "A retaining wall retains:",
        options: [
          "Water only",
          "Earth or backfill material",
          "Air pressure",
          "Foundation loads",
        ],
        answer: 1,
      },
      {
        q: "Seepage velocity in soil is given by Darcy's law as:",
        options: ["v = k/i", "v = k×i", "v = i/k", "v = k+i"],
        answer: 1,
      },
      {
        q: "Effective stress in soil is:",
        options: [
          "Total stress minus pore water pressure",
          "Total stress plus pore water pressure",
          "Pore water pressure only",
          "Total stress only",
        ],
        answer: 0,
      },
      {
        q: "Standard Penetration Test (SPT) measures:",
        options: [
          "Soil permeability",
          "Number of blows to drive a split-spoon sampler 300mm",
          "Shear strength directly",
          "Consolidation rate",
        ],
        answer: 1,
      },
    ],
    "Fluid Mechanics": [
      {
        q: "Bernoulli's equation is valid for:",
        options: [
          "Viscous, compressible flow",
          "Inviscid, incompressible, steady flow along a streamline",
          "All types of flow",
          "Turbulent flow only",
        ],
        answer: 1,
      },
      {
        q: "Laminar flow in a pipe occurs when Reynolds number is:",
        options: [
          "Greater than 4000",
          "Between 2000 and 4000",
          "Less than 2000",
          "Equal to 1",
        ],
        answer: 2,
      },
      {
        q: "Reynolds number represents the ratio of:",
        options: [
          "Viscous forces to inertial forces",
          "Inertial forces to viscous forces",
          "Pressure forces to gravity forces",
          "Surface tension to viscous forces",
        ],
        answer: 1,
      },
      {
        q: "In pipe flow, the Darcy-Weisbach equation calculates:",
        options: [
          "Velocity",
          "Head loss due to friction",
          "Flow rate",
          "Pressure at a point",
        ],
        answer: 1,
      },
      {
        q: "The hydraulic gradient in a pipe is defined as:",
        options: [
          "Flow velocity / pipe diameter",
          "Head loss per unit length of pipe",
          "Pressure / flow rate",
          "Friction factor × velocity",
        ],
        answer: 1,
      },
      {
        q: "A centrifugal pump is suitable for:",
        options: [
          "High pressure, low flow",
          "Low pressure, high flow",
          "Very viscous fluids",
          "Reciprocating motion",
        ],
        answer: 1,
      },
      {
        q: "Darcy's law for flow through porous media relates flow to:",
        options: [
          "Viscosity only",
          "Hydraulic gradient and permeability",
          "Velocity and pressure",
          "Turbulence",
        ],
        answer: 1,
      },
      {
        q: "In open channel flow, critical flow occurs when Froude number equals:",
        options: ["0", "0.5", "1", "2"],
        answer: 2,
      },
      {
        q: "A sharp-crested rectangular weir measures flow based on:",
        options: [
          "Pressure difference",
          "Head of water over the weir",
          "Pipe diameter",
          "Velocity at the weir",
        ],
        answer: 1,
      },
      {
        q: "A venturimeter is used to measure:",
        options: [
          "Pressure only",
          "Temperature",
          "Flow rate in a pipe",
          "Viscosity",
        ],
        answer: 2,
      },
    ],
  },

  mba: {
    Aptitude: APTITUDE_QUESTIONS,
    "Business Fundamentals": [
      {
        q: "SWOT analysis stands for:",
        options: [
          "Strength, Weakness, Opportunity, Threat",
          "Sales, Work, Operations, Technology",
          "Strategy, Workforce, Output, Target",
          "System, Workflow, Objective, Timeline",
        ],
        answer: 0,
      },
      {
        q: "Porter's Five Forces model analyzes:",
        options: [
          "Internal company capabilities",
          "Industry competitive intensity",
          "Marketing effectiveness",
          "Financial performance",
        ],
        answer: 1,
      },
      {
        q: "In the BCG matrix, a 'Star' represents:",
        options: [
          "Low growth, high market share",
          "High growth, high market share",
          "High growth, low market share",
          "Low growth, low market share",
        ],
        answer: 1,
      },
      {
        q: "Break-even point is when:",
        options: [
          "Revenue equals fixed costs",
          "Total revenue equals total costs",
          "Profit is maximized",
          "Variable costs equal zero",
        ],
        answer: 1,
      },
      {
        q: "Market segmentation divides customers based on:",
        options: [
          "Only geography",
          "Demographics, geography, behavior, psychographics",
          "Only age",
          "Only income",
        ],
        answer: 1,
      },
      {
        q: "The Product Life Cycle stages are:",
        options: [
          "Introduction, Development, Maturity, Decline",
          "Launch, Growth, Saturation, Obsolescence",
          "Introduction, Growth, Maturity, Decline",
          "Research, Launch, Growth, End",
        ],
        answer: 2,
      },
      {
        q: "A flat organizational structure has:",
        options: [
          "Many levels of management",
          "Few levels of management, wider span of control",
          "Centralized decision making",
          "Only functional departments",
        ],
        answer: 1,
      },
      {
        q: "Transformational leadership focuses on:",
        options: [
          "Completing specific tasks",
          "Inspiring and motivating followers toward vision",
          "Maintaining status quo",
          "Strict rule enforcement",
        ],
        answer: 1,
      },
      {
        q: "Supply chain management encompasses:",
        options: [
          "Only manufacturing",
          "Flow of goods, information, finances from supplier to customer",
          "Only logistics",
          "Only procurement",
        ],
        answer: 1,
      },
      {
        q: "CRM (Customer Relationship Management) is primarily about:",
        options: [
          "Managing supplier relationships",
          "Building and maintaining customer relationships",
          "Internal employee relations",
          "Financial management",
        ],
        answer: 1,
      },
    ],
    Marketing: [
      {
        q: "The 4Ps of the Marketing Mix are:",
        options: [
          "People, Process, Place, Promotion",
          "Product, Price, Place, Promotion",
          "Product, Profit, Place, Publicity",
          "Price, People, Positioning, Promotion",
        ],
        answer: 1,
      },
      {
        q: "Primary market research involves:",
        options: [
          "Using existing published data",
          "Collecting original data first-hand",
          "Analyzing competitors' reports",
          "Reading industry journals",
        ],
        answer: 1,
      },
      {
        q: "In consumer behavior, the buying decision process ends with:",
        options: [
          "Information search",
          "Evaluation of alternatives",
          "Post-purchase evaluation",
          "Purchase decision",
        ],
        answer: 2,
      },
      {
        q: "Brand equity refers to:",
        options: [
          "Financial value of assets",
          "The value premium a brand commands over a generic product",
          "Total sales revenue",
          "Marketing budget",
        ],
        answer: 1,
      },
      {
        q: "In distribution channels, an 'intensive distribution' strategy means:",
        options: [
          "Selling through select outlets only",
          "Selling through as many outlets as possible",
          "Selling only through one outlet",
          "Direct selling only",
        ],
        answer: 1,
      },
      {
        q: "Penetration pricing strategy sets initial price:",
        options: [
          "Very high to skim profit",
          "Low to gain market share quickly",
          "Equal to competitors",
          "Based on cost-plus formula",
        ],
        answer: 1,
      },
      {
        q: "SEO (Search Engine Optimization) primarily improves:",
        options: [
          "Paid advertising results",
          "Organic search ranking",
          "Social media reach",
          "Email open rates",
        ],
        answer: 1,
      },
      {
        q: "Market share is calculated as:",
        options: [
          "Company sales / Total market sales × 100",
          "Total sales / Competitors' sales",
          "Net profit / Total revenue",
          "Gross revenue / Number of customers",
        ],
        answer: 0,
      },
      {
        q: "Product positioning refers to:",
        options: [
          "Physical placement of product in stores",
          "How a product is perceived in customers' minds relative to competitors",
          "Stage in product development",
          "Pricing of the product",
        ],
        answer: 1,
      },
      {
        q: "The sales funnel stages are:",
        options: [
          "Plan, Execute, Review",
          "Awareness, Interest, Desire, Action",
          "Research, Design, Launch, Review",
          "Find, Contact, Close, Deliver",
        ],
        answer: 1,
      },
    ],
    "Finance & Accounting": [
      {
        q: "The Profit & Loss (Income) Statement shows:",
        options: [
          "Assets and liabilities",
          "Revenue and expenses over a period",
          "Cash inflows and outflows",
          "Shareholders' equity",
        ],
        answer: 1,
      },
      {
        q: "The Balance Sheet follows the equation:",
        options: [
          "Revenue - Expenses = Profit",
          "Assets = Liabilities + Equity",
          "Cash = Receivables + Inventory",
          "Equity = Assets - Revenue",
        ],
        answer: 1,
      },
      {
        q: "Cash flow from operations in the Cash Flow Statement includes:",
        options: [
          "Only capital expenditures",
          "Cash generated from core business activities",
          "Dividend payments only",
          "Loan repayments",
        ],
        answer: 1,
      },
      {
        q: "NPV (Net Present Value) is positive when:",
        options: [
          "The project returns less than the discount rate",
          "Present value of cash inflows exceeds initial investment",
          "Costs exceed revenues",
          "IRR equals the discount rate",
        ],
        answer: 1,
      },
      {
        q: "IRR (Internal Rate of Return) is the discount rate at which NPV equals:",
        options: ["Maximum", "100", "Zero", "The initial investment"],
        answer: 2,
      },
      {
        q: "Current Ratio = Current Assets / Current Liabilities measures:",
        options: [
          "Profitability",
          "Short-term liquidity",
          "Long-term solvency",
          "Asset efficiency",
        ],
        answer: 1,
      },
      {
        q: "Working capital is defined as:",
        options: [
          "Fixed assets minus long-term liabilities",
          "Current assets minus current liabilities",
          "Total assets minus total liabilities",
          "Equity minus retained earnings",
        ],
        answer: 1,
      },
      {
        q: "Capital budgeting involves decisions about:",
        options: [
          "Day-to-day operational expenses",
          "Long-term investment in assets",
          "Short-term borrowing",
          "Employee salaries",
        ],
        answer: 1,
      },
      {
        q: "Financial leverage is the use of:",
        options: [
          "Equity financing only",
          "Debt to amplify returns on equity",
          "Operating assets",
          "Working capital",
        ],
        answer: 1,
      },
      {
        q: "WACC (Weighted Average Cost of Capital) is used to:",
        options: [
          "Measure revenue growth",
          "Evaluate the minimum return a company must earn on investments",
          "Calculate tax liability",
          "Determine market share",
        ],
        answer: 1,
      },
    ],
  },

  medical: {
    Aptitude: APTITUDE_QUESTIONS,
    "Anatomy & Physiology": [
      {
        q: "The basic structural and functional unit of the body is:",
        options: ["Tissue", "Organ", "Cell", "System"],
        answer: 2,
      },
      {
        q: "The cardiovascular system consists of:",
        options: [
          "Heart and lungs",
          "Heart, blood, and blood vessels",
          "Heart and digestive organs",
          "Only arteries and veins",
        ],
        answer: 1,
      },
      {
        q: "The primary function of the respiratory system is:",
        options: [
          "Digestion",
          "Gas exchange (O2 and CO2)",
          "Hormone production",
          "Waste filtration",
        ],
        answer: 1,
      },
      {
        q: "The digestive system breaks down food using:",
        options: [
          "Mechanical and chemical processes",
          "Only mechanical processes",
          "Only enzymes",
          "Hormones only",
        ],
        answer: 0,
      },
      {
        q: "The central nervous system consists of:",
        options: [
          "Brain and peripheral nerves",
          "Brain and spinal cord",
          "Spinal cord only",
          "All nerves in the body",
        ],
        answer: 1,
      },
      {
        q: "The pancreas is part of which system?",
        options: [
          "Cardiovascular",
          "Both endocrine and digestive systems",
          "Respiratory",
          "Urinary",
        ],
        answer: 1,
      },
      {
        q: "Antibodies are produced by:",
        options: [
          "Red blood cells",
          "B lymphocytes (B cells)",
          "Platelets",
          "Neutrophils",
        ],
        answer: 1,
      },
      {
        q: "The musculoskeletal system includes:",
        options: [
          "Muscles, bones, cartilage, and tendons",
          "Only muscles",
          "Only bones",
          "Muscles and organs",
        ],
        answer: 0,
      },
      {
        q: "Homeostasis refers to:",
        options: [
          "Disease process",
          "The body's ability to maintain a stable internal environment",
          "Immune response",
          "Cellular growth",
        ],
        answer: 1,
      },
      {
        q: "The normal human body temperature (oral) is approximately:",
        options: ["36.0°C", "37.0°C", "38.0°C", "35.5°C"],
        answer: 1,
      },
    ],
    "Clinical Knowledge": [
      {
        q: "A patient has BP 140/90 mmHg on two separate occasions. This is classified as:",
        options: [
          "Normal",
          "Pre-hypertension",
          "Stage 1 hypertension",
          "Stage 2 hypertension",
        ],
        answer: 2,
      },
      {
        q: "Which of the following is a common symptom of diabetes mellitus?",
        options: [
          "Polyuria, polydipsia, polyphagia",
          "Bradycardia and low BP",
          "Decreased urine output",
          "Low blood glucose",
        ],
        answer: 0,
      },
      {
        q: "Penicillin belongs to which class of antibiotics?",
        options: [
          "Tetracyclines",
          "Macrolides",
          "Beta-lactams",
          "Fluoroquinolones",
        ],
        answer: 2,
      },
      {
        q: "A chest X-ray is used to diagnose:",
        options: [
          "Brain tumors",
          "Cardiac and pulmonary conditions",
          "Renal stones only",
          "Joint inflammation",
        ],
        answer: 1,
      },
      {
        q: "A normal sinus rhythm on ECG has a heart rate of:",
        options: ["40-60 bpm", "60-100 bpm", "100-150 bpm", "150-200 bpm"],
        answer: 1,
      },
      {
        q: "Standard precautions in infection control include:",
        options: [
          "Hand hygiene only",
          "Hand hygiene, PPE, and safe needle disposal",
          "Mask wearing only",
          "Isolation of all patients",
        ],
        answer: 1,
      },
      {
        q: "A HEENT examination assesses:",
        options: [
          "Heart and lungs",
          "Head, eyes, ears, nose, and throat",
          "Hands and feet",
          "Abdomen only",
        ],
        answer: 1,
      },
      {
        q: "The loading dose of a drug is given to:",
        options: [
          "Reduce side effects",
          "Quickly achieve therapeutic drug levels",
          "Prolong drug action",
          "Reduce drug cost",
        ],
        answer: 1,
      },
      {
        q: "Phase III clinical trials primarily evaluate:",
        options: [
          "Drug toxicity in animals",
          "Efficacy and safety in large patient populations",
          "Drug dosage in a small group",
          "Drug mechanism",
        ],
        answer: 1,
      },
      {
        q: "Informed consent in medical practice means:",
        options: [
          "Patient agrees without information",
          "Patient gives voluntary agreement after receiving full information",
          "Doctor decides on behalf of patient",
          "Family consent only",
        ],
        answer: 1,
      },
    ],
    "Healthcare Management": [
      {
        q: "NABH stands for:",
        options: [
          "National Authority for Better Healthcare",
          "National Accreditation Board for Hospitals and Healthcare Providers",
          "National Association of Biomedical Health",
          "National Agency for Blood and Health",
        ],
        answer: 1,
      },
      {
        q: "PDCA cycle in healthcare quality improvement stands for:",
        options: [
          "Plan, Do, Check, Act",
          "Prepare, Deploy, Control, Assess",
          "Plan, Deliver, Compare, Adjust",
          "Process, Design, Control, Analyze",
        ],
        answer: 0,
      },
      {
        q: "The concept of 'Never Events' in patient safety refers to:",
        options: [
          "Rare adverse events",
          "Serious preventable events that should never occur",
          "Events that never happen in hospitals",
          "Minor medication errors",
        ],
        answer: 1,
      },
      {
        q: "HIPAA primarily protects:",
        options: [
          "Hospital profits",
          "Patient health information privacy",
          "Medical devices",
          "Insurance company data",
        ],
        answer: 1,
      },
      {
        q: "Health insurance claim processing begins with:",
        options: [
          "Payment to hospital",
          "Verification of patient eligibility",
          "Doctor's final report",
          "Discharge summary",
        ],
        answer: 1,
      },
      {
        q: "The main role of a Hospital Administrator is:",
        options: [
          "Treating patients",
          "Managing operations, finances, and staff of the hospital",
          "Performing surgeries",
          "Writing prescriptions",
        ],
        answer: 1,
      },
      {
        q: "Epidemiology studies:",
        options: [
          "Individual patient disease",
          "Distribution and determinants of disease in populations",
          "Only infectious diseases",
          "Drug development",
        ],
        answer: 1,
      },
      {
        q: "A hospital's case mix index (CMI) reflects:",
        options: [
          "Number of beds",
          "Complexity and resource intensity of patients treated",
          "Number of staff",
          "Length of stay only",
        ],
        answer: 1,
      },
      {
        q: "SOAP notes in medical documentation stand for:",
        options: [
          "Summary, Objective, Assessment, Plan",
          "Subjective, Objective, Assessment, Plan",
          "Subjective, Observation, Analysis, Prescription",
          "Status, Outcome, Action, Progress",
        ],
        answer: 1,
      },
      {
        q: "The goal of clinical governance is to:",
        options: [
          "Reduce hospital costs",
          "Ensure high standards of clinical care and continuous improvement",
          "Manage hospital finances",
          "Control staff schedules",
        ],
        answer: 1,
      },
    ],
  },

  commerce: {
    Aptitude: APTITUDE_QUESTIONS,
    Accounting: [
      {
        q: "The double-entry bookkeeping system states that:",
        options: [
          "Every transaction affects one account",
          "Every debit has a corresponding credit",
          "Assets always exceed liabilities",
          "Revenue is recorded when received",
        ],
        answer: 1,
      },
      {
        q: "A trial balance is prepared to:",
        options: [
          "Show profit or loss",
          "Verify that debits equal credits in the ledger",
          "Calculate tax liability",
          "List all assets",
        ],
        answer: 1,
      },
      {
        q: "Straight-line depreciation method calculates annual depreciation as:",
        options: [
          "(Cost - Residual Value) / Useful Life",
          "Cost / Useful Life",
          "Cost × Rate",
          "Cost - Residual Value",
        ],
        answer: 0,
      },
      {
        q: "Bank reconciliation statement is prepared to:",
        options: [
          "Calculate bank interest",
          "Reconcile differences between cash book and bank statement",
          "Record new transactions",
          "Prepare balance sheet",
        ],
        answer: 1,
      },
      {
        q: "Final accounts include:",
        options: [
          "Only profit & loss account",
          "Trading account, P&L account, and balance sheet",
          "Only balance sheet",
          "Cash flow statement only",
        ],
        answer: 1,
      },
      {
        q: "Accrual basis of accounting records transactions:",
        options: [
          "When cash is received or paid",
          "When they occur regardless of cash flow",
          "At year-end only",
          "When approved by management",
        ],
        answer: 1,
      },
      {
        q: "A provision is:",
        options: [
          "A certain liability",
          "An estimated liability for a probable future obligation",
          "An asset",
          "A revenue item",
        ],
        answer: 1,
      },
      {
        q: "Goodwill in accounting represents:",
        options: [
          "Physical assets of a business",
          "Intangible value of business reputation and relationships",
          "Current liabilities",
          "Cash at bank",
        ],
        answer: 1,
      },
      {
        q: "In a partnership, the Profit and Loss Appropriation Account distributes:",
        options: [
          "Revenue among customers",
          "Net profit/loss among partners",
          "Expenses among departments",
          "Capital among creditors",
        ],
        answer: 1,
      },
      {
        q: "AS-1 in accounting standards deals with:",
        options: [
          "Fixed assets",
          "Disclosure of accounting policies",
          "Stock valuation",
          "Depreciation",
        ],
        answer: 1,
      },
    ],
    Finance: [
      {
        q: "Time value of money states that a rupee today is worth:",
        options: [
          "Less than a rupee in the future",
          "More than a rupee in the future",
          "Equal to a rupee in the future",
          "Depends on inflation only",
        ],
        answer: 1,
      },
      {
        q: "NPV of a project should be ______ for it to be accepted:",
        options: ["Negative", "Zero", "Positive", "Equal to IRR"],
        answer: 2,
      },
      {
        q: "Optimal capital structure minimizes:",
        options: [
          "Revenue",
          "Weighted average cost of capital (WACC)",
          "Equity capital",
          "Interest payments",
        ],
        answer: 1,
      },
      {
        q: "Gordon's Dividend Growth Model values a stock based on:",
        options: [
          "Book value",
          "Expected dividends growing at a constant rate",
          "Current earnings",
          "Market capitalisation",
        ],
        answer: 1,
      },
      {
        q: "Working capital management involves managing:",
        options: [
          "Fixed assets only",
          "Current assets and current liabilities",
          "Long-term debt",
          "Capital expenditure",
        ],
        answer: 1,
      },
      {
        q: "Price-to-Earnings (P/E) ratio is calculated as:",
        options: [
          "Share Price / Book Value",
          "Market Price per Share / Earnings per Share",
          "Net Income / Revenue",
          "Dividend / Market Price",
        ],
        answer: 1,
      },
      {
        q: "A mutual fund pools money from investors and invests in:",
        options: [
          "Fixed deposits only",
          "A diversified portfolio of securities",
          "Real estate only",
          "Gold only",
        ],
        answer: 1,
      },
      {
        q: "The Bombay Stock Exchange (BSE) benchmark index is:",
        options: ["Nifty 50", "Sensex", "Dow Jones", "FTSE 100"],
        answer: 1,
      },
      {
        q: "A call option gives the holder the right to:",
        options: [
          "Sell the asset at a set price",
          "Buy the asset at a set price",
          "Both buy and sell",
          "Neither buy nor sell",
        ],
        answer: 1,
      },
      {
        q: "Modern Portfolio Theory (MPT) by Markowitz focuses on:",
        options: [
          "Maximum return only",
          "Optimizing risk-return trade-off through diversification",
          "Minimum risk only",
          "Government bonds only",
        ],
        answer: 1,
      },
    ],
    Taxation: [
      {
        q: "For Assessment Year 2024-25 (New Tax Regime), income up to ₹3 lakh is taxed at:",
        options: ["5%", "10%", "0%", "2%"],
        answer: 2,
      },
      {
        q: "TDS (Tax Deducted at Source) is deducted by:",
        options: [
          "The person receiving payment",
          "The person making payment",
          "The government directly",
          "GST council",
        ],
        answer: 1,
      },
      {
        q: "GST is a ______ tax levied on supply of goods and services:",
        options: ["Direct", "Indirect", "Corporate", "Capital gains"],
        answer: 1,
      },
      {
        q: "Long-term capital gains on equity shares (held > 1 year) exceeding ₹1 lakh are taxed at:",
        options: ["10%", "15%", "20%", "30%"],
        answer: 0,
      },
      {
        q: "Section 80C of the Income Tax Act allows deduction up to:",
        options: [
          "\u20b91 lakh",
          "\u20b91.5 lakh",
          "\u20b92 lakh",
          "\u20b950,000",
        ],
        answer: 1,
      },
      {
        q: "Advance tax is paid when annual tax liability exceeds:",
        options: ["₹1,000", "₹5,000", "₹10,000", "₹25,000"],
        answer: 2,
      },
      {
        q: "ITR-1 (Sahaj) is applicable to:",
        options: [
          "Companies",
          "Individuals with income from salary and one house property",
          "Partnership firms",
          "All taxpayers",
        ],
        answer: 1,
      },
      {
        q: "Input Tax Credit (ITC) under GST allows businesses to:",
        options: [
          "Claim refund of GST on all purchases",
          "Offset GST paid on inputs against GST collected on outputs",
          "Avoid paying GST entirely",
          "Reduce sales price",
        ],
        answer: 1,
      },
      {
        q: "Basic customs duty is levied on:",
        options: [
          "Domestic manufacturing",
          "Goods imported into India",
          "Services provided",
          "Digital transactions",
        ],
        answer: 1,
      },
      {
        q: "DTAA (Double Taxation Avoidance Agreement) is signed to:",
        options: [
          "Increase tax collection",
          "Prevent same income being taxed in two countries",
          "Avoid paying tax domestically",
          "Benefit only multinational companies",
        ],
        answer: 1,
      },
    ],
  },

  arts: {
    Aptitude: APTITUDE_QUESTIONS,
    "Design Principles": [
      {
        q: "In color theory, complementary colors are:",
        options: [
          "Colors next to each other on the color wheel",
          "Colors opposite each other on the color wheel",
          "Shades of the same color",
          "All warm colors",
        ],
        answer: 1,
      },
      {
        q: "Typography refers to:",
        options: [
          "Photography techniques",
          "The art and technique of arranging type",
          "Printing technology",
          "Color selection",
        ],
        answer: 1,
      },
      {
        q: "The rule of thirds in composition suggests placing key elements:",
        options: [
          "At the center of the frame",
          "At intersection points of a 3×3 grid",
          "At the edges",
          "In the lower third only",
        ],
        answer: 1,
      },
      {
        q: "Visual hierarchy in design guides the viewer's eye by using:",
        options: [
          "Random placement",
          "Size, color, contrast, and spacing to show importance",
          "Only text size",
          "Uniform styling",
        ],
        answer: 1,
      },
      {
        q: "Contrast in design is used to:",
        options: [
          "Make all elements look the same",
          "Create visual interest and differentiate elements",
          "Reduce readability",
          "Limit color use",
        ],
        answer: 1,
      },
      {
        q: "Gestalt principle of 'Proximity' states that:",
        options: [
          "Similar shapes are grouped together",
          "Elements close together are perceived as a group",
          "Symmetrical elements appear stable",
          "Closed shapes are perceived first",
        ],
        answer: 1,
      },
      {
        q: "A grid system in design helps with:",
        options: [
          "Adding decorative elements",
          "Consistent layout and alignment",
          "Color selection",
          "Image editing",
        ],
        answer: 1,
      },
      {
        q: "White space (negative space) in design:",
        options: [
          "Should be avoided",
          "Improves readability and focuses attention",
          "Is a design mistake",
          "Only applies to print design",
        ],
        answer: 1,
      },
      {
        q: "Design thinking is a problem-solving approach that begins with:",
        options: [
          "Prototyping",
          "Empathizing with the user",
          "Final production",
          "Testing",
        ],
        answer: 1,
      },
      {
        q: "UX (User Experience) design focuses on:",
        options: [
          "Visual aesthetics only",
          "The overall feel and usability of a product for users",
          "Coding the interface",
          "Marketing the product",
        ],
        answer: 1,
      },
    ],
    "Digital Tools": [
      {
        q: "In Photoshop, the 'Clone Stamp' tool is used to:",
        options: [
          "Add text",
          "Copy pixels from one area to another",
          "Create shapes",
          "Adjust brightness",
        ],
        answer: 1,
      },
      {
        q: "Adobe Illustrator works with ______ graphics:",
        options: ["Raster/bitmap", "Vector", "3D only", "Audio"],
        answer: 1,
      },
      {
        q: "In Figma, a 'component' allows you to:",
        options: [
          "Export files",
          "Create reusable design elements",
          "Write code",
          "Record animations",
        ],
        answer: 1,
      },
      {
        q: "Adobe After Effects is primarily used for:",
        options: [
          "Photo editing",
          "Motion graphics and video compositing",
          "Vector illustration",
          "Print layout",
        ],
        answer: 1,
      },
      {
        q: "Adobe InDesign is best suited for:",
        options: [
          "Photo retouching",
          "Page layout and publishing (magazines, books)",
          "Video editing",
          "Web development",
        ],
        answer: 1,
      },
      {
        q: "A PNG file format supports:",
        options: [
          "Only RGB colors",
          "Transparency (alpha channel)",
          "CMYK only",
          "No compression",
        ],
        answer: 1,
      },
      {
        q: "RGB color mode is used for:",
        options: [
          "Print design",
          "Screen/digital display",
          "Traditional painting",
          "Photography darkrooms",
        ],
        answer: 1,
      },
      {
        q: "The resolution of an image for print is typically:",
        options: ["72 DPI", "300 DPI", "150 DPI", "1080 DPI"],
        answer: 1,
      },
      {
        q: "When exporting a file for web, the best format for photographs is:",
        options: ["PNG", "JPEG", "SVG", "BMP"],
        answer: 1,
      },
      {
        q: "Layers in design software allow you to:",
        options: [
          "Only add text",
          "Organize and stack design elements independently",
          "Export in multiple formats",
          "Share files online",
        ],
        answer: 1,
      },
    ],
    "Creative Theory": [
      {
        q: "The Bauhaus movement in art and design emphasized:",
        options: [
          "Decoration over function",
          "The unity of art, craft, and technology",
          "Traditional painting only",
          "Abstract expressionism",
        ],
        answer: 1,
      },
      {
        q: "The exposure triangle in photography consists of:",
        options: [
          "ISO, Aperture, Shutter Speed",
          "ISO, White Balance, Focus",
          "Aperture, Zoom, Flash",
          "Shutter Speed, ISO, White Balance",
        ],
        answer: 0,
      },
      {
        q: "The '180-degree rule' in film theory is about:",
        options: [
          "Camera rotation speed",
          "Maintaining consistent screen direction in dialogue scenes",
          "Lighting angle",
          "Lens focal length",
        ],
        answer: 1,
      },
      {
        q: "Brand identity differs from brand image in that:",
        options: [
          "They are the same thing",
          "Brand identity is how the company projects itself; brand image is how it's perceived",
          "Brand image is created by the company",
          "Brand identity only includes the logo",
        ],
        answer: 1,
      },
      {
        q: "The hero's journey is a storytelling framework describing:",
        options: [
          "Documentary filmmaking",
          "A universal narrative arc of challenge, transformation, and return",
          "Linear product descriptions",
          "Social media content",
        ],
        answer: 1,
      },
      {
        q: "In advertising, an 'emotional appeal' connects with audiences through:",
        options: [
          "Facts and statistics",
          "Feelings, values, and aspirations",
          "Technical specifications",
          "Price comparisons",
        ],
        answer: 1,
      },
      {
        q: "The algorithm on social media platforms prioritizes content based on:",
        options: [
          "Age of the account",
          "Engagement, relevance, and user behavior",
          "Number of followers only",
          "Posting frequency only",
        ],
        answer: 1,
      },
      {
        q: "Copyright law protects creative works:",
        options: [
          "Only if registered",
          "Automatically from the moment of creation",
          "For 10 years only",
          "Only for commercial use",
        ],
        answer: 1,
      },
      {
        q: "Design ethics involves:",
        options: [
          "Only following client instructions",
          "Considering social, cultural, and environmental impact of design decisions",
          "Maximizing revenue",
          "Using only traditional methods",
        ],
        answer: 1,
      },
      {
        q: "Content strategy in digital marketing involves:",
        options: [
          "Creating as much content as possible",
          "Planning, creating, and managing content to achieve business goals",
          "Only social media posts",
          "Paid advertising only",
        ],
        answer: 1,
      },
    ],
  },
};

const STREAM_CAT_ICONS: Record<string, Record<string, string>> = {
  cse: {
    Aptitude: "🧠",
    Programming: "💻",
    "Web Development": "🌐",
    DSA: "📊",
  },
  mechanical: {
    Aptitude: "🧠",
    "Engineering Mechanics": "⚙️",
    Thermodynamics: "🔥",
    Manufacturing: "🏭",
  },
  electrical: {
    Aptitude: "🧠",
    "Circuit Theory": "⚡",
    "Digital Electronics": "💾",
    "Power Systems": "🔌",
  },
  civil: {
    Aptitude: "🧠",
    "Structural Engineering": "🏗️",
    "Geotechnical Engineering": "🔨",
    "Fluid Mechanics": "💧",
  },
  mba: {
    Aptitude: "🧠",
    "Business Fundamentals": "💼",
    Marketing: "📊",
    "Finance & Accounting": "💰",
  },
  medical: {
    Aptitude: "🧠",
    "Anatomy & Physiology": "🫘",
    "Clinical Knowledge": "📊",
    "Healthcare Management": "🏥",
  },
  commerce: { Aptitude: "🧠", Accounting: "📊", Finance: "💰", Taxation: "📣" },
  arts: {
    Aptitude: "🧠",
    "Design Principles": "🎨",
    "Digital Tools": "💻",
    "Creative Theory": "🎥",
  },
};

const TIME_PER_Q = 30;

type Phase = "select" | "quiz" | "result";

export default function MockTests() {
  const userStream = getUserStream();
  const streamDef = getStreamById(userStream);

  // Use stream-specific question bank, fallback to cse
  const questionBank =
    STREAM_QUESTION_BANKS[userStream] ?? STREAM_QUESTION_BANKS.cse;
  const catIcons = STREAM_CAT_ICONS[userStream] ?? STREAM_CAT_ICONS.cse;
  const CATEGORIES = Object.keys(questionBank);

  const [phase, setPhase] = useState<Phase>("select");
  const [category, setCategory] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTest = (cat: string) => {
    const qs = [...(questionBank[cat] ?? [])]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    setCategory(cat);
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
    setCurrent(0);
    setSelected(null);
    setTimeLeft(TIME_PER_Q);
    setPhase("quiz");
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional design - stopTimer is stable
  useEffect(() => {
    if (phase !== "quiz") return;
    stopTimer();
    setTimeLeft(TIME_PER_Q);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleNext(null);
          return TIME_PER_Q;
        }
        return t - 1;
      });
    }, 1000);
    return stopTimer;
  }, [phase, current]);

  const handleNext = (sel: number | null) => {
    stopTimer();
    const newAnswers = [...answers];
    newAnswers[current] = sel;
    setAnswers(newAnswers);
    setSelected(null);
    if (current + 1 >= questions.length) {
      setPhase("result");
      // save best score per user per category
      const score = newAnswers.filter(
        (a, i) => a === questions[i].answer,
      ).length;
      const pct = Math.round((score / questions.length) * 100);
      const key = getUserKey(`mock_best_${category}`);
      const prev = Number(localStorage.getItem(key) ?? 0);
      if (pct > prev) localStorage.setItem(key, String(pct));
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const score = answers.filter(
    (a, i) => a !== null && a === questions[i]?.answer,
  ).length;
  const pct =
    questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  const feedback =
    pct >= 80
      ? { label: "Excellent! 🎉", color: "#39D98A" }
      : pct >= 60
        ? { label: "Good Work! 👍", color: "#F59E0B" }
        : { label: "Needs Practice 💪", color: "#EF4444" };

  return (
    <AppShell title="Mock Tests" subtitle="Practice and assess your skills">
      <div className="max-w-3xl mx-auto" data-ocid="mock_tests.page">
        {phase === "select" && (
          <div className="animate-fade-in-up">
            <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  Mock Test Center
                </h1>
                <p className="text-white/40 text-sm">
                  10 questions · 30 sec per question · Instant feedback
                </p>
              </div>
              <span
                className="text-xs font-semibold px-3 py-1.5 rounded-full border"
                style={{
                  color: streamDef.color,
                  background: `${streamDef.color}15`,
                  borderColor: `${streamDef.color}35`,
                }}
                data-ocid="mock_tests.stream.badge"
              >
                {streamDef.label} Tests
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CATEGORIES.map((cat, i) => {
                const bestKey = getUserKey(`mock_best_${cat}`);
                const bestScore = Number(localStorage.getItem(bestKey) ?? 0);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => startTest(cat)}
                    className="glass-card-hover p-6 text-left group"
                    data-ocid={`mock_tests.category.${i + 1}`}
                  >
                    <div className="text-4xl mb-3">{catIcons[cat] ?? "📝"}</div>
                    <h3 className="text-white font-bold text-lg mb-1">{cat}</h3>
                    <p className="text-white/40 text-sm mb-4">
                      10 MCQ questions · 30s timer
                    </p>
                    {bestScore > 0 && (
                      <div className="text-xs text-purple-400 font-medium">
                        Best: {bestScore}%
                      </div>
                    )}
                    <div className="mt-4 btn-primary text-sm py-2 px-4 inline-flex items-center gap-2">
                      <ClipboardCheck size={15} /> Start Test
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {phase === "quiz" && questions.length > 0 && (
          <div className="animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-bold text-lg">{category}</h2>
                <p className="text-white/40 text-sm">
                  Question {current + 1} of {questions.length}
                </p>
              </div>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-lg ${
                  timeLeft <= 10
                    ? "bg-red-500/20 text-red-400 animate-pulse"
                    : "bg-white/10 text-white"
                }`}
              >
                <Timer size={18} />
                {timeLeft}s
              </div>
            </div>

            {/* Progress bar */}
            <div className="progress-bar-track mb-6">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${((current + 1) / questions.length) * 100}%`,
                }}
              />
            </div>

            {/* Question */}
            <div
              className="glass-card p-6 mb-4"
              data-ocid="mock_tests.question.panel"
            >
              <p className="text-white font-semibold text-base leading-relaxed">
                {questions[current].q}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {questions[current].options.map((opt, idx) => (
                <button
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable index
                  key={idx}
                  type="button"
                  onClick={() => setSelected(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    selected === idx
                      ? "bg-purple-600/30 border-purple-500 text-white"
                      : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/25"
                  }`}
                  data-ocid={`mock_tests.option.${idx + 1}`}
                >
                  <span className="font-medium mr-2 text-white/50">
                    {["A", "B", "C", "D"][idx]}.
                  </span>
                  {opt}
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => handleNext(selected)}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                data-ocid="mock_tests.next.button"
              >
                {current + 1 >= questions.length
                  ? "Submit Test"
                  : "Next Question"}
              </button>
              <button
                type="button"
                onClick={() => handleNext(null)}
                className="btn-secondary text-sm px-4"
                data-ocid="mock_tests.skip.button"
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {phase === "result" && (
          <div className="animate-fade-in-up text-center">
            <div
              className="glass-card p-8 mb-6"
              data-ocid="mock_tests.result.panel"
            >
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-extrabold"
                style={{
                  background: `${feedback.color}20`,
                  border: `3px solid ${feedback.color}`,
                  color: feedback.color,
                }}
              >
                {pct}%
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {feedback.label}
              </h2>
              <p className="text-white/50 mb-2">
                You got <span className="text-white font-bold">{score}</span>{" "}
                out of{" "}
                <span className="text-white font-bold">{questions.length}</span>{" "}
                correct
              </p>
              <p className="text-white/40 text-sm">Category: {category}</p>
            </div>

            {/* Answer Review */}
            <div
              className="glass-card p-6 mb-6 text-left"
              data-ocid="mock_tests.review.panel"
            >
              <h3 className="text-white font-semibold mb-4">Answer Review</h3>
              <div className="space-y-3">
                {questions.map((q, i) => {
                  const correct = answers[i] === q.answer;
                  return (
                    // biome-ignore lint/suspicious/noArrayIndexKey: stable index
                    <div key={i} className="flex items-start gap-3">
                      {correct ? (
                        <CheckCircle2
                          size={16}
                          className="text-green-400 flex-shrink-0 mt-0.5"
                        />
                      ) : (
                        <XCircle
                          size={16}
                          className="text-red-400 flex-shrink-0 mt-0.5"
                        />
                      )}
                      <div>
                        <p className="text-white/80 text-sm">{q.q}</p>
                        {!correct && (
                          <p className="text-green-400 text-xs mt-0.5">
                            Correct: {q.options[q.answer]}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => startTest(category)}
                className="btn-primary flex items-center gap-2"
                data-ocid="mock_tests.retry.button"
              >
                <RotateCcw size={16} /> Retry Test
              </button>
              <button
                type="button"
                onClick={() => setPhase("select")}
                className="btn-secondary"
                data-ocid="mock_tests.back.button"
              >
                Choose Category
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
