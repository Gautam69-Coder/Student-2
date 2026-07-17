import { extractText, getDocumentProxy } from 'unpdf';

export async function extractPdfText(url) {
    const response = await fetch(url);
    const buffer = new Uint8Array(await response.arrayBuffer());
    const pdf = await getDocumentProxy(buffer);
    const { text } = await extractText(pdf, { mergePages: true });
    return text;
}

// extractPdfText('https://res.cloudinary.com/gautamcloudinary/raw/upload/v1783743871/UserNotes/j01jmsrw0wglierruqgd.pdf')
//   .then(console.log);
