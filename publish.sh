ng build --prod;
cp ./404.html ./dist/today-ng/404.html;
git add dist --force;
git commit -m "demo: build demo";
git subtree push --prefix dist/today-ng origin gh-pages;
