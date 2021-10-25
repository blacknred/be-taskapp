import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, timeout } from 'rxjs/operators';
import { REQUEST_TIMEOUT } from '../consts';
import { IResponse } from '../interfaces/response.interface';

@Injectable()
export class ProxyInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
  intercept(_: ExecutionContext, next: CallHandler): Observable<IResponse<T>> {
    const startAt = Date.now();

    return next.handle().pipe(
      // timeout
      timeout(REQUEST_TIMEOUT),
      // transform
      map<IResponse<T>, any>(({ status, ...payload }) => {
        // return zip(...reqs).pipe(map((resps) => ({ ...resps })));
        if (status !== HttpStatus.OK && status !== HttpStatus.CREATED) {
          throw new HttpException(payload, status);
        }

        return {
          ...payload,
          meta: {
            lat: Date.now() - startAt + 'ms',
          },
        };
      }),
    );
  }
}
