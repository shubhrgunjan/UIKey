#!/bin/bash
echo "Installing UIKey CLI..."

# Since the package is not published to the public npm registry yet,
# we will clone the repository and link it globally.
INSTALL_DIR="$HOME/.uikey-cli"

if [ -d "$INSTALL_DIR" ]; then
  rm -rf "$INSTALL_DIR"
fi

echo "Cloning repository..."
git clone https://github.com/shubhrgunjan/UIKey.git "$INSTALL_DIR" --quiet

echo "Building UIKey CLI..."
cd "$INSTALL_DIR/packages/cli"
npm install --silent
npm run build --silent

echo "Linking CLI globally..."
npm link --silent

echo "✅ Installation complete! You can now use the 'uikey' command."
