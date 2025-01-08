const production = import.meta.env.NODE_ENV === "development" || false;
export const BASE_URL = production 
  ? "https://kgmyp-myaaa-aaaao-a3u4a-cai.icp0.io" 
  : "http://localhost:3000";

export const DISCORD_CLIENT_ID = production
 ? 1303682602825158676
 : 1297821230786940948;
export const ENV = production ? "production" : "development";
//http://localhost:3000