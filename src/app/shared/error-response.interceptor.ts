import { HttpErrorResponse, HttpInterceptor, HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";

export const ErrorResponseInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(catchError(handleErrorResponse))


function handleErrorResponse(error: HttpErrorResponse) {
  console.log('MyError', error);
  const errorResponse = `Error status ${error.status}, message:  ${error.message} `
  return throwError( () => 'Error');
}
