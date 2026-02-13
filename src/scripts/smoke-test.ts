import { DATA } from "../data/resume";

async function verifyArchitecture() {
    console.log("🚀 Starting Deployment Integrity Checks...");

    // 1. Data Layer Integrity
    if (!DATA.name || !DATA.role) {
        throw new Error("Data Layer Error: Resume data is incomplete.");
    }
    console.log("✅ Data Layer: Integrity Verified.");

    // 2. Project Gating Logic Preview
    const projectsCount = DATA.projects.length;
    if (projectsCount === 0) {
        throw new Error("Content Error: No projects found in Source of Truth.");
    }
    console.log(`✅ Content Layer: ${projectsCount} projects verified.`);

    // 3. Environment Check
    if (process.env.NODE_ENV === 'production' && !process.env.GROQ_API_KEY) {
        console.warn("⚠️  Warning: GROQ_API_KEY is missing. AI Chat will be non-functional in production.");
    }

    console.log("✨ All deployment checks passed!");
}

verifyArchitecture().catch((err) => {
    console.error("❌ Deployment Check Failed:", err.message);
    process.exit(1);
});
