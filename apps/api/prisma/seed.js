"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '../../.env' });
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Start seeding...');
    // 1. Create Admin Account
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminEmail && adminPassword) {
        const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
        if (!existingAdmin) {
            const passwordHash = await bcryptjs_1.default.hash(adminPassword, 10);
            await prisma.user.create({
                data: {
                    email: adminEmail,
                    passwordHash,
                    role: 'admin',
                    profile: {
                        create: {
                            firstName: 'Admin',
                            lastName: 'User',
                            targetRoles: [],
                            industries: [],
                            locations: [],
                            workMode: 'any',
                            careerPriorities: [],
                            dealBreakers: []
                        }
                    }
                },
            });
            console.log(`Created admin user with email: ${adminEmail}`);
        }
        else {
            console.log(`Admin user already exists.`);
        }
    }
    // 2. Create Dummy Jobs
    const jobs = [
        {
            title: 'Senior Product Manager',
            company: 'Kinetic Logic',
            location: 'San Francisco, CA',
            workMode: 'hybrid',
            employmentType: 'Full-time',
            salary: '$160,000 - $190,000',
            description: 'Lead the product vision for our core SaaS platform...',
            requiredSkills: ['Product Strategy', 'Agile', 'Data Analysis'],
            applicationUrl: 'https://example.com/apply/1'
        },
        {
            title: 'Frontend Engineer (React)',
            company: 'Talvion',
            location: 'Remote',
            workMode: 'remote',
            employmentType: 'Full-time',
            salary: '$130,000 - $160,000',
            description: 'Build fast, responsive UIs using Next.js and Tailwind...',
            requiredSkills: ['React', 'TypeScript', 'Tailwind CSS'],
            applicationUrl: 'https://example.com/apply/2'
        },
        {
            title: 'Backend Node.js Developer',
            company: 'Acme Corp',
            location: 'New York, NY',
            workMode: 'onsite',
            employmentType: 'Full-time',
            salary: '$140,000 - $175,000',
            description: 'Develop scalable microservices in Node.js and Express...',
            requiredSkills: ['Node.js', 'Express', 'PostgreSQL'],
            applicationUrl: 'https://example.com/apply/3'
        }
    ];
    for (const job of jobs) {
        const existing = await prisma.job.findFirst({ where: { title: job.title, company: job.company } });
        if (!existing) {
            await prisma.job.create({ data: job });
        }
    }
    console.log('Seeding finished.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
