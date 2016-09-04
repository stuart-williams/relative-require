echo 'Generating mock project...'
mkdir -p .mock-project/one/two/three
touch .mock-project/foo-bar.js
touch .mock-project/foo-bar.json
touch .mock-project/bar-baz.js
touch .mock-project/one/fooBar.jsx
touch .mock-project/one/barBaz.js
touch .mock-project/one/two/foo_bar.js
touch .mock-project/one/two/three/foo-bar.js
touch .mock-project/one/two/three/foo-bar.py
rm .mock-project/package.json
touch .mock-project/package.json
echo '{"dependencies":{"foo":"0.0.1", "bar":"0.0.2", "baz":"0.0.3"}}' >> .mock-project/package.json
