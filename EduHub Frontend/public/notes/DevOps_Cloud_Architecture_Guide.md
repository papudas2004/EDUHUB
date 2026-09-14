# Docker, Kubernetes & AWS Cloud DevOps Cheat Sheet
**EduHub MCA Placement Excellence Series — 2026 Edition**
**Author:** Ananya Sen (DevOps Architect, AWS Certified) & EduHub Faculty

---

## 1. Docker Production Best Practices

### 1.1 Multi-Stage Production Dockerfile (Node.js/React)
Reduces final runtime image size from 1.2 GB to ~45 MB by decoupling build tools from the production runtime.

```dockerfile
# Stage 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Minimal Production Runner
FROM nginx:alpine-slim AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 1.2 Essential Docker CLI Commands
```bash
# Build an image with version tagging
docker build -t eduhub-backend:v1.0 .

# Run container in detached mode with port mapping and env file
docker run -d -p 8080:8080 --env-file .env --name eduhub-app eduhub-backend:v1.0

# View real-time container metrics (CPU, RAM, Network I/O)
docker stats

# Inspect volume bindings and network bridge configurations
docker inspect eduhub-app | grep -i "mounts" -A 10
```

---

## 2. Kubernetes (K8s) Architecture & Manifests

### 2.1 Kubernetes Architecture
* **Control Plane (Master Node)**:
  * `kube-apiserver`: Front-end for the control plane; handles REST queries.
  * `etcd`: Consistent and highly-available key-value store holding all cluster data.
  * `kube-scheduler`: Assigns newly created Pods to suitable worker nodes.
  * `kube-controller-manager`: Runs controller processes (Node, Replication, Endpoints).
* **Worker Node**:
  * `kubelet`: Agent ensuring containers are running in a Pod as specified by PodSpecs.
  * `kube-proxy`: Network proxy maintaining network rules on nodes.
  * `container-runtime`: Software responsible for running containers (containerd, CRI-O).

### 2.2 Production Deployment & ClusterIP Service Manifest
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: eduhub-backend-deployment
  labels:
    app: eduhub-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: eduhub-backend
  template:
    metadata:
      labels:
        app: eduhub-backend
    spec:
      containers:
      - name: backend
        image: eduhub/backend:1.0.0
        ports:
        - containerPort: 8080
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "150m"
            memory: "256Mi"
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: eduhub-backend-service
spec:
  type: ClusterIP
  selector:
    app: eduhub-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
```

---

## 3. AWS Core Cloud Services for MCA Placement

### 3.1 Compute & Storage
* **EC2 (Elastic Compute Cloud)**: Virtual servers in the cloud. Key concepts: AMI, Security Groups (stateful firewall), Elastic IP, Auto Scaling Groups.
* **S3 (Simple Storage Service)**: Object storage offering 99.999999999% (11 9's) durability. Use cases: static asset hosting, video lectures, user profile uploads with presigned URLs.
* **RDS (Relational Database Service)**: Managed relational databases (PostgreSQL, MySQL). Supports Multi-AZ deployments for automated failover and read replicas for read scaling.

### 3.2 Security, Identity & CDN
* **IAM (Identity and Access Management)**:
  * Principle of Least Privilege: Assign only the permissions strictly required.
  * Roles vs Users: Use IAM Roles with temporary credentials (STS) for EC2/ECS/Lambda instead of hardcoding long-lived secret keys.
* **CloudFront CDN**: Edge caching network delivering static assets, videos, and API traffic with low latency.

---

## 4. GitHub Actions CI/CD Pipeline Template

```yaml
name: Production CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm test
      - name: Build Docker Image
        run: docker build -t eduhub-app:${{ github.sha }} .
```
