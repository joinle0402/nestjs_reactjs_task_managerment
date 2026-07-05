type ValidationMessageFactory = (label: string, constraint1?: string | number) => string;

export const VALIDATION_MESSAGES: Record<string, ValidationMessageFactory> = {
    isNotEmpty: (label) => `${label} không được để trống!`,
    isEmail: (label) => `${label} không đúng định dạng!`,
    minLength: (label, constraint1) => `${label} phải có ít nhất ${constraint1} ký tự!`,
    maxLength: (label, constraint1) => `${label} không được vượt quá ${constraint1} ký tự!`,
    isString: (label) => `${label} phải là chuỗi!`,
    isNumber: (label) => `${label} phải là số!`,
    isInt: (label) => `${label} phải là số nguyên!`,
    isBoolean: (label) => `${label} phải là đúng hoặc sai!`,
};
