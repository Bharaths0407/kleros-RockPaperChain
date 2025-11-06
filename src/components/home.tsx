import { WalletConnector } from "@/modules/wallet/components/walletConnector";

export const Home = () => {
    return (
        <div className="relative ">
            <div className="flex justify-center items-center pt-8">
                <h1 className="text-4xl font-bold text-primary">
                    RockPaperChain
                </h1>
                <div className="absolute right-11">
                    <WalletConnector />
                </div>
            </div>
        </div>
    );
};