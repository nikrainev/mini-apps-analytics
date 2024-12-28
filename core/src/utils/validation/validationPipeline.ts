import { BadRequestException } from '@nestjs/common';

export const validationPipeline = async ({
    validators,
}:{ validators: (() =>  Promise<any>)[] }) => {
    const validationResult = await Promise.all(validators.map((v) => v()));

    const errors = validationResult.filter((e) => e);

    if (errors.length > 0) {
        throw new BadRequestException(errors);
    }
};
