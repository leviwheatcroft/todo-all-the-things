

## Docker

 - `yarn` or `npm`: install all the things
 - `yarn run build` or `npm run build`: build the client
 - `docker build . -f docker/Dockerfile -t tatt`
 - `docker run --rm -p 3000:3000 -d tatt`

## version

 - merge to master
 - update version in package.json
 - `yarn run build`
 - `git add . && git commit -m "bump & build"`
 - `git tag -a "vx.y.z" -m "vx.y.z"`
 - `git push --tags origin master`
 - `git checkout dev`
 - `git merge master`
