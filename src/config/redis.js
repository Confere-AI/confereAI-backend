import { createClient } from 'redis';

const client = createClient(6379);
client.on("error", err => console.log("Redis Error", err));
await client.connect();

await client.set("ra", "paz");
const value = await client.get("ra");

console.log(value);
export default client;