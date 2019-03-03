#!/usr/bin/env sh

set -e

grunt

cd ../dist

git init
git add -A
git commit -m "deploy"

git push -f https://github.com/alexy4744/shade-generator.git master:gh-pages

cd -