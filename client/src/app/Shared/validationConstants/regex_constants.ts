import { AbstractControl } from "@angular/forms";

export const regex = {
    emailRegex      : '^(\\w{2,})+@([a-zA-Z_]{3,})+?\\.[a-zA-Z]{2,3}$',
    nameValidator   : '^(\\b(?:([A-Za-z0-9])(?!\\2{2}))+\\b)$',
    numberValidator : '^((\\+91-?)|0)?([6-9]\\d{9}$)',
    passwordRegex   : '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
}

