import { ConsoleLogger } from '@nestjs/common';
export declare class MyLogger extends ConsoleLogger {
    log(message: any, ...optionalParams: any[]): void;
    error(message: any, stack?: string | object, context?: string): void;
    warn(message: any, ...optionalParams: any[]): void;
    debug(message: any, ...optionalParams: any[]): void;
    verbose(message: any, ...optionalParams: any[]): void;
}
