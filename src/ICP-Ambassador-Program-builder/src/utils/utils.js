export const formatTokenMetaData = (arr) => {
    const resultObject = {};
    arr.forEach((item) => {
      const key = item[0];
      const value = item[1][Object.keys(item[1])[0]]; // Extracting the value from the nested object
      resultObject[key] = value;
    });
    return resultObject;
  };

  export function stringToSubaccountBytes(str) {
    // Create a Uint8Array of 32 bytes (the standard subaccount size)
    const bytes = new Uint8Array(32);
    
    // Convert the string to UTF-8 bytes
    const encoder = new TextEncoder();
    const stringBytes = encoder.encode(str);
    
    // Copy the string bytes into the subaccount bytes, up to 32 bytes
    bytes.set(stringBytes.slice(0, 32));
    
    return Array.from(bytes); // Convert Uint8Array to regular array
  }
  