import React, { useMemo, useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import { useLanguage } from "../../context/useLanguage";
import { PageHeader, TextInput, TextArea, GhostButton } from "../ui";

export default function AdminContent() {
  const { strings, updateString, resetStrings } = useLanguage();
  const [query, setQuery] = useState("");

  const keys = useMemo(
    () =>
      Object.keys(strings.en).filter(
        (k) => k !== "dir" && k.toLowerCase().includes(query.toLowerCase())
      ),
    [strings, query]
  );

  return (
    <div className="font-body">
      <PageHeader
        title="Global Lexicon & Site Copy"
        sub="Bilingual EN/AR strings used across the website. Edits take effect immediately."
        action={
          <GhostButton
            onClick={() => {
              if (
                window.confirm(
                  "Reset all site copy to defaults? This discards your edits."
                )
              )
                resetStrings();
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
          </GhostButton>
        }
      />

      <div className="mb-6 flex items-center bg-[#f4f4f4] border border-[#e0e0e0] px-4 py-2 text-sm">
        <Search className="w-4 h-4 text-[#6f6f6f] mr-3 shrink-0" />
        <input
          id="content-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by text key identifier..."
          aria-label="Search text keys"
          className="w-full bg-transparent border-none outline-none font-body text-[#161616]"
        />
      </div>

      <div className="space-y-4">
        {keys.map((key) => {
          const isArray = Array.isArray(strings.en[key]);
          return (
            <div key={key} className="bg-white border border-[#e0e0e0] p-4">
              <div className="text-xs font-semibold text-[#0f62fe] font-mono mb-3 uppercase tracking-wider">
                {key}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-[#6f6f6f] mb-1">
                    English (EN)
                  </label>
                  {isArray ? (
                    <TextArea
                      rows={3}
                      aria-label={`${key} in English`}
                      value={strings.en[key].join("\n")}
                      onChange={(e) =>
                        updateString("en", key, e.target.value.split("\n"))
                      }
                    />
                  ) : (
                    <TextInput
                      aria-label={`${key} in English`}
                      value={strings.en[key]}
                      onChange={(e) => updateString("en", key, e.target.value)}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#6f6f6f] mb-1 text-right">
                    (AR) العربية
                  </label>
                  {isArray ? (
                    <TextArea
                      rows={3}
                      dir="rtl"
                      aria-label={`${key} in Arabic`}
                      value={(strings.ar[key] || []).join("\n")}
                      onChange={(e) =>
                        updateString("ar", key, e.target.value.split("\n"))
                      }
                    />
                  ) : (
                    <TextInput
                      aria-label={`${key} in Arabic`}
                      dir="rtl"
                      value={strings.ar[key] || ""}
                      onChange={(e) => updateString("ar", key, e.target.value)}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {keys.length === 0 && (
          <p className="text-sm text-center py-10 text-[#6f6f6f]">
            No matching copy keys found for query "{query}".
          </p>
        )}
      </div>
    </div>
  );
}
