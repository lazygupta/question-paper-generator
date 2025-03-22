// utils/extractText.js
import { parseOfficeAsync } from "officeparser";

export default async function extractTextFromFile(path) {
  try {
    const data = await parseOfficeAsync(path);
    return data.toString();
  } catch (error) {
    return error;
  }
}