// src/utils/fileParser.ts
import * as pdfjsLib from 'pdfjs-dist';
import ePub from 'epubjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export const parseFile = async (file: File): Promise<string> => {
  const fileType = file.type;
  console.log('Parsing file of type:', fileType);

  if (fileType === 'application/pdf') {
    return parsePDF(file);
  } else if (fileType === 'application/epub+zip') {
    return parseEPUB(file);
  } else if (fileType === 'text/plain') {
    return parseText(file);
  } else {
    throw new Error(`Unsupported file type: ${fileType}`);
  }
};

const parsePDF = async (file: File): Promise<string> => {
  try {
    console.log('Starting PDF parsing...');
    const arrayBuffer = await file.arrayBuffer();
    console.log('PDF arrayBuffer size:', arrayBuffer.byteLength);
    if (arrayBuffer.byteLength === 0) {
      throw new Error('PDF file is empty');
    }
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    console.log('PDF loaded, pages:', pdf.numPages);
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str || '').join(' ');
      console.log(`Page ${i} text:`, pageText);
      fullText += pageText + '\n';
    }

    console.log('PDF parsed text:', fullText);
    if (!fullText.trim()) {
      console.warn('Parsed PDF text is empty');
    }
    return fullText.trim();
  } catch (error: any) {
    console.error('PDF parsing error:', error);
    throw new Error(`Failed to parse PDF: ${error.message || 'Unknown error'}`);
  }
};

const parseEPUB = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const book = ePub(arrayBuffer);
    let fullText = '';

    const contents = await book.loaded.spine;
    for (const item of (contents as any).items) {
      const doc = await item.load(book.load.bind(book));
      fullText += doc.documentElement.textContent || '';
    }

    console.log('EPUB parsed text:', fullText);
    return fullText.trim();
  } catch (error: any) {
    console.error('EPUB parsing error:', error);
    throw new Error(`Failed to parse EPUB: ${error.message || 'Unknown error'}`);
  }
};

const parseText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      console.log('Text file parsed:', result);
      resolve(result);
    };
    reader.onerror = () => reject(new Error('Failed to read text file'));
    reader.readAsText(file);
  });
};