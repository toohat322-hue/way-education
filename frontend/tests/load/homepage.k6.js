import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  scenarios: {
    smoke: {
      executor: "constant-vus",
      vus: 20,
      duration: "2m",
    },
    spike: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 100 },
        { duration: "1m", target: 100 },
        { duration: "30s", target: 0 },
      ],
      startTime: "2m",
    },
    soak: {
      executor: "constant-vus",
      vus: 30,
      duration: "10m",
      startTime: "4m",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.02"],
    http_req_duration: ["p(95)<800"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://127.0.0.1:4173";

export default function () {
  const endpoints = ["/", "/universities", "/about", "/contact"];

  endpoints.forEach((path) => {
    const res = http.get(`${BASE_URL}${path}`);
    check(res, {
      "status is 200": (r) => r.status === 200,
      "html response": (r) =>
        (r.headers["Content-Type"] || "").includes("text/html"),
    });
  });

  sleep(1);
}
