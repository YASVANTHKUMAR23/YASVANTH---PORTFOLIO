import React, { useState, useEffect, useRef } from 'react';

interface DebouncedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: string | number;
    onDebouncedChange: (value: string) => void;
    debounceTimeout?: number;
    textarea?: boolean;
}

export const DebouncedInput: React.FC<DebouncedInputProps> = ({
    value: initialValue,
    onDebouncedChange,
    debounceTimeout = 500,
    textarea = false,
    ...props
}) => {
    const [value, setValue] = useState(initialValue);
    const isInternalChange = useRef(false);

    useEffect(() => {
        // Only update from parent if we're not currently editing locally
        // or if the parent value changed significantly (e.g. reset/load).
        // However, in a collaborative/sync environment, we might want to respect parent always
        // unless focused? For now, we simple sync if we aren't "dirty" or if it differs.
        // Actually, properly: Sync only if the parent value is different from what we last
        // *sent* or if we just mounted.
        // Simplest approach: Just update local state when prop changes, BUT
        // we must avoid cursor jumps.
        // If the prop update came from OUR change, it matches.
        if (value !== initialValue && !isInternalChange.current) {
            setValue(initialValue);
        }
        isInternalChange.current = false;
    }, [initialValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        isInternalChange.current = true;
    };

    // Effect to trigger the debounced change
    useEffect(() => {
        const handler = setTimeout(() => {
            // Only trigger if it's different from the PROP value (to avoid loops)
            if (value !== initialValue) {
                onDebouncedChange(String(value));
            }
        }, debounceTimeout);

        return () => {
            clearTimeout(handler);
        };
    }, [value, debounceTimeout, initialValue, onDebouncedChange]);

    const Component = textarea ? 'textarea' : 'input';

    return (
        // @ts-ignore
        <Component
            {...props}
            value={value}
            onChange={handleChange}
        />
    );
};
