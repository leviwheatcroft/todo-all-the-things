FROM ubuntu:groovy
#RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y lighttpd lighttpd-mod-webdav nano sqlite strace

## build lighttpd
RUN apt-get update
# build tools
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y git autoconf automake libtool pkg-config build-essential
# lighttpd deps
RUN apt-get install -y zlib1g-dev libpcre3-dev libxml2-dev libsqlite3-dev uuid-dev
# fetch source
RUN git clone https://git.lighttpd.net/lighttpd/lighttpd1.4.git /lighttpd1.4
WORKDIR /lighttpd1.4
# build lighttpd
RUN ./autogen.sh
RUN ./configure --with-webdav-props --with-webdav-locks
RUN make
RUN make install
RUN mkdir /var/log/lighttpd
RUN chown www-data:www-data /var/log/lighttpd
# clean up
WORKDIR /
RUN apt-get remove -y git autoconf automake libtool pkg-config build-essential
RUN apt-get remove -y zlib1g-dev libpcre3-dev libxml2-dev libsqlite3-dev uuid-dev
RUN rm -fr /lighttpd1.4
# prep instance
RUN apt-get install -y sqlite3
COPY docker/lighttpd.conf /etc/lighttpd/

## install todo-all-the-things
COPY build /srv/todo-all-the-things
RUN mkdir /srv/todo-all-the-things/data
RUN chown -R www-data:www-data /srv/todo-all-the-things
ENTRYPOINT lighttpd -D -f /etc/lighttpd/lighttpd.conf
#ENTRYPOINT ["tail", "-f", "/dev/null"]
