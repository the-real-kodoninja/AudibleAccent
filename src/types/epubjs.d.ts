declare module 'epubjs' {
    interface Spine {
      items: Array<any>; // Adjust type as needed
    }
    export default function ePub(data: ArrayBuffer): any;
  }