// src/utils/fileParser.ts
import * as pdfjsLib from 'pdfjs-dist';
import ePub from 'epubjs';

// Use the CDN for the worker (or bundle it locally if needed)
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

export const parseFile = async (file: File): Promise<string> => {
  const fileType = file.type;

  if (fileType === 'application/pdf') {
    return parsePDF(file);
  } else if (fileType === 'application/epub+zip') {
    return parseEPUB(file);
  } else if (fileType === 'text/plain') {
    return parseText(file);
  } else {
    throw new Error('Unsupported file type');
  }
};

const parsePDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + ' ';
    }

    return fullText.trim();
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw error;
  }
};

const parseEPUB = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const book = ePub(arrayBuffer);
  let fullText = '';

  const contents = await book.loaded.spine;
  for (const item of (contents as any).items) {
    const doc = await item.load(book.load.bind(book));
    fullText += doc.documentElement.textContent || '';
  }

  return fullText.trim();
};

const parseText = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsText(file);
  });
};