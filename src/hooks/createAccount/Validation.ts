import { instance } from '@/lib/api';

interface formData {
    id: string;
    password: string;
    name: string;
}

export interface ValidationResult {
    isIdValid?: boolean;
    isPwValid?: boolean;
    isNameValid?: boolean;
    isTotalValid?: boolean;
}

export const isDuplicatedId = async (id: string) => {
    try {
        const response = await instance.post('/check/id', { id: id });
        if (response) {
            const isDuplicated = Object.values(response);
            return isDuplicated[0];
        }
    } catch (e) {
        console.error(e);
    }
};

const isValidName = (name: string): boolean => 0 < name.length && name.length <= 20;
const isValidId = (id: string): boolean => /^[a-zA-Z0-9]+$/.test(id);
const isValidPassword = (password: string): boolean => password.length >= 5;

export const isValidForm = (formData: formData): ValidationResult => {
    const { id, name, password } = formData;

    const isNameValid: boolean = isValidName(name);
    const isIdValid: boolean = isValidId(id);
    const isPwValid: boolean = isValidPassword(password);

    const isTotalValid: boolean = isIdValid && isNameValid && isPwValid;

    return { isIdValid, isNameValid, isPwValid, isTotalValid };
};
