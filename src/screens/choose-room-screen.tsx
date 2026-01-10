import { Input } from "@/uikits/input";

export function ChooseRoomScreen() {
    return (
        <div style={{
            padding: "2rem",
            maxWidth: "600px",
        }}>
            <Input placeholder="Enter room name or room code"
                style={{
                    width: "100%",
                }} />
        </div>
    )
}
