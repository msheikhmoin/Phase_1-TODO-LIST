# Kubernetes Deployment Commands for Todo Application

## Prerequisites
Make sure your Minikube cluster is running:
```bash
minikube start
```

## Deploy the PostgreSQL Database
```bash
helm install postgresql ./charts/postgresql --set replicaCount=1
```

## Deploy the Backend Service
```bash
# First build and load the Docker image
docker build -f Dockerfile.backend -t todo-backend:latest .
minikube image load todo-backend:latest

# Then deploy using Helm
helm install backend ./charts/backend --set replicaCount=2
```

## Deploy the Frontend Service
```bash
# First build and load the Docker image
docker build -f Dockerfile.frontend -t todo-frontend:latest .
minikube image load todo-frontend:latest

# Then deploy using Helm
helm install frontend ./charts/frontend --set replicaCount=2
```

## Alternative: Deploy all services at once with kubectl-ai
```bash
# Package the charts first
helm package ./charts/postgresql
helm package ./charts/backend
helm package ./charts/frontend

# Install all releases
helm install postgresql postgresql-0.1.0.tgz --set replicaCount=1
helm install backend backend-0.1.0.tgz --set replicaCount=2
helm install frontend frontend-0.1.0.tgz --set replicaCount=2
```

## Check deployment status
```bash
kubectl get pods
kubectl get services
kubectl get deployments
```

## Access the application
```bash
# Get the frontend service URL
minikube service frontend --url
```

## Scaling the deployments to 2 replicas (if needed)
```bash
kubectl scale deployment backend --replicas=2
kubectl scale deployment frontend --replicas=2
```

## Useful monitoring commands
```bash
# View logs
kubectl logs -l app.kubernetes.io/name=backend
kubectl logs -l app.kubernetes.io/name=frontend

# Describe deployments for detailed info
kubectl describe deployment backend
kubectl describe deployment frontend

# Check resource usage
kubectl top pods
```

## Uninstall the application
```bash
helm uninstall frontend
helm uninstall backend
helm uninstall postgresql
```