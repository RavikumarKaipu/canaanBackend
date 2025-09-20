import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../utils/token.js';
export interface AuthRequest extends Request {
    user?: JwtPayload;
}
export declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=authMiddleware.d.ts.map