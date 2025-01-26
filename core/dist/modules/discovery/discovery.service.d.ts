import { Model } from 'mongoose';
import { AppCenterQueryDocument } from 'schemas/appCenterQuery.scheme';
import { AppPathDocument } from 'schemas/appPath.scheme';
export declare class DiscoveryService {
    private appCenterQuery;
    private appPath;
    constructor(appCenterQuery: Model<AppCenterQueryDocument>, appPath: Model<AppPathDocument>);
    handleCron(): Promise<void>;
}
