import { useEffect, useRef } from "react";

export function Input({ onFocus, onBlur, style, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (props.autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [props.autoFocus]);

    return (
        <input
            ref={inputRef}
            style={{
                border: "4px solid var(--input-border)",
                borderRadius: "0.5rem",
                padding: "0.5em 1em",
                fontSize: "1.5rem",
                fontWeight: 700,
                fontFamily: "inherit",
                color: "var(--input-text)",
                backgroundColor: "var(--input-bg)",
                boxShadow: "4px 4px 0 var(--input-shadow)",
                userSelect: "none",
                outline: "none",
                transition: "all 0.1s ease",
                ...style,
            }}
            onFocus={(e) => {
                if (inputRef.current) {
                    inputRef.current.style.border = "4px solid var(--input-border-focus)";
                }
                onFocus?.(e);
            }}
            onBlur={(e) => {
                if (inputRef.current) {
                    inputRef.current.style.border = "4px solid var(--input-border)";
                }
                onBlur?.(e);
            }}
            {...props}
        />
    )
}