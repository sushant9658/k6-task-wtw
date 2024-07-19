import http from "k6/http";
import { check, group, sleep } from "k6";
import { Counter, Rate } from "k6/metrics";

export let errorRate = new Rate("errors");
export let requestCount = new Counter("request_count");

export let options = {
  scenarios: {
    create_scenario_1: {
      executor: "constant-vus",
      vus: 10,
      duration: "30s",
    },
    create_scenario_2: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 10 },
        { duration: "1m", target: 5 },
      ],
    },
    create_scenario_3: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 10 },
        { duration: "1m", target: 5 },
      ],
    },
  },
  thresholds: {
    errors: ["rate<0.1"], // <10% errors
    "http_req_duration{scenario:create_scenario_1}": ["p(95)<500"], // 95% of requests must complete below 500ms
  },
};

export function setup() {
  console.log("Setup Phase");
}

export default function () {
  requestCount.add(1);

  // POST API endpoint: /posts
  let payload = JSON.stringify({
    title: "createperftest",
    body: "creating post from k6",
    userId: "wtw123",
  });

  let params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  let resPost = http.post(
    "https://jsonplaceholder.typicode.com/posts",
    payload,
    params
  );

  let checkPost = check(resPost, {
    "post contains title": (r) => JSON.parse(r.body).title === "createperftest",
    "post contains body": (r) =>
      JSON.parse(r.body).body === "creating post from k6",
    "post contains userId": (r) => JSON.parse(r.body).userId === "wtw123",
  });
  errorRate.add(!checkPost);

  sleep(3);
}

export function teardown() {
  console.log("Teardown phase");
}
