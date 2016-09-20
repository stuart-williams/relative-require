echo 'Generating mock project...'
mkdir -p mock-project

touch mock-project/package.json
echo '{"dependencies":{"foo":"0.0.1", "bar":"0.0.2", "baz":"0.0.3"}, "devDependencies": {"fooBar": "0.0.1"}}' >> mock-project/package.json

mkdir -p mock-project/walk/a/b
mkdir -p mock-project/walk/.hidden
mkdir -p mock-project/walk/node_modules
mkdir -p mock-project/walk/good-index
mkdir -p mock-project/walk/bad-index
touch mock-project/walk/.hidden/a.js
touch mock-project/walk/node_modules/a.js
touch mock-project/walk/good-index/index.js
touch mock-project/walk/bad-index/index.html
touch mock-project/walk/foo-bar.js
touch mock-project/walk/a/foo-bar.jsx
touch mock-project/walk/a/foo-bar.json
touch mock-project/walk/a/foo-bar.html
touch mock-project/walk/a/b/foo-bar.js
touch mock-project/walk/a/b/fooBar.js
touch mock-project/walk/a/b/foo_bar.js
touch mock-project/walk/package.json
echo '{"dependencies":{"foo":"0.0.1", "bar":"0.0.2", "baz":"0.0.3"}}' >> mock-project/walk/package.json

mkdir -p mock-project/editor
touch mock-project/editor/active.js
touch mock-project/editor/target1.js
touch mock-project/editor/target2.jsx
touch mock-project/editor/target3.json
touch mock-project/editor/package.json
echo '{"dependencies":{"foo":"0.0.1", "bar":"0.0.2", "baz":"0.0.3"}}' >> mock-project/editor/package.json
