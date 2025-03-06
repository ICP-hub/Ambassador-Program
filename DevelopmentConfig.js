// const production = process.env.NODE_ENV === "production" || false;
const production = true;
export const BASE_URL = production
  ? "https://kgmyp-myaaa-aaaao-a3u4a-cai.icp0.io" // mainnet
  // ? "https://j4i2k-tyaaa-aaaap-qpwqq-cai.icp0.io"  // testnet
  : "http://localhost:3000";

export const DISCORD_INVITE_URL = "https://discord.gg/icpatlas";
export const DISCORD_SERVER_URL = "https://discord.com/channels/1055420671540330556/1085543064652754985";

export const DEFAULT_CURRENCY = "ckUSDC"; //ckUSDC
export const LEDGER_CANISTER_ID = "xevnm-gaaaa-aaaar-qafnq-cai"; //ckUSDC
// ICP Ledger Canister ID : ryjl3-tyaaa-aaaaa-aaaba-cai
