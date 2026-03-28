import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Time "mo:base/Time";

actor {
  // ============================================================
  // Types
  // ============================================================

  type EducationEntry = {
    institution : Text;
    degree : Text;
    field : Text;
    startYear : Int;
    endYear : Int;
  };

  type ProjectEntry = {
    name : Text;
    description : Text;
    technologies : [Text];
  };

  type ExperienceEntry = {
    company : Text;
    position : Text;
    startYear : Int;
    endYear : Int;
    responsibilities : [Text];
  };

  type CertificationEntry = {
    name : Text;
    issuer : Text;
    year : Int;
  };

  type Resume = {
    name : Text;
    email : Text;
    phone : Text;
    summary : Text;
    education : [EducationEntry];
    skills : [Text];
    projects : [ProjectEntry];
    experience : [ExperienceEntry];
    certifications : [CertificationEntry];
  };

  type ATSResult = {
    score : Nat;
    missingSections : [Text];
    missingSkills : [Text];
    suggestions : [Text];
    textHash : Text;
  };

  type CareerProfile = {
    targetRole : Text;
    completedSteps : [Text];
    readinessScore : Nat;
  };

  type DashboardStats = {
    resumeCompletion : Nat;
    atsScore : Nat;
    eligibleRoles : Nat;
    missingSkills : Nat;
    careerReadiness : Nat;
  };

  type User = {
    phone : Text;
    name : Text;
    registeredAt : Int;
  };

  type OTPRecord = {
    otp : Text;
    expiry : Int;
    attempts : Nat;
    used : Bool;
  };

  type SessionRecord = {
    phone : Text;
    expiry : Int;
  };

  // ============================================================
  // Stores
  // ============================================================

  let resumeStore = Map.empty<Principal, Resume>();
  let atsStore = Map.empty<Principal, ATSResult>();
  let profileStore = Map.empty<Principal, CareerProfile>();

  // Phone-based auth stores
  let userStore = Map.empty<Text, User>();       // phone -> User
  let otpStore = Map.empty<Text, OTPRecord>();    // phone -> OTPRecord
  let sessionStore = Map.empty<Text, SessionRecord>(); // token -> SessionRecord

  // ============================================================
  // Helpers
  // ============================================================

  func natToText(n : Nat) : Text {
    var result = "";
    var num = n;
    if (num == 0) { return "0" };
    while (num > 0) {
      let digit = num % 10;
      let ch = switch digit {
        case 0 { "0" }; case 1 { "1" }; case 2 { "2" }; case 3 { "3" };
        case 4 { "4" }; case 5 { "5" }; case 6 { "6" }; case 7 { "7" };
        case 8 { "8" }; case _ { "9" };
      };
      result := ch # result;
      num := num / 10;
    };
    result
  };

  func generateOTP(phone : Text, timestamp : Int) : Text {
    // Deterministic 6-digit OTP from phone + timestamp
    var hash : Nat = 0;
    for (c in phone.chars()) {
      hash := (hash * 31 + Nat32.toNat(Char.toNat32(c))) % 1_000_000;
    };
    let t = if (timestamp < 0) { 0 } else { Int.abs(timestamp) };
    hash := (hash + t % 1_000_000) % 1_000_000;
    // Pad to 6 digits
    let s = natToText(hash);
    var padded = s;
    while (padded.size() < 6) {
      padded := "0" # padded;
    };
    padded
  };

  func generateToken(phone : Text, timestamp : Int) : Text {
    var hash : Nat = 0;
    for (c in phone.chars()) {
      hash := (hash * 37 + Nat32.toNat(Char.toNat32(c))) % 1_000_000_000;
    };
    let t = if (timestamp < 0) { 0 } else { Int.abs(timestamp) };
    hash := (hash * 7 + t % 1_000_000_000) % 1_000_000_000;
    "sess_" # natToText(hash)
  };

  func isExpired(expiry : Int) : Bool {
    Time.now() > expiry
  };

  func calculateResumeCompletion(resume : Resume) : Nat {
    var score = 0;
    if (resume.name != "") { score += 10 };
    if (resume.email != "") { score += 10 };
    if (resume.phone != "") { score += 10 };
    if (resume.summary != "") { score += 10 };
    if (resume.education.size() > 0) { score += 20 };
    if (resume.skills.size() > 0) { score += 15 };
    if (resume.projects.size() > 0) { score += 10 };
    if (resume.experience.size() > 0) { score += 10 };
    if (resume.certifications.size() > 0) { score += 5 };
    if (score > 100) { 100 } else { score };
  };

  // ============================================================
  // Auth API
  // ============================================================

  // Request OTP for registration or login
  // Returns the OTP (in production, would send via SMS)
  public shared func requestOTP(phone : Text) : async { ok : Bool; otp : Text; message : Text } {
    if (phone.size() < 7) {
      return { ok = false; otp = ""; message = "Invalid phone number" };
    };
    let now = Time.now();
    let tenMinutes = 10 * 60 * 1_000_000_000;
    // Check for existing unexpired OTP (rate limit)
    switch (otpStore.get(phone)) {
      case (?existing) {
        if (not isExpired(existing.expiry) and existing.attempts < 3) {
          // Return existing OTP (don't regenerate too fast)
          return { ok = true; otp = existing.otp; message = "OTP sent (demo: shown here)" };
        };
      };
      case null {};
    };
    let otp = generateOTP(phone, now);
    let record : OTPRecord = {
      otp = otp;
      expiry = now + tenMinutes;
      attempts = 0;
      used = false;
    };
    otpStore.add(phone, record);
    { ok = true; otp = otp; message = "OTP generated" }
  };

  // Verify OTP and register new user
  public shared func registerWithOTP(phone : Text, otp : Text, name : Text) : async { ok : Bool; token : Text; message : Text } {
    if (userStore.containsKey(phone)) {
      return { ok = false; token = ""; message = "Phone number already registered" };
    };
    switch (otpStore.get(phone)) {
      case null { return { ok = false; token = ""; message = "No OTP found. Please request one first" } };
      case (?record) {
        if (record.used) { return { ok = false; token = ""; message = "OTP already used" } };
        if (isExpired(record.expiry)) { return { ok = false; token = ""; message = "OTP expired. Please request a new one" } };
        if (record.attempts >= 5) { return { ok = false; token = ""; message = "Too many attempts. Request a new OTP" } };
        if (record.otp != otp) {
          otpStore.add(phone, { otp = record.otp; expiry = record.expiry; attempts = record.attempts + 1; used = false });
          return { ok = false; token = ""; message = "Invalid OTP" };
        };
        // Mark OTP as used
        otpStore.add(phone, { otp = record.otp; expiry = record.expiry; attempts = record.attempts; used = true });
        // Create user
        let user : User = { phone = phone; name = name; registeredAt = Time.now() };
        userStore.add(phone, user);
        // Create session
        let now = Time.now();
        let token = generateToken(phone, now);
        let oneDayNs = 24 * 60 * 60 * 1_000_000_000;
        sessionStore.add(token, { phone = phone; expiry = now + oneDayNs });
        { ok = true; token = token; message = "Registration successful" }
      };
    }
  };

  // Login with OTP
  public shared func loginWithOTP(phone : Text, otp : Text) : async { ok : Bool; token : Text; name : Text; message : Text } {
    if (not userStore.containsKey(phone)) {
      return { ok = false; token = ""; name = ""; message = "Phone not registered. Please sign up first" };
    };
    switch (otpStore.get(phone)) {
      case null { return { ok = false; token = ""; name = ""; message = "No OTP found. Please request one first" } };
      case (?record) {
        if (record.used) { return { ok = false; token = ""; name = ""; message = "OTP already used" } };
        if (isExpired(record.expiry)) { return { ok = false; token = ""; name = ""; message = "OTP expired" } };
        if (record.attempts >= 5) { return { ok = false; token = ""; name = ""; message = "Too many attempts. Request a new OTP" } };
        if (record.otp != otp) {
          otpStore.add(phone, { otp = record.otp; expiry = record.expiry; attempts = record.attempts + 1; used = false });
          return { ok = false; token = ""; name = ""; message = "Invalid OTP" };
        };
        otpStore.add(phone, { otp = record.otp; expiry = record.expiry; attempts = record.attempts; used = true });
        let userName = switch (userStore.get(phone)) {
          case (?u) { u.name };
          case null { phone };
        };
        let now = Time.now();
        let token = generateToken(phone, now);
        let oneDayNs = 24 * 60 * 60 * 1_000_000_000;
        sessionStore.add(token, { phone = phone; expiry = now + oneDayNs });
        { ok = true; token = token; name = userName; message = "Login successful" }
      };
    }
  };

  // Logout
  public shared func logout(token : Text) : async { ok : Bool } {
    sessionStore.remove(token);
    { ok = true }
  };

  // Get user from session token
  public query func getSessionUser(token : Text) : async { ok : Bool; phone : Text; name : Text } {
    switch (sessionStore.get(token)) {
      case null { { ok = false; phone = ""; name = "" } };
      case (?session) {
        if (isExpired(session.expiry)) {
          { ok = false; phone = ""; name = "" }
        } else {
          let userName = switch (userStore.get(session.phone)) {
            case (?u) { u.name };
            case null { session.phone };
          };
          { ok = true; phone = session.phone; name = userName }
        }
      };
    }
  };

  // Check if phone is registered
  public query func isPhoneRegistered(phone : Text) : async Bool {
    userStore.containsKey(phone)
  };

  // ============================================================
  // Resume API
  // ============================================================

  public shared ({ caller }) func saveResume(resume : Resume) : async () {
    resumeStore.add(caller, resume);
  };

  public query ({ caller }) func getResume(user : Principal) : async Resume {
    switch (resumeStore.get(user)) {
      case (null) { Runtime.trap("Resume not found") };
      case (?resume) { resume };
    };
  };

  public shared ({ caller }) func saveATSResult(result : ATSResult) : async () {
    atsStore.add(caller, result);
  };

  public query ({ caller }) func getATSResult(user : Principal) : async ATSResult {
    switch (atsStore.get(user)) {
      case (null) { Runtime.trap("ATS result not found") };
      case (?result) { result };
    };
  };

  public shared ({ caller }) func saveCareerProfile(profile : CareerProfile) : async () {
    profileStore.add(caller, profile);
  };

  public query ({ caller }) func getCareerProfile(user : Principal) : async CareerProfile {
    switch (profileStore.get(user)) {
      case (null) { Runtime.trap("Career profile not found") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getDashboardStats(user : Principal) : async DashboardStats {
    let resume = switch (resumeStore.get(user)) {
      case (null) {
        { name = ""; email = ""; phone = ""; summary = ""; education = []; skills = []; projects = []; experience = []; certifications = [] };
      };
      case (?resume) { resume };
    };
    let ats = switch (atsStore.get(user)) {
      case (null) { { score = 0; missingSections = []; missingSkills = []; suggestions = []; textHash = "" } };
      case (?result) { result };
    };
    let profile = switch (profileStore.get(user)) {
      case (null) { { targetRole = ""; completedSteps = []; readinessScore = 0 } };
      case (?profile) { profile };
    };
    {
      resumeCompletion = calculateResumeCompletion(resume);
      atsScore = ats.score;
      eligibleRoles = 0;
      missingSkills = ats.missingSkills.size();
      careerReadiness = profile.readinessScore;
    }
  };

  public shared ({ caller }) func deleteAllUserData(user : Principal) : async () {
    resumeStore.remove(caller);
    atsStore.remove(caller);
    profileStore.remove(caller);
  };

  public query ({ caller }) func getAllResumes() : async [Resume] {
    resumeStore.values().toArray();
  };

  public query ({ caller }) func getAllATSResults() : async [ATSResult] {
    atsStore.values().toArray();
  };

  public query ({ caller }) func getAllCareerProfiles() : async [CareerProfile] {
    profileStore.values().toArray();
  };

  public shared ({ caller }) func saveFullProfile(resume : Resume, ats : ATSResult, profile : CareerProfile) : async () {
    resumeStore.add(caller, resume);
    atsStore.add(caller, ats);
    profileStore.add(caller, profile);
  };
};
