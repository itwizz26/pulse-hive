-- Add Product catalog fields
ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS "image" TEXT,
ADD COLUMN IF NOT EXISTS "size" TEXT;

-- Add Payment metadata fields
ALTER TABLE "Payment"
ADD COLUMN IF NOT EXISTS "customerEmail" TEXT,
ADD COLUMN IF NOT EXISTS "customerPhone" TEXT,
ADD COLUMN IF NOT EXISTS "providerOptional1" TEXT,
ADD COLUMN IF NOT EXISTS "providerOptional2" TEXT,
ADD COLUMN IF NOT EXISTS "providerOptional3" TEXT,
ADD COLUMN IF NOT EXISTS "providerOptional4" TEXT,
ADD COLUMN IF NOT EXISTS "providerOptional5" TEXT,
ADD COLUMN IF NOT EXISTS "providerStatusMessage" TEXT;