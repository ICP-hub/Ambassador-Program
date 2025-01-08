cargo build --release --target wasm32-unknown-unknown --package ICP_Ambassador_Program_backend

candid-extractor target/wasm32-unknown-unknown/release/ICP_Ambassador_Program_backend.wasm > src/ICP_Ambassador_Program_backend/ICP_Ambassador_Program_backend.did