
export class ResponseModel<T> {
    code: number = 0;
    message: string = "OK"; 
    detail: string | undefined; 
    dataModel: T | undefined; 
  }