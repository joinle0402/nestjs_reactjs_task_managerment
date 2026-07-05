import { getFieldLabel } from '@/common/decorators/field-label.decorator';
import { VALIDATION_MESSAGES } from '@/common/validation/validation.messages';
import { getMetadataStorage, ValidationError } from 'class-validator';

function getConstraint1(error: ValidationError, constraintKey: string): string | number | undefined {
    if (!error.target) {
        return undefined;
    }

    const metadata = getMetadataStorage()
        .getTargetValidationMetadatas(error.target.constructor, '', false, false)
        .find((item) => item.propertyName === error.property && (item.name === constraintKey || item.type === constraintKey));

    const constraint1: unknown = metadata?.constraints?.[0];

    return typeof constraint1 === 'string' || typeof constraint1 === 'number' ? constraint1 : undefined;
}

export function formatValidationErrors(errors: ValidationError[]): Record<string, string> {
    return errors.reduce<Record<string, string>>((response, error) => {
        const constraintKey = Object.keys(error.constraints ?? {})[0];
        const label = getFieldLabel(error.target, error.property);
        const messageFactory = VALIDATION_MESSAGES[constraintKey];

        response[error.property] = messageFactory ? messageFactory(label, getConstraint1(error, constraintKey)) : `${label} không hợp lệ!`;

        return response;
    }, {});
}
