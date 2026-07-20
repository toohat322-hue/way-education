import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { C } from "../../theme/tokens";
import GlassCard from "../../components/GlassCard";
import { useLanguage } from "../../context/useLanguage";
import { PageHeader, TextInput, TextArea, GhostButton } from "../ui";

export default function AdminContent() {
  const { strings, updateString, resetStrings } = useLanguage();
  const [query, setQuery] = useState("");

  const keys = useMemo(
    () =>
      Object.keys(strings.en).filter(
        (k) => k !== "dir" && k.toLowerCase().includes(query.toLowerCase()),
      ),
    [strings, query],
  );

  return (
    <div>
      <PageHeader
        title="Site Copy"
        sub="Every EN/AR string on the site. Edits apply immediately, everywhere they're used."
        action={
          <GhostButton
            onClick={() => {
              if (
                window.confirm(
                  "Reset all site copy to defaults? This discards your edits.",
                )
              )
                resetStrings();
            }}
          >
            Reset all
          </GhostButton>
        }
      />

      <GlassCard
        className="p-1 mb-6 flex items-center gap-2 px-4"
        style={{ background: "#fff" }}
      >
        <Search size={16} color={C.muted} />
        <input
          id="content-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a text key…"
          aria-label="Search text keys"
          className="flex-1 outline-none text-sm bg-transparent py-2.5"
        />
      </GlassCard>

      <div className="space-y-3">
        {keys.map((key) => {
          const isArray = Array.isArray(strings.en[key]);
          return (
            <GlassCard key={key} className="p-4" style={{ background: "#fff" }}>
              <div
                className="text-xs font-semibold mb-2 font-mono"
                style={{ color: C.muted }}
              >
                {key}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {isArray ? (
                  <>
                    <TextArea
                      rows={3}
                      aria-label={`${key} in English`}
                      value={strings.en[key].join("\n")}
                      onChange={(e) =>
                        updateString("en", key, e.target.value.split("\n"))
                      }
                    />
                    <TextArea
                      rows={3}
                      dir="rtl"
                      aria-label={`${key} in Arabic`}
                      value={(strings.ar[key] || []).join("\n")}
                      onChange={(e) =>
                        updateString("ar", key, e.target.value.split("\n"))
                      }
                    />
                  </>
                ) : (
                  <>
                    <TextInput
                      aria-label={`${key} in English`}
                      value={strings.en[key]}
                      onChange={(e) => updateString("en", key, e.target.value)}
                    />
                    <TextInput
                      aria-label={`${key} in Arabic`}
                      dir="rtl"
                      value={strings.ar[key] || ""}
                      onChange={(e) => updateString("ar", key, e.target.value)}
                    />
                  </>
                )}
              </div>
            </GlassCard>
          );
        })}
        {keys.length === 0 && (
          <p className="text-sm text-center py-10" style={{ color: C.muted }}>
            No matching text keys.
          </p>
        )}
      </div>
    </div>
  );
}
