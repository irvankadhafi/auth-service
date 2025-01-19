#!/bin/bash

# Generate gRPC code from .proto files
for file in proto/*.proto; do
  grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:./src/proto \
    --grpc_out=./src/proto \
    --plugin=protoc-gen-ts=./node_modules/ts-protoc-gen/bin/protoc-gen-ts \
    --ts_out=service=grpc-node:./src/proto \
    -I ./proto $file
done

# Remove ",omitempty" from generated files
find src/proto -name '*.js' -exec sed -i '' 's/,omitempty//g' {} +

# Replace 'grpc' with '@grpc/grpc-js' in generated files
# Handle various formats of require('grpc')
find src/proto -name '*.js' -exec sed -i '' -E 's/var grpc = require\(["'\'']grpc["'\'']\);*/var grpc = require("@grpc\/grpc-js");/g' {} +
find src/proto -name '*.js' -exec sed -i '' -E 's/const grpc = require\(["'\'']grpc["'\'']\);*/const grpc = require("@grpc\/grpc-js");/g' {} +
find src/proto -name '*.js' -exec sed -i '' -E 's/let grpc = require\(["'\'']grpc["'\'']\);*/let grpc = require("@grpc\/grpc-js");/g' {} +

# Handle various formats of import * as grpc from 'grpc'
find src/proto -name '*.js' -exec sed -i '' -E 's/import \* as grpc from ["'\'']grpc["'\''];/import \* as grpc from "@grpc\/grpc-js";/g' {} +
find src/proto -name '*.ts' -exec sed -i '' -E 's/import \* as grpc from ["'\'']grpc["'\''];/import \* as grpc from "@grpc\/grpc-js";/g' {} +