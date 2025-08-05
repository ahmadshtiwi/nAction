export class Result<T = any>  {
    data!: T;
    isSuccess : boolean ;
    messages : string ;
    error : string;
}