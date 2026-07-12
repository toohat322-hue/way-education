import http from "k6/http";
import { check, group, sleep } from "k6";

export const options = {
  scenarios: {
    user_journey: {
      executor: "per-vu-iterations",
      vus: 50,
      iterations: 20,
      maxDuration: "15m",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<1000"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://127.0.0.1:4173";

export default function () {
  group("Landing", () => {
    const home = http.get(`${BASE_URL}/`);
    check(home, { "home 200": (r) => r.status === 200 });
  });

  group("Directory", () => {
    const list = http.get(`${BASE_URL}/universities?country=Türkiye`);
    check(list, { "directory 200": (r) => r.status === 200 });
  });

  group("Detail", () => {
    const detail = http.get(`${BASE_URL}/university/iau`);
    check(detail, { "detail 200": (r) => r.status === 200 });
  });

  sleep(0.8);
}
