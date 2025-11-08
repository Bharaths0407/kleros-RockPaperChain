import { toast } from "sonner";
import { isAddress } from "viem";
import { sepolia } from "viem/chains";
import { useSearchParams } from "react-router";
import { useEffect, useState, useCallback } from "react";
import { AlertCircle, CheckCircle, LoaderCircle } from "lucide-react";
import {
    useAccount,
    useReadContract,
    useWaitForTransactionReceipt,
    useWriteContract,
} from "wagmi";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { abi } from "@/constants/abi";
import { Move } from "@/constants/moveTypes";

import TimeOut from "./timeOut";
import SelectMove from "../players/components/selectMove";

const FIVE_MINUTES_SECONDS = 300;
const CHECK_TIMEOUT_INTERVAL_MS = 10000;

export default function GameOutcome() {
    const [searchParams] = useSearchParams();
    const contractAddress = searchParams.get("contractAddress");
    const { address, isConnected } = useAccount();
    const [move, setMove] = useState<Move>(Move.Null);
    const [salt, setSalt] = useState<number>(0);
    const [successToast, setSuccessToast] = useState(false);
    const [timedout, setIsTimedout] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const { writeContract, isPending, data: hash } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (!successToast && isSuccess) {
            setSuccessToast(true);
            toast.success(
                "Transaction confirmed! Winner will receive the pot amount."
            );
        }
    }, [isSuccess, successToast]);

    if (!contractAddress || !isAddress(contractAddress)) {
        return (
            <div className="min-h-screen bg-background p-8 flex items-center justify-center">
                <Alert className="border-red-200 bg-red-50 max-w-md">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800">Invalid Address</AlertTitle>
                    <AlertDescription className="text-red-700">
                        The contract address provided is invalid. Please check the URL and
                        try again.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const {
        data: firstPlayerAddr,
        isLoading: firstPlayerAddrLoading,
        error: firstPlayerAddrError,
    } = useReadContract({
        abi,
        address: contractAddress as `0x${string}`,
        chainId: sepolia.id,
        functionName: "j1",
    });

    const {
        data: secondPlayerAddr,
        isLoading: secondPlayerAddrLoading,
        error: secondPlayerAddrError,
    } = useReadContract({
        abi,
        address: contractAddress as `0x${string}`,
        chainId: sepolia.id,
        functionName: "j2",
    });

    const { data: lastActionTime } = useReadContract({
        abi,
        address: contractAddress as `0x${string}`,
        chainId: sepolia.id,
        functionName: "lastAction",
    });

    const { data: moveC2 } = useReadContract({
        abi,
        address: contractAddress as `0x${string}`,
        chainId: sepolia.id,
        functionName: "c2",
    });

    const isTimestampExpired = useCallback((timestamp: bigint): boolean => {
        const now = Math.floor(Date.now() / 1000);
        const timeDiff = now - Number(timestamp);
        return timeDiff >= FIVE_MINUTES_SECONDS;
    }, []);

    const checkTimeout = useCallback(() => {
        if (!lastActionTime || !address || !firstPlayerAddr || !secondPlayerAddr) {
            return;
        }

        const isFirstPlayer = address === firstPlayerAddr;
        const isSecondPlayer = address === secondPlayerAddr;

        const shouldTimeout = isFirstPlayer
            ? !moveC2
            : isSecondPlayer
                ? moveC2
                : false;

        if (shouldTimeout && isTimestampExpired(lastActionTime as bigint)) {
            setIsTimedout(true);
        }
    }, [
        lastActionTime,
        address,
        firstPlayerAddr,
        secondPlayerAddr,
        moveC2,
        isTimestampExpired,
    ]);

    useEffect(() => {
        if (timedout) return;

        checkTimeout();
        const interval = setInterval(checkTimeout, CHECK_TIMEOUT_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [timedout, checkTimeout]);

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-background p-8 flex items-center justify-center">
                <Alert className="border-blue-200 bg-blue-50 max-w-md">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800">
                        Wallet Not Connected
                    </AlertTitle>
                    <AlertDescription className="text-blue-700">
                        Please connect your wallet to participate in the game.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (firstPlayerAddrError || secondPlayerAddrError) {
        return (
            <div className="min-h-screen bg-background p-8 flex items-center justify-center">
                <Alert className="border-red-200 bg-red-50 max-w-md">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800">
                        Error Loading Contract
                    </AlertTitle>
                    <AlertDescription className="text-red-700">
                        Failed to load contract data. Please refresh and try again.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (firstPlayerAddrLoading || secondPlayerAddrLoading) {
        return (
            <div className="min-h-screen bg-background p-8 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <LoaderCircle className="h-8 w-8 animate-spin" />
                    <p className="text-gray-600">Loading contract data...</p>
                </div>
            </div>
        );
    }

    const isPlayerInGame =
        address === firstPlayerAddr || address === secondPlayerAddr;

    if (!isPlayerInGame) {
        return (
            <div className="min-h-screen bg-background p-8 flex items-center justify-center">
                <Alert className="border-blue-200 bg-blue-50 max-w-md">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800">Not Authorized</AlertTitle>
                    <AlertDescription className="text-blue-700">
                        You are not part of this game. Only the two players can participate.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const isFirstPlayer = address === firstPlayerAddr;
    const isSecondPlayer = address === secondPlayerAddr;

    const handleRevealMove = () => {
        if (move === Move.Null) {
            toast.error("Please select a valid move");
            return;
        }
        if (salt === 0) {
            toast.error("Please enter a valid salt value");
            return;
        }
        setShowConfirmDialog(true);
    };

    const confirmRevealMove = () => {
        writeContract({
            address: contractAddress as `0x${string}`,
            chainId: sepolia.id,
            abi,
            functionName: "solve",
            args: [move, salt],
        });
        setShowConfirmDialog(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                {isFirstPlayer && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Reveal Your Move</CardTitle>
                            <CardDescription>
                                Enter your move and salt to determine the winner
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label className="mb-2">Your Move</Label>
                                <SelectMove value={move} onValueChange={setMove} />
                            </div>

                            <div>
                                <Label htmlFor="salt" className="mb-2">
                                    Salt
                                </Label>
                                <p className="text-xs text-gray-500 mb-2">
                                    Enter the salt value you used when deploying the contract
                                </p>
                                <Input
                                    id="salt"
                                    type="text"
                                    placeholder="0"
                                    min={0}
                                    max={Number.MAX_SAFE_INTEGER}
                                    value={salt}
                                    onChange={(e) => {
                                        const num = Number(e.target.value);
                                        if (!isNaN(num) && num <= Number.MAX_SAFE_INTEGER) {
                                            setSalt(num);
                                        }
                                    }}
                                />
                            </div>

                            <div className="flex justify-center">
                                <Button
                                    onClick={handleRevealMove}
                                    disabled={isPending || isConfirming}
                                    size="lg"
                                >
                                    {isPending ? (
                                        <>
                                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : isConfirming ? (
                                        <>
                                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                            Confirming...
                                        </>
                                    ) : (
                                        "Reveal & Declare Result"
                                    )}
                                </Button>
                            </div>

                            <Alert className="border-blue-200 bg-blue-50">
                                <CheckCircle className="h-4 w-4 text-blue-600" />
                                <AlertTitle className="text-blue-800">How It Works</AlertTitle>
                                <AlertDescription className="text-blue-700 text-sm">
                                    Click "Reveal & Declare Result" to submit your move and salt.
                                    The winner will be determined and receive the pot
                                    automatically.
                                    <br />
                                    <br />
                                    If Player 2 hasn&apos;t moved after 5 minutes, use the timeout
                                    button below to claim the pot.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                )}

                {isSecondPlayer && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Waiting for Player 1</CardTitle>
                            <CardDescription>Awaiting move reveal</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Player 1 needs to reveal their move to determine the winner and
                                distribute the pot.
                            </p>
                            <p className="text-sm text-gray-600">
                                If more than 5 minutes have passed since you made your move and
                                you haven&apos;t received the pot, you can claim it using the
                                timeout button below.
                            </p>
                        </CardContent>
                    </Card>
                )}

                <TimeOut
                    contractAddress={contractAddress}
                    timeoutFunction={isFirstPlayer ? "j2Timeout" : "j1Timeout"}
                    isTimedOut={timedout}
                />
            </div>

            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Move Reveal</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to reveal your move? Once confirmed, this
                            action cannot be undone.
                            <br />
                            <br />
                            <span className="font-semibold text-primary">Move: {move}</span>
                            <br />
                            <span className="font-semibold text-primary">Salt: {salt}</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex justify-end gap-3">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmRevealMove}>
                            Confirm & Reveal
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
