import {
	HttpInterceptor,
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * Class to add jwt token to all http requests
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
	constructor(private authService: AuthService) {}
	//intercept request
	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		// add authorization header with jwt token if available
		const currentUser = this.authService.currentUserValue;
		console.log("intercepted request")
		if (currentUser && currentUser.access_token) {
			request = request.clone({
				setHeaders: {
					Authorization: `Bearer ${currentUser.access_token}`
				}
			});
		}

		return next.handle(request);
	}
}

export const jwtInterceptorProvider = {
	provide: HTTP_INTERCEPTORS,
	useClass: JwtInterceptor,
	multi: true
};
