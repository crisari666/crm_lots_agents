export class FileUtils {

  static async dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {    
    const res: Response = await fetch(dataUrl);
    const blob: Blob = await res.blob();
    const type = FileUtils.getMimeTypeFromBase64Url(dataUrl);
    
    const file = new File([blob], fileName, { type: type! });
    return  file
  }

  static getMimeTypeFromBase64Url(dataUrl: string): string | null{
    const regex = /^data:(.+?);base64,/; // Regular expression to extract MIME type
    const match = dataUrl.match(regex); // Use match method to find the MIME type
  
    if (match && match.length > 1) {
      return match[1]; // Return the MIME type if found
    } else {
      return null; // Return null if no MIME type is found
    }
  }


}