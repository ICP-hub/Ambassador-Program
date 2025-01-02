const production = process.env.NODE_ENV === "production" || false;
export const BASE_URL = production 
  ? "https://kgmyp-myaaa-aaaao-a3u4a-cai.icp0.io" 
  : "http://localhost:3000";

export const ENV = production ? "production" : "development";
