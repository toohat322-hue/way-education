import React from "react";
import { PageHeader } from "../ui";
import GlassCard from "../../components/GlassCard";
import { C } from "../../theme/tokens";

export default function AdminSeo() {
  return (
    <div>
      <PageHeader title="SEO Settings" sub="Manage page metadata, OpenGraph tags, and schema." />
      <GlassCard className="p-12 text-center" style={{ background: "#fff" }}>
        <p style={{ color: C.muted }}>SEO management interface coming soon.</p>
      </GlassCard>
    </div>
  );
}
