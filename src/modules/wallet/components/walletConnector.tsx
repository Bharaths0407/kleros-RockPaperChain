import { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const truncateWalletAddress = (addr: string) => {
    return addr.slice(0, 6) + "..." + addr.slice(-4);
};

export function WalletConnector() {
    const { connectors, connect } = useConnect();
    const { isConnected, address } = useAccount();
    const { disconnect } = useDisconnect();

    const metaMaskConnector = connectors.find(
        (c) => c.name === "MetaMask"
    );

    return (
        <div>
            {isConnected && address ? (
                <WalletAddress
                    address={address}
                    onDisconnect={disconnect}
                />
            ) : metaMaskConnector ? (
                <Button
                    onClick={() => connect({ connector: metaMaskConnector })}
                    className="rounded-xl w-40 h-11 text-md"
                >
                    Connect Wallet
                </Button>
            ) : (
                <p className="text-md text-red-500">
                    MetaMask not found
                </p>
            )}
        </div>
    );
}

function WalletAddress({
    address,
    onDisconnect,
}: {
    address: `0x${string}`;
    onDisconnect: () => void;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const handleDisconnect = () => {
        try {
            onDisconnect();
        } catch (error) {
            console.error("Disconnect failed:", error);
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    className="rounded-xl w-40 h-11 flex items-center justify-center gap-2"
                    title={address}
                >
                    {truncateWalletAddress(address)}
                    <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : "" }`}
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                    onClick={handleDisconnect}
                    className="cursor-pointer h-11 flex items-center gap-2"
                >
                    <LogOut className="w-4 h-4 text-red-500 mr-2" />
                    Disconnect
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};