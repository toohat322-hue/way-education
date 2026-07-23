import React from "react";
import { PageHeader, PrimaryButton, TextInput, TextArea, Select } from "../ui";
import { FileText, Plus, Search, Globe, Tag } from "lucide-react";

export default function AdminBlog() {
  return (
    <div className="font-body">
      <PageHeader
        title="Editorial Journal & Blog"
        sub="Manage articles, news releases, student success guides, and content staging."
        action={
          <PrimaryButton>
            <Plus className="w-4 h-4 mr-1" /> New Article
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[#e0e0e0] p-5 hover:border-[#0f62fe] transition-colors">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#d0e2ff] text-[#001d6c] px-2 py-0.5 mb-2 inline-block">
                  Student Guide
                </span>
                <h3 className="font-headline font-semibold text-base text-[#161616]">
                  Complete 2026 Guide to Studying Engineering in Türkiye
                </h3>
              </div>
              <span className="text-xs text-[#6f6f6f] whitespace-nowrap">Published</span>
            </div>
            <p className="text-xs text-[#525252] leading-relaxed mb-4">
              Comprehensive breakdown of accreditation, top universities, tuition fees, and visa requirements for MENA international students.
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-[#e0e0e0] text-xs text-[#6f6f6f]">
              <span>Author: Admissions Team</span>
              <span>Updated: 2 days ago</span>
            </div>
          </div>

          <div className="bg-white border border-[#e0e0e0] p-5 hover:border-[#0f62fe] transition-colors">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#a7f0ba] text-[#044317] px-2 py-0.5 mb-2 inline-block">
                  Scholarships
                </span>
                <h3 className="font-headline font-semibold text-base text-[#161616]">
                  Northern Cyprus University Scholarships for Fall Semester
                </h3>
              </div>
              <span className="text-xs text-[#6f6f6f] whitespace-nowrap">Draft</span>
            </div>
            <p className="text-xs text-[#525252] leading-relaxed mb-4">
              Detailed list of up to 50% tuition waiver grants available for international students applying through Way Education.
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-[#e0e0e0] text-xs text-[#6f6f6f]">
              <span>Author: Media Desk</span>
              <span>Updated: Yesterday</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e0e0e0] p-6 h-fit">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#161616] mb-4 font-headline flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#0f62fe]" /> Content Staging
          </h3>
          <p className="text-xs text-[#6f6f6f] leading-relaxed mb-4">
            Published articles automatically sync to the public blog feed and SEO indexing schemas.
          </p>
          <div className="space-y-3 text-xs text-[#525252]">
            <div className="flex justify-between py-2 border-b border-[#e0e0e0]">
              <span>Total Articles</span>
              <span className="font-semibold text-[#161616]">12</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#e0e0e0]">
              <span>Published Guides</span>
              <span className="font-semibold text-[#161616]">8</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Pending Drafts</span>
              <span className="font-semibold text-[#161616]">4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
