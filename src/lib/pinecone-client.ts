import { Pinecone } from "@pinecone-database/pinecone";

import { env } from "./config";
import { delay } from "./utils";

let pineconeClientInstance: Pinecone | null = null;

// Create pineconeIndex if it doesn't exist
async function createIndex(client: Pinecone, indexName: string) {
  try {
    // const indexExists = await client.describeIndex("yourlawyer");
    // if (indexExists) {
    //   console.log("Pinecone index already exists.");
    // } else {
    await client.createIndex({
      name: indexName,
      dimension: 1536,
      spec: { serverless: { cloud: "aws", region: "us-east-1" } },
    });
    console.log(
      `Waiting for ${env.INDEX_INIT_TIMEOUT} seconds for index initialization to complete...`
    );
    await delay(env.INDEX_INIT_TIMEOUT);
    console.log("Index created !!");
    // }
  } catch (error) {
    console.error("error ", error);
    throw new Error("Index creation failed");
  }
}

// Initialize index and ready to be accessed.
async function initPineconeClient() {
  try {
    const pineconeClient = new Pinecone({
      apiKey: env.PINECONE_API_KEY!,
    });
    const indexName = env.PINECONE_INDEX_NAME;
    console.log(`env.PINECONE_INDEX_NAME is ${env.PINECONE_INDEX_NAME}`);
    const indexExists = await pineconeClient.describeIndex(indexName);

    if (indexExists) {
      console.log("Pinecone index already exists.");
    } else {
      createIndex(pineconeClient, indexName);
    }
    return pineconeClient;
  } catch (error) {
    console.error("error", error);
    throw new Error("Failed to initialize Pinecone Client");
  }
}

export async function getPineconeClient() {
  if (!pineconeClientInstance) {
    pineconeClientInstance = await initPineconeClient();
  }
  console.log(`pineconeClientInstance ${pineconeClientInstance}`);
  return pineconeClientInstance;
}
