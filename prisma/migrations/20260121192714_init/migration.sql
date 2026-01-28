-- CreateTable
CREATE TABLE "Call" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vapiCallId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "callerName" TEXT,
    "callerType" TEXT,
    "callIntent" TEXT,
    "clinic" TEXT,
    "location" TEXT,
    "provider" TEXT,
    "urgency" TEXT,
    "transferDestination" TEXT,
    "followUpNeeded" BOOLEAN NOT NULL DEFAULT true,
    "actionsStatus" TEXT NOT NULL DEFAULT 'Pending',
    "rating" INTEGER,
    "notes" TEXT,
    "transcriptUrl" TEXT,
    "transcriptText" TEXT,
    "addressed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Call_vapiCallId_key" ON "Call"("vapiCallId");
