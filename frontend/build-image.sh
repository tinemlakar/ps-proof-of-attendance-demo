set -e

docker build -t ps-poa-app .
docker tag ps-poa-app ps-poa-app:latest
docker save -o ps-poa-app.tar ps-poa-app:latest