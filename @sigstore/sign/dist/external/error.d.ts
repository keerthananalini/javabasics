import fetch from 'make-fetch-happen';
type Response = Awaited<ReturnType<typeof fetch>>;
export declare class HTTPError extends Error {
    statusCode: number;
    location?: string;
    constructor({ status, message, location, }: {
        status: number;
        message: string;
        location?: string;
    });
}
export declare const checkStatus: (response: Response) => Promise<Response>;
export {};
