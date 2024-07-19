import http from "k6/http";
import { check, sleep } from "k6";
import { Counter, Rate } from "k6/metrics";

export let errorRate = new Rate("errors");
export let requestCount = new Counter("request_count");

export let options = {
  scenarios: {
    scenario_updatePost: {
      executor: "constant-vus",
      vus: 10,
      duration: "30s",
      exec: "updatePost", // Executes the updatePost function
    },
    scenario_createPost: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 20 },
        { duration: "1m", target: 10 },
      ],
      gracefulRampDown: "30s",
      exec: "createPost", // Executes the createPost function
    },
    scenario_getPosts: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "40s", target: 30 },
        { duration: "1m20s", target: 15 },
      ],
      gracefulRampDown: "30s",
      exec: "getPosts", // Executes the getPosts function
    },
  },
  thresholds: {
    errors: ["rate<0.1"], // <10% errors
    "http_req_duration{scenario:scenario_1}": ["p(95)<1000"], // 95% of requests in scenario_1 must complete below 1000ms
    "http_req_duration{scenario:scenario_2}": ["p(95)<1000"], // 95% of requests in scenario_1 must complete below 1000ms
    "http_req_duration{scenario:scenario_3}": ["p(95)<1000"], // 95% of requests in scenario_2 must complete below 1000ms
  },
};

export function setup() {
  console.log("Setup phase");
}

export function updatePost() {
  requestCount.add(1);

  // PUT API endpoint: /posts (update)
  let updatePayload = JSON.stringify({
    title: "perftestupdate",
    body: "updating post from k6",
    userId: "wtw124",
  });

  let updateParams = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  let resUpdatePost = http.put(
    "https://jsonplaceholder.typicode.com/posts/1", // Note: specify the post ID to update
    updatePayload,
    updateParams
  );

  let checkUpdatePost = check(resUpdatePost, {
    "update post contains title": (r) =>
      JSON.parse(r.body).title === "perftestupdate",
    "update post contains body": (r) =>
      JSON.parse(r.body).body === "updating post from k6",
    "update post contains userId": (r) =>
      JSON.parse(r.body).userId === "wtw124",
  });
  errorRate.add(!checkUpdatePost);

  sleep(3);
}

export function createPost() {
  requestCount.add(1);

  // POST API endpoint: /posts (create)
  let createPayload = JSON.stringify({
    title: "createperftest",
    body: "creating post from k6",
    userId: "wtw123",
  });

  let createParams = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  let resCreatePost = http.post(
    "https://jsonplaceholder.typicode.com/posts",
    createPayload,
    createParams
  );

  let checkCreatePost = check(resCreatePost, {
    "create post contains title": (r) =>
      JSON.parse(r.body).title === "createperftest",
    "create post contains body": (r) =>
      JSON.parse(r.body).body === "creating post from k6",
    "create post contains userId": (r) =>
      JSON.parse(r.body).userId === "wtw123",
  });
  errorRate.add(!checkCreatePost);

  sleep(3);
}

export function getPosts() {
  requestCount.add(1);

  // Test API endpoint: /posts
  let resGetPosts = http.get("https://jsonplaceholder.typicode.com/posts");
  let checkPosts = check(resGetPosts, {
    "posts contains userId": (r) => JSON.parse(r.body)[0].userId !== undefined,
  });
  errorRate.add(!checkPosts);

  // Test API endpoint: /photos
  let resGetPhotos = http.get(
    "https://jsonplaceholder.typicode.com/albums/1/photos"
  );
  let checkPhotos = check(resGetPhotos, {
    "photos contains albumId": (r) =>
      JSON.parse(r.body)[0].albumId !== undefined,
  });
  errorRate.add(!checkPhotos);

  sleep(3);
}

export function teardown() {
  console.log("Teardown phase");
}
