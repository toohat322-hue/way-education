const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const argon2 = require("argon2");

async function main() {
  const newPassword =
    process.env.ADMIN_PASSWORD || "replace-with-a-strong-password";
  const hash = await argon2.hash(newPassword);
  await prisma.user.update({
    where: { email: "admin@wayeducation.com" },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
      passwordHash: hash,
    },
  });
  console.log("Admin user reset successfully.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
