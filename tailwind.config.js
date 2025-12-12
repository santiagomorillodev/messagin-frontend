/** @type {import('tailwindcss').Config} */
export const darkMode = 'class';
export const theme = {
    extend: {
        colors: {
            primary: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
            accent: 'rgb(var(--color-accent-rgb)  / <alpha-value>)',
            /* Si quieres exponer el hex sin soporte alpha:
               primaryHex: 'var(--color-primary-hex)'  */
        },
    },
};