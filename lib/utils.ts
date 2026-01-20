import { clsx, type ClassValue } from 'https://esm.sh/clsx@1.2.1';
import { twMerge } from 'https://esm.sh/tailwind-merge@2.2.1';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
