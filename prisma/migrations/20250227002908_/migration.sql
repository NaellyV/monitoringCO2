-- CreateTable
CREATE TABLE "sensors" (
    "id" SERIAL NOT NULL,
    "co2Level" DOUBLE PRECISION NOT NULL,
    "dayMedia" DOUBLE PRECISION NOT NULL,
    "location" TEXT NOT NULL,
    "airQuality" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sensors_pkey" PRIMARY KEY ("id")
);
