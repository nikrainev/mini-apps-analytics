export declare const validationPipeline: ({ validators, }: {
    validators: (() => Promise<any>)[];
}) => Promise<void>;
