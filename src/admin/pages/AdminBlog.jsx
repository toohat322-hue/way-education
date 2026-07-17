import React from "react";
import { PageHeader } from "../ui";
import GlassCard from "../../components/GlassCard";
import { C } from "../../theme/tokens";

export default function AdminBlog() {
  return (
    <div>
      <PageHeader title="Blog Posts" sub="Manage articles, news, and guides." />
      <GlassCard className="p-12 text-center" style={{ background: "#fff" }}>
        <p style={{ color: C.muted }}>Blog management interface coming soon.</p>
      </GlassCard>
    </div>
  );
}
