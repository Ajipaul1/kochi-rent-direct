import { Client, Account, Databases, ID } from "https://cdn.jsdelivr.net/npm/appwrite@14.0.0/+esm";

const client = new Client()
    .setEndpoint("https://sgp.cloud.appwrite.io/v1")
    .setProject("698b11d3000bb9f04eff");

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases, ID };
