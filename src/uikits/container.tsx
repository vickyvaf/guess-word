export function Container({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "2rem",
        }}>
            {children}
        </div>
    )
}