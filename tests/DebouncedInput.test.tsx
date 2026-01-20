import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DebouncedInput } from '../components/ui/DebouncedInput';

describe('DebouncedInput', () => {
    it('should render input element', () => {
        render(
            <DebouncedInput
                value="initial"
                onDebouncedChange={() => { }}
                placeholder="test input"
            />
        );
        expect(screen.getByPlaceholderText('test input')).toBeInTheDocument();
    });

    it('should call onDebouncedChange after delay', async () => {
        const handleChange = jest.fn();
        render(
            <DebouncedInput
                value="initial"
                onDebouncedChange={handleChange}
                debounceTimeout={200}
            />
        );

        const input = screen.getByDisplayValue('initial');
        fireEvent.change(input, { target: { value: 'updated' } });

        // Should not act immediately
        expect(handleChange).not.toHaveBeenCalled();

        // Wait for debounce
        await waitFor(() => {
            expect(handleChange).toHaveBeenCalledWith('updated');
        }, { timeout: 300 });
    });
});
