import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import { UNIVERSITIES } from "../data/universities";
import { DIRECTORY } from "../data/directory";
import { MAJORS } from "../data/majors";
import { FAQS } from "../data/faqs";
import { SETTINGS } from "../data/settings";
import { STRINGS } from "../data/translations";

class MockIntersectionObserver {
	observe() {}

	unobserve() {}

	disconnect() {}
}

if (!globalThis.IntersectionObserver) {
	globalThis.IntersectionObserver = MockIntersectionObserver;
}

function jsonResponse(payload, status = 200) {
	return Promise.resolve(
		new Response(JSON.stringify(payload), {
			status,
			headers: { "Content-Type": "application/json" },
		})
	);
}

const bootstrapPayload = {
	universities: UNIVERSITIES,
	directory: DIRECTORY,
	majors: MAJORS.map((major) => ({ ...major, id: major.name.en.toLowerCase().replace(/\s+/g, "-") })),
	faqs: FAQS.map((faq, index) => ({ ...faq, id: `faq-${index + 1}` })),
	settings: SETTINGS,
	strings: STRINGS,
};

vi.stubGlobal(
	"fetch",
	vi.fn(async (input, init = {}) => {
		const url = String(input);
		const method = String(init.method || "GET").toUpperCase();

		if (url.includes("/api/cms/bootstrap")) return jsonResponse(bootstrapPayload);
		if (url.includes("/api/cms/site-copy") && method === "GET") return jsonResponse(STRINGS);
		if (url.includes("/api/cms/site-copy") && method === "PATCH") return jsonResponse(STRINGS);
		if (url.includes("/api/auth/me")) return jsonResponse({ authenticated: false }, 401);
		if (url.includes("/api/leads") && method === "POST") return jsonResponse({ ok: true, leadId: "lead_test" });

		return jsonResponse({ ok: true });
	})
);
