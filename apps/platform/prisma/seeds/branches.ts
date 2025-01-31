import { faker } from "@faker-js/faker";
import { Branch, PrismaClient } from "@prisma/client";
import colors from "colors";
import { parseInt, random } from "lodash";
import { BranchType } from "./types";

const prisma = new PrismaClient();

colors.enable();

const seedBranches = async () => {
  const branches: BranchType[] = [];

  const projects = await prisma.project.findMany({
    select: { id: true },
  });

  const users = await prisma.user.findMany({
    select: { id: true, email: true },
  });

  console.log(`Seeding branches for ${projects.length} projects`.blue);

  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < projects.length; j++) {
      // const isProtected = random() < 0.5;

      // create main main on each project for default user
      if (users[i].email === "envless@example.com") {
        await prisma.branch.create({
          data: {
            name: "main",
            projectId: projects[j].id,
            protectedAt: new Date(),
            createdById: users[i].id,
            description: faker.lorem.sentence(4),
          },
        });
      }

      const isProtected = false;
      branches.push({
        name: `${faker.git.branch()}-${random(1, 5000)}`,
        projectId: projects[j].id,
        protected: isProtected,
        protectedAt: isProtected ? new Date() : null,
        description: isProtected ? faker.lorem.sentence(4) : "",
        createdById: users[i].id,
      });
    }
  }

  const records = await prisma.branch.createMany({
    data: branches as Branch[],
  });

  console.log(`🎉 Seeded ${records.count} branches`.green);
};

export default seedBranches;
