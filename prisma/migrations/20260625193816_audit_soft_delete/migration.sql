-- AlterTable
ALTER TABLE "Category" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Setting" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "SocialLink" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "deletedAt" DATETIME;

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "userEmail" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "entityName" TEXT,
    "oldValues" TEXT,
    "newValues" TEXT,
    "description" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
