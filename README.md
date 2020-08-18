

## Docker

 - `yarn` or `npm`: install all the things
 - `yarn run build` or `npm run build`: build the client
 - `docker build . -f docker/Dockerfile -t tatt`
 - `docker run --name tatt --rm -p 3000:3000 -d tatt`

## webdav development server

https://hub.docker.com/r/bytemark/webdav

```
cd /home/levi/git/docker-webdav/2.4
docker build . -f Dockerfile -t tatt-webdav
docker run \
  --restart always \
  -v /home/levi/git/todo-all-the-things/data:/var/lib/dav \
  -e AUTH_TYPE=Digest -e USERNAME=tatt -e PASSWORD=tatt \
  --publish 3003:80 \
  --name tatt-webdav \
  -d tatt-webdav
```

## version

 - merge to master
 - update version in package.json
 - `yarn run build`
 - `git add . && git commit -m "bump & build"`
 - `git tag -a "vx.y.z" -m "vx.y.z"`
 - `git push --tags origin master`
 - `git checkout dev`
 - `git merge master`
