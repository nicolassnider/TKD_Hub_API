import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";

let connection: HubConnection | null = null;

export const initializeSignalR = async () => {
    console.log("[SignalR] Initializing connection...");
    connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7046/paymentHub")
        .withAutomaticReconnect()
        .build();

    try {
        await connection.start();
        console.log("[SignalR] Connection established.");
    } catch (error) {
        console.error("[SignalR] Error establishing connection:", error);
    }
};

export const onPaymentReceived = (callback: (data: number | string) => void) => {
    if (connection) {
        console.log("[SignalR] Subscribing to PaymentReceived event.");
        connection.on("PaymentReceived", (data: number | string) => {
            console.log("[SignalR] PaymentReceived event received:", data);
            callback(data);
        });
    } else {
        console.error("[SignalR] Connection is not initialized. Cannot subscribe to PaymentReceived.");
    }
};

export const stopSignalR = async () => {
    if (connection) {
        try {
            await connection.stop();
            console.log("[SignalR] Connection stopped.");
        } catch (error) {
            console.error("[SignalR] Error stopping connection:", error);
        }
    } else {
        console.log("[SignalR] No connection to stop.");
    }
};
