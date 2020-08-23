### Create and run docker
docker build . -t reactdocker;
docker run -it -d -p 80:80 --name rdocker reactdocker