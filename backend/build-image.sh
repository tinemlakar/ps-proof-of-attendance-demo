set -e

docker build -t ps-poa .
docker tag ps-poa ps-poa:latest
docker save -o ps-poa.tar ps-poa:latest