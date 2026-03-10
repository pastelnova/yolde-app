import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../../environments/environments';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const updatedReq = req.clone({
    url: req.url.startsWith('http')
      ? req.url
      : `${environment.baseUrl}${req.url}`,
  });
  return next(updatedReq);
};
