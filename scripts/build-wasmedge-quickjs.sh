#!/bin/bash

# Set default values
publish=false

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        --publish)
            publish=true
            shift
            ;;
        *)
            echo "Unknown option: $key"
            exit 1
            ;;
    esac
done

# Change to the project directory
cd packages/wasmedge-quickjs

# Execute the cargo build command
cargo build --target wasm32-wasi --release

# Move the artifact to the wasm folder
mkdir -p wasm
mv target/wasm32-wasi/release/wasmedge_quickjs.wasm wasm/wasmedge_quickjs.wasm

# Change back to the original directory
cd ..

# Publish if publish=true
if [ "$publish" = true ]; then
    npm publish
fi
