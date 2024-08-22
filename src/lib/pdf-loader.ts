import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { env } from "./config";
import path from "path";

export async function getChunkedDocsFromPDF() {
  try {
    const filePath = path.join(process.cwd(), "public", "docs", "requests.pdf");
    const loader = new PDFLoader(filePath);
    console.log(`env.PDF_PATH is ${env.PDF_PATH}`);
    const docs = await loader.load();

    // From the docs https://www.pinecone.io/learn/chunking-strategies/
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    console.log(`docs is ${docs}`);
    const chunkedDocs = await textSplitter.splitDocuments(docs);

    return chunkedDocs;
  } catch (e) {
    console.error(e);
    throw new Error("PDF docs chunking failed !");
  }
}
