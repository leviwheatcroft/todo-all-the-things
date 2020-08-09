FROM debian:testing-slim

# RUN apt-get update && apt-get install -y nginx nginx-extras apache2-utils
RUN apt-get update && apt-get install -y nginx-full

# COPY webdav.conf /etc/nginx/conf.d/default.conf
# RUN rm /etc/nginx/sites-enabled/*

COPY /rootfs /
RUN chmod +x entrypoint.sh
CMD /entrypoint.sh && nginx -g "daemon off;"

# build & run:

# won't work:
# docker build . -f docker/nginx/Dockerfile -t tatt-nginx

# working:
# docker build docker/nginx -t tatt-nginx


# docker run --rm -p 3003:80 -d --name tatt-nginx tatt-nginx
