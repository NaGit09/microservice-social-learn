import { Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/JwtPayload';
declare const JwtRefreshStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    constructor();
    validate(payload: JwtPayload): {
        userId: string;
        username: string;
    };
}
export {};
