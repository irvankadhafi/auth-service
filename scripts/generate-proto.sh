#!/bin/bash

for file in proto/*.proto; do
  grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:./src/proto \
    --grpc_out=grpc_js:./src/proto \
    --plugin=protoc-gen-grpc=./node_modules/.bin/grpc_tools_node_protoc_plugin \
    --ts_out=grpc_js:./src/proto \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    -I ./proto $file
done

find src/proto -name '*.js' -exec sed -i '' 's/,omitempty//g' {} +