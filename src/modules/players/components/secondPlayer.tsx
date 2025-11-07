import { isAddress } from "viem";
import { sepolia } from "viem/chains";
import { useAccount, useReadContract } from "wagmi";
import { Link, useSearchParams } from "react-router";
import { AlertCircle, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";

import { abi } from "@/constants/abi";

import SecondMoveSelect from "../actions/secondMoveSelect";

export default function SecondPlayer() {
    const [searchParams] = useSearchParams();
    const contractAddress = searchParams.get("contractAddress");
    const { address, isConnected } = useAccount();

    if (!contractAddress) {
        return (
            <div className="bg-linear-to-br from-slate-50 to-slate-100 min-h-screen p-6 md:p-8">
                <div className="max-w-xl mx-auto">
                    <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertTitle className="text-red-900">
                            Invalid Game Link
                        </AlertTitle>
                        <AlertDescription className="text-red-800 text-sm">
                            Contract address not provided. Please use a valid game link.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className="bg-linear-to-br from-slate-50 to-slate-100 min-h-screen p-6 md:p-8">
                <div className="max-w-xl mx-auto">
                    <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertTitle className="text-red-900">
                            Wallet Not Connected
                        </AlertTitle>
                        <AlertDescription className="text-red-800 text-sm">
                            Please connect your wallet to proceed with the game.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    if (!isAddress(contractAddress)) {
        return (
            <div className="bg-linear-to-br from-slate-50 to-slate-100 min-h-screen p-6 md:p-8">
                <div className="max-w-xl mx-auto">
                    <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertTitle className="text-red-900">
                            Invalid Address
                        </AlertTitle>
                        <AlertDescription className="text-red-800 text-sm">
                            The contract address provided is invalid.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    return (
        <SecondMoveContent
            contractAddress={contractAddress}
            currentAddress={address}
        />
    );
}

function SecondMoveContent({
    contractAddress,
    currentAddress,
}: {
    contractAddress: string;
    currentAddress?: string;
}) {
    const {
        data: stakeAmountData,
        isLoading: stakeAmountIsLoading,
        error: stakeAmountFetchError,
    } = useReadContract({
        abi,
        address: contractAddress as `0x${string}`,
        chainId: sepolia.id,
        functionName: "stake",
    });

    const {
        data: player2Data,
        isLoading: player2Loading,
        error: player2Error,
    } = useReadContract({
        abi,
        address: contractAddress as `0x${string}`,
        chainId: sepolia.id,
        functionName: "j2",
    });

    if (stakeAmountFetchError || player2Error) {
        return (
            <div className="bg-linear-to-br from-slate-50 to-slate-100 min-h-screen p-6 md:p-8">
                <div className="max-w-xl mx-auto">
                    <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertTitle className="text-red-900">
                            Blockchain Error
                        </AlertTitle>
                        <AlertDescription className="text-red-800 text-sm">
                            Failed to fetch game data. Please try again later.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    if (stakeAmountIsLoading || player2Loading) {
        return (
            <div className="bg-linear-to-br from-slate-50 to-slate-100 min-h-screen p-6 md:p-8">
                <div className="max-w-xl mx-auto">
                    <Card className="border-slate-200 shadow-sm">
                        <CardContent className="pt-6">
                            <div className="animate-pulse space-y-4">
                                <div className="h-4 bg-slate-200 rounded w-3/4" />
                                <div className="h-4 bg-slate-200 rounded w-1/2" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (currentAddress !== player2Data) {
        return (
            <div className="bg-linear-to-br from-slate-50 to-slate-100 min-h-screen p-6 md:p-8">
                <div className="max-w-xl mx-auto">
                    <Alert className="border-blue-200 bg-blue-50">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <AlertTitle className="text-blue-900">
                            Not the Second Player
                        </AlertTitle>
                        <AlertDescription className="text-blue-800 text-sm">
                            You are not the designated second player for this game.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-linear-to-br from-slate-50 to-slate-100 p-6 md:p-8 min-h-screen">
            <div className="max-w-xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-xl font-bold text-slate-900 mb-2">
                        Join the Game
                    </h1>
                    <p className="text-muted-foreground">
                        Match your opponent's stake and make your move
                    </p>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="pt-6 space-y-5">
                        <Alert className="bg-accent border-input">
                            <AlertCircle className="h-4 w-4 text-primary" />
                            <AlertTitle className="text-primary">
                                Stake Amount
                            </AlertTitle>
                            <AlertDescription className="text-primary text-sm">
                                You need to match the opponent's stake of
                            </AlertDescription>
                        </Alert>

                        <SecondMoveSelect
                            ethToStake={stakeAmountData as bigint}
                            address={contractAddress as `0x${string}`}
                        />
                    </CardContent>
                </Card>

                <div className="flex gap-2 mt-6">
                    <Button
                        asChild
                        variant="default"
                        className="flex-1"
                        size="lg"
                    >
                        <Link
                            to={`/gameOutcome?contractAddress=${contractAddress}`}
                        >
                            View Results
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="icon"
                        className="lg"
                    >
                        <Link
                            target="_blank"
                            to={`/gameOutcome?contractAddress=${contractAddress}`}
                        >
                            <ArrowUpRight className="w-6 h-6 text-primary" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}