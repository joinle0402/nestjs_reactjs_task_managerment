const FIELD_LABEL_METADATA = Symbol('fieldLabel');

const DEFAULT_FIELD_LABEL = 'Thông tin này';

export function FieldLabel(label: string): PropertyDecorator {
    return (target: object, propertyKey: string | symbol) => {
        Reflect.defineMetadata(FIELD_LABEL_METADATA, label, target, propertyKey);
    };
}

export function getFieldLabel(target: object | undefined, property: string): string {
    if (!target) {
        return DEFAULT_FIELD_LABEL;
    }

    const label: unknown = Reflect.getMetadata(FIELD_LABEL_METADATA, target, property);

    return typeof label === 'string' ? label : DEFAULT_FIELD_LABEL;
}
