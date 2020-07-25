FROM alpine:3.7
RUN apk add --no-cache lighttpd lighttpd-mod_webdav nano sqlite
COPY build /srv/todo-all-the-things
COPY docker/lighttpd.conf /etc/lighttpd/
RUN mkdir /srv/todo-all-the-things/data
RUN chown -R lighttpd:lighttpd /srv/todo-all-the-things
ENTRYPOINT lighttpd -D -f /etc/lighttpd/lighttpd.conf
