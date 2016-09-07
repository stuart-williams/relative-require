echo 'Generating mock project...'
mkdir -p mock-project

touch mock-project/package.json
echo '{"dependencies":{"foo":"0.0.1", "bar":"0.0.2", "baz":"0.0.3"}}' >> mock-project/package.json

mkdir -p mock-project/walk/a/b
touch mock-project/walk/foo-bar.js
touch mock-project/walk/bar-baz.js
touch mock-project/walk/a/foo-bar.jsx
touch mock-project/walk/a/foo-bar.json
touch mock-project/walk/a/foo-bar.py
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
