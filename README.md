# CI/CD Docker Demo — Full Project

This is the working project behind "Automated CI/CD Pipeline with Docker & GitHub Actions."

## Structure
```
myapp-project/
├── src/
│   └── server.js              # Express app (has /health route)
├── package.json
├── package-lock.json          # already generated — needed for `npm ci`
├── Dockerfile                 # multi-stage build
├── .dockerignore
├── nginx/
│   └── app.conf                # reverse proxy config (copy to EC2)
├── .github/workflows/deploy.yml  # CI/CD pipeline
└── README.md
```

## Step 1 — Run it locally without Docker (sanity check)
```bash
npm install
npm start
# visit http://localhost:3000  and  http://localhost:3000/health
```

## Step 2 — Run it in Docker locally
Requires Docker Desktop (or Docker Engine on Linux) installed on your machine.
```bash
docker build -t cicd-docker-demo:v1 .
docker run -d -p 3000:3000 --name demo_container cicd-docker-demo:v1
curl http://localhost:3000/health
docker images                 # compare size vs a single-stage build
docker logs demo_container
docker stop demo_container && docker rm demo_container
```

## Step 3 — Push to Docker Hub manually (before automating it)
```bash
docker login
docker tag cicd-docker-demo:v1 <your-dockerhub-username>/cicd-docker-demo:latest
docker push <your-dockerhub-username>/cicd-docker-demo:latest
```

## Step 4 — Set up GitHub repo secrets
Repo → Settings → Secrets and variables → Actions → New repository secret:
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`      (Docker Hub → Account Settings → Security → New Access Token)
- `EC2_HOST`             (your EC2 public IP)
- `EC2_SSH_KEY`          (paste the contents of your .pem private key)

## Step 5 — Launch the EC2 instance (see the full AWS networking guide for the "why")
```bash
ssh -i mykey.pem ec2-user@<EC2_PUBLIC_IP>
sudo yum update -y
sudo yum install -y docker nginx
sudo systemctl enable --now docker
sudo systemctl enable --now nginx
sudo usermod -aG docker ec2-user
```
Then copy `nginx/app.conf` to `/etc/nginx/conf.d/app.conf` on the instance and
`sudo systemctl reload nginx`.

## Step 6 — Push to `main` and watch it deploy
```bash
git init
git add .
git commit -m "initial CI/CD pipeline"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
Go to the repo's **Actions** tab and watch `build-and-push` then `deploy` run.

## Next step in our conversation
Once you've got this running locally (Step 1 and 2 at minimum — Docker Hub/EC2 are optional
if you just want to understand the mechanics first), let me know and we'll move to the
**AWS networking deep dive** (VPC, IGW, security groups, SSH) as its own module.
