// Pre-packaged MCA study notes and direct Chrome download utility

export const DEFAULT_NOTES_CONTENT = {
  "MERN_Stack_Placement_Guide.md": `# Comprehensive MERN Stack Placement Guide & Interview Questions
**EduHub MCA Placement Excellence Series — 2026 Edition**
**Author:** Siddharth Roy (Senior Tech Lead) & EduHub Faculty

---

## 1. Modern React & Frontend Engineering

### 1.1 React 19 Core Enhancements
- **React Compiler (Auto-Memoization)**: Automatically memoizes component renders and calculation values, eliminating excessive manual useMemo and useCallback hooks.
- **The use() Hook**: Enables synchronous-like resolution of Promises and React Context inside component bodies with automatic Suspense fallback.
- **Server Components & Actions**: Enables code execution strictly on the server, minimizing client bundle footprint to zero for pure render components.

### 1.2 Virtual DOM, Reconciliation & Fiber Architecture
- **Virtual DOM**: High-speed in-memory representation of real DOM elements.
- **Reconciliation Diffing Algorithm**:
  1. Elements of different types produce completely distinct trees.
  2. Developers supply stable 'key' attributes to allow React to match dynamic list children across renders.
  3. Operates in linear O(N) time complexity.
- **Fiber Engine**: Split-phase rendering engine that allows pausing, aborting, or reprioritizing work without locking the main thread.

### 1.3 State Management: Context API vs Redux Toolkit
- **React Context**: Best for low-frequency global values (theme, authenticated user session, language preference).
- **Redux Toolkit (RTK)**: Best for complex, high-frequency updates, shared cache invalidation (RTK Query), and normalized relational state.

---

## 2. Node.js & Asynchronous Architecture

### 2.1 The Libuv Event Loop Phases
Node.js runs single-threaded JavaScript, leveraging Libuv for non-blocking asynchronous I/O.
1. **Timers Phase**: Executes callbacks scheduled by setTimeout() and setInterval().
2. **Pending I/O Callbacks**: Processes deferred system callbacks (e.g., TCP socket errors).
3. **Idle, Prepare**: Used internally by Libuv.
4. **Poll Phase**: Retrieves new I/O events; executes I/O-related callbacks; blocks when appropriate.
5. **Check Phase**: Executes callbacks registered via setImmediate().
6. **Close Callbacks**: Handles socket closures, e.g. socket.on('close').
*Microtasks (process.nextTick() and resolved Promises) execute immediately after the current operation finishes.*

---

## 3. High-Yield Interview Q&A for MCA Candidates

**Q1: Explain the difference between dependencies and devDependencies in package.json.**
- 'dependencies' are packages required in production runtime (e.g. express, mongoose, cors).
- 'devDependencies' are only required during development and build time (e.g. nodemon, eslint, vite).

**Q2: What is a closure in JavaScript?**
- A closure is a function that retains access to variables in its outer lexical scope even after the outer function has finished executing.
`,

  "DBMS_Complete_Revision_Notes.md": `# Database Management Systems (DBMS) Complete Revision Notes
**EduHub MCA Placement Excellence Series — 2026 Edition**
**Author:** Prof. Arvind Sharma (DBMS Lead) & EduHub Faculty

---

## 1. Relational Database Concepts vs NoSQL

### 1.1 ACID Properties (RDBMS)
- **Atomicity**: Either all operations of a transaction execute completely or none do (All-or-Nothing).
- **Consistency**: The database transitions from one valid state to another, preserving all schema integrity constraints.
- **Isolation**: Concurrent transactions execute as if they were executed serially.
- **Durability**: Once a transaction is committed, its updates persist permanently even through a crash.

### 1.2 Normalization (1NF to BCNF)
- **1NF**: Atomic column values; no repeating groups.
- **2NF**: Table is in 1NF and has no partial functional dependency (all non-prime attributes depend on whole candidate key).
- **3NF**: Table is in 2NF and has no transitive dependencies (no non-prime attribute depends on another non-prime attribute).
- **BCNF**: For every functional dependency X -> Y, X must strictly be a super key.

### 1.3 B-Tree vs B+ Tree Indexing
- **B-Tree**: Stores search keys and record pointers at both internal and leaf nodes.
- **B+ Tree (Used by PostgreSQL, MySQL, MongoDB)**: Internal nodes store only keys to maximize branching factor; leaf nodes store all data pointers and are chained via a doubly linked list for fast O(log N + K) range queries.

---

## 2. High-Yield Interview Q&A

**Q1: Difference between DELETE, TRUNCATE, and DROP?**
- DELETE is DML (can have WHERE, logs row by row, can be rolled back).
- TRUNCATE is DDL (deallocates pages, resets auto-increment, much faster, cannot roll back in some engines).
- DROP is DDL (removes table structure, indexes, and all constraints completely).
`,

  "DSA_Cheat_Sheet_Java_Python.md": `# Data Structures & Algorithms Cheat Sheet (Java & Python)
**EduHub MCA Placement Excellence Series — 2026 Edition**
**Author:** Aman Verma (Competitive Programmer, Ex-FAANG) & EduHub Faculty

---

## 1. Asymptotic Complexity Reference

| Data Structure | Access | Search | Insertion | Deletion |
| :--- | :---: | :---: | :---: | :---: |
| **Array** | O(1) | O(N) | O(N) | O(N) |
| **Singly Linked List** | O(N) | O(N) | O(1) | O(1) |
| **Stack / Queue** | O(N) | O(N) | O(1) | O(1) |
| **Hash Table** | N/A | O(1) avg | O(1) avg | O(1) avg |
| **Binary Search Tree** | O(log N) avg | O(log N) avg | O(log N) avg | O(log N) avg |

---

## 2. Sliding Window Template (Java)

\`\`\`java
public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> lastSeen = new HashMap<>();
    int maxLen = 0, left = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (lastSeen.containsKey(c)) {
            left = Math.max(left, lastSeen.get(c) + 1);
        }
        lastSeen.put(c, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
\`\`\`

## 3. Dynamic Programming 0/1 Knapsack (Python)

\`\`\`python
def knap_sack(W: int, wt: list, val: list, n: int) -> int:
    dp = [0] * (W + 1)
    for i in range(n):
        for w in range(W, wt[i] - 1, -1):
            dp[w] = max(dp[w], val[i] + dp[w - wt[i]])
    return dp[W]
\`\`\`
`,

  "DevOps_Cloud_Architecture_Guide.md": `# Docker, Kubernetes & AWS Cloud DevOps Cheat Sheet
**EduHub MCA Placement Excellence Series — 2026 Edition**
**Author:** Ananya Sen (DevOps Architect, AWS Certified) & EduHub Faculty

---

## 1. Docker Multi-Stage Build

\`\`\`dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production runner
FROM nginx:alpine-slim AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

---

## 2. Kubernetes Architecture Core Elements
- **Control Plane**: kube-apiserver, etcd, kube-scheduler, kube-controller-manager.
- **Worker Node**: kubelet, kube-proxy, container runtime.
- **Key Objects**: Pods, Deployments, ReplicaSets, Services (ClusterIP, NodePort, LoadBalancer), Ingress.

---

## 3. AWS Placement Essentials
- **EC2**: Virtual servers with Security Groups and Auto Scaling Groups.
- **S3**: 11 9's durability object storage with Presigned URLs.
- **RDS**: Managed PostgreSQL/MySQL with Multi-AZ automated failover.
- **IAM**: Roles with temporary STS credentials over hardcoded access keys.
`
};

/**
 * Directly triggers a file download in Google Chrome / browser
 * by creating a Blob URL and triggering a synthetic click on an anchor element.
 */
export function triggerChromeDirectDownload(fileName, content) {
  const safeName = fileName.endsWith(".md") || fileName.endsWith(".txt")
    ? fileName
    : `${fileName.replace(/[^a-zA-Z0-9_-]/g, "_")}.md`;

  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = safeName;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 250);
}
