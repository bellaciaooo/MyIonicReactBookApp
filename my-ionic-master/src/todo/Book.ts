export interface Book {
    _id?: string;
    title: string;
    author: string;
    date: string;
    pages: string;
    awarded: boolean;
    isNotSaved?: boolean;
    webViewPath?: string;
    latitude?:number;
    longitude?:number;
}