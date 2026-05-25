
import {
  _Object,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || "eu-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});


const S3_BUCKET = process.env.AWS_S3_BUCKET || "";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "application/pdf",
  "application/json",
];

export interface UploadedFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
}

export interface UploadResult {
  key: string;
  url: string;
  filename: string;
}

function jsonToUploadedFile(
  json: unknown,
  filename = 'checklist.json'
): UploadedFile {
  const buffer = Buffer.from(JSON.stringify(json, null, 2))

  return {
    name: filename,
    originalname: filename,
    mimetype: 'application/json',
    size: buffer.length,
    buffer,
    encoding: '7bit',
    tempFilePath: '',
    truncated: false,
    mv: async () => { }
  } as UploadedFile
}


export class S3Service {

  /**
   * Delete a file from S3
   * @param key - The S3 object key
   */
  static async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    });

    await s3Client.send(command);
  }

  /**
   * Get the public URL for a file
   * @param key - The S3 object key
   * @returns The public URL
   */
  static getFileUrl(key: string): string {
    // If using CloudFront or custom domain, adjust accordingly
    return `https://${S3_BUCKET}.s3.${process.env.AWS_REGION || "eu-west-1"}.amazonaws.com/${key}`;
  }

  /**
   * Validate file before upload
   * @param file - The file to validate
   * @returns Validation result
   */
  static validateFile(file: UploadedFile): { valid: boolean; error?: string } {
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: `File size exceeds maximum limit of 3MB` };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
      };
    }

    return { valid: true };
  }

  /**
   * Get file type category from MIME type
   * @param mimetype - The file MIME type
   * @returns 'image' or 'video'
   */
  static getFileTypeFromMime(mimetype: string): "image" | "video" {
    if (mimetype.startsWith("video/")) {
      return "video";
    }
    return "image";
  }

  /**
   * Extract S3 key from a full S3 URL
   * @param url - The full S3 URL (e.g., https://bucket.s3.region.amazonaws.com/key/path)
   * @returns The S3 object key (e.g., key/path)
   */
  static extractKeyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      // Remove leading slash from pathname
      const key = urlObj.pathname.startsWith("/")
        ? urlObj.pathname.substring(1)
        : urlObj.pathname;
      return key || null;
    } catch {
      return null;
    }
  }

  /**
   * Delete a file from S3 using the full URL
   * @param url - The full S3 URL
   */
  static async deleteFileByUrl(url: string): Promise<void> {
    const key = this.extractKeyFromUrl(url);
    if (key) {
      await this.deleteFile(key);
    }
  }

  /**
   * Get a file from S3
   * @param key - The S3 object key
   * @returns File stream with content type and length
   */
  static async getFile(key: string): Promise<{
    body: Readable;
    contentType: string;
    contentLength: number;
  }> {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    });

    const response = await s3Client.send(command);

    return {
      body: response.Body as Readable,
      contentType: response.ContentType || "application/octet-stream",
      contentLength: response.ContentLength || 0,
    };
  }

  static async listAllObjects() {
    let continuationToken: string | undefined = undefined
    let isTruncated = true

    const allObjects: _Object[] = []

    while (isTruncated) {
      const input: ListObjectsV2CommandInput = {
        Bucket: process.env.AWS_S3_BUCKET!,
        ContinuationToken: continuationToken
      }

      const command = new ListObjectsV2Command(input)

      const response = await s3Client.send(command)

      if (response.Contents) {
        allObjects.push(...response.Contents)
      }

      isTruncated = response.IsTruncated ?? false
      continuationToken = response.NextContinuationToken
    }

    return allObjects
  }
  /**
   * Generate a pre-signed URL for a file in S3
   * @param fileName - File name including extension
   * @param folder - File name including extension
   * @param expiresIn - URL expiration time in seconds (default 1 hour)
   * @returns Pre-signed URL for direct access to the file
   */
  static async getPreSignedUrl({ fileName, folder, expiresIn = 3600 }: {
    fileName: string,
    folder: string,
    expiresIn?: number
  }): Promise<string> {

    // Generate unique filename
    const key = `${folder}/${fileName}`;
    // When storing or generating the key, normalize spaces before passing to S3
    const normalizedKey = key.replace(/\s+/g, '_');
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: normalizedKey,
    });
    return getSignedUrl(s3Client, command, { expiresIn });
  }
}

