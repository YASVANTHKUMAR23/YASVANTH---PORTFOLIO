declare module 'https://esm.sh/clsx@1.2.1' {
  export type ClassValue = string | number | boolean | undefined | null | ClassValue[];
  export function clsx(...inputs: ClassValue[]): string;
  export default clsx;
}

declare module 'https://esm.sh/tailwind-merge@2.2.1' {
  export function twMerge(...classList: string[]): string;
  export default twMerge;
}
