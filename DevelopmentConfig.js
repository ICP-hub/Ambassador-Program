// const production = process.env.NODE_ENV === "production" || false;
const production = false;
export const BASE_URL = production 
  ? "https://kgmyp-myaaa-aaaao-a3u4a-cai.icp0.io" 
  : "http://localhost:3000";

export const DISCORD_CLIENT_ID = production
 ? 1303682602825158676
 : 1297821230786940948;
export const ENV = production ? "production" : "development";

// dfx canister call --network ic g65yi-ciaaa-aaaao-a3vta-cai grant_permission '(record {permission = variant {Prepare}; to_principal = principal "6y7ne-r6mj6-f3ch3-ppd2a-e76j3-pncjq-jislm-7vqik-54bj6-tmfbe-yqe"})'
// dfx canister call --network ic g65yi-ciaaa-aaaao-a3vta-cai grant_permission '(record {permission = variant {Commit}; to_principal = principal "6y7ne-r6mj6-f3ch3-ppd2a-e76j3-pncjq-jislm-7vqik-54bj6-tmfbe-yqe"})'