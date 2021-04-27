export interface AmazonModel {
    objectName: string;
    bucketName: String;
    downloadLink: string;

    data?: AmazonModel[];
    statusCode?: number;
    statusText?: string;
}