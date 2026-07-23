import React from "react";
import { PageHeader, PrimaryButton, TextInput, TextArea } from "../ui";
import { Search, Globe, Share2, CheckCircle2 } from "lucide-react";

export default function AdminSeo() {
  return (
    <div className="font-body">
      <PageHeader
        title="Search Visibility & SEO"
        sub="Manage site-wide meta titles, descriptions, OpenGraph tags, and search engine schemas."
        action={
          <PrimaryButton>
            <CheckCircle2 className="w-4 h-4 mr-1" /> Save Meta Rules
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-[#e0e0e0] p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#161616] mb-4 font-headline flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#0f62fe]" /> Global Title & Description
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#6f6f6f] mb-1 font-medium">
                  Meta Title Format
                </label>
                <TextInput defaultValue="Way Education — Study in Türkiye & Northern Cyprus" />
              </div>

              <div>
                <label className="block text-xs text-[#6f6f6f] mb-1 font-medium">
                  Meta Description
                </label>
                <TextArea
                  rows={3}
                  defaultValue="Way Education helps MENA students apply, get admitted, and relocate to top accredited universities in Türkiye and Northern Cyprus."
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e0e0e0] p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#161616] mb-4 font-headline flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#0f62fe]" /> OpenGraph & Social Sharing
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#6f6f6f] mb-1 font-medium">
                  OG Image Preview URL
                </label>
                <TextInput defaultValue="https://wayeducation.com/og-image.jpg" />
              </div>

              <div className="p-4 bg-[#f4f4f4] border border-[#e0e0e0] flex items-center gap-4">
                <img
                  src="/brand/logo.jpeg"
                  alt="OG Banner"
                  className="w-16 h-16 object-cover border border-[#e0e0e0]"
                />
                <div>
                  <div className="text-xs font-semibold text-[#161616]">
                    Way Education — Study in Türkiye & Northern Cyprus
                  </div>
                  <div className="text-[11px] text-[#6f6f6f] mt-0.5">
                    wayeducation.com · Official MENA Student Placement Agency
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-[#e0e0e0] p-6 h-fit">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#161616] mb-4 font-headline">
            Search Index Health
          </h3>
          <div className="space-y-4 text-xs">
            <div className="flex justify-between py-2 border-b border-[#e0e0e0]">
              <span className="text-[#6f6f6f]">Sitemap Index Status</span>
              <span className="font-semibold text-[#198038]">Indexed (200 OK)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#e0e0e0]">
              <span className="text-[#6f6f6f]">Robots.txt</span>
              <span className="font-semibold text-[#198038]">Valid</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#e0e0e0]">
              <span className="text-[#6f6f6f]">Canonical Target</span>
              <span className="font-semibold text-[#161616]">https://wayeducation.com</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[#6f6f6f]">Structured Data</span>
              <span className="font-semibold text-[#0f62fe]">EducationalOrganization</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
