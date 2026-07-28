-- Indexes for the request paths used by authentication, public content,
-- media listings, and lead exports. They are intentionally additive and
-- safe to apply to an existing production database.
CREATE INDEX "RefreshToken_userId_revokedAt_expiresAt_idx"
  ON "RefreshToken"("userId", "revokedAt", "expiresAt");

CREATE INDEX "PasswordResetToken_userId_usedAt_expiresAt_idx"
  ON "PasswordResetToken"("userId", "usedAt", "expiresAt");

CREATE INDEX "EmailVerificationToken_userId_usedAt_expiresAt_idx"
  ON "EmailVerificationToken"("userId", "usedAt", "expiresAt");

CREATE INDEX "BlogPost_status_publishedAt_idx"
  ON "BlogPost"("status", "publishedAt");

CREATE INDEX "MediaAsset_folder_createdAt_idx"
  ON "MediaAsset"("folder", "createdAt");

CREATE INDEX "Lead_createdAt_idx"
  ON "Lead"("createdAt");
