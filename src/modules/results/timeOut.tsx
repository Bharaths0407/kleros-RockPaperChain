import { toast } from "sonner";
import { sepolia } from "viem/chains";
import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Clock, LoaderCircle } from "lucide-react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";


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

interface TimeoutComponentProps {
    contractAddress: `0x${string}`;
    timeoutFunction: string;
    isTimedOut: boolean;
}

export default function TimeOut({
    contractAddress,
    timeoutFunction,
    isTimedOut,
}: TimeoutComponentProps) {
    const { writeContract, isPending, data: hash } = useWriteContract();
    const { isSuccess, isLoading: isConfirming } = useWaitForTransactionReceipt(
        { hash }
    );
    const [successToast, setSuccessToast] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    useEffect(() => {
        if (!successToast && isSuccess) {
            setSuccessToast(true);
            toast.success("Timeout claimed successfully! Pot transferred.");
        }
    }, [isSuccess, successToast]);

    const handleTimeoutClick = useCallback(() => {
        setShowConfirmDialog(true);
    }, []);

    const confirmTimeout = useCallback(() => {
        writeContract({
            address: contractAddress,
            chainId: sepolia.id,
            abi,
            functionName: timeoutFunction,
            args: [],
        });
        setShowConfirmDialog(false);
    }, [writeContract, contractAddress, timeoutFunction]);

    if (!isTimedOut) {
        return null;
    }

    return (
        <>
            <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-900">
                        <Clock className="h-5 w-5" />
                        Timeout Available
                    </CardTitle>
                    <CardDescription>
                        The 5-minute timeout period has elapsed
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert className="border-blue-300 bg-background">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <AlertTitle className="text-blue-900">
                            Claim Your Pot
                        </AlertTitle>
                        <AlertDescription className="text-blue-800 text-sm">
                            Since the opponent hasn&apos;t completed their move
                            within 5 minutes, you can claim the pot by clicking
                            the button below.
                        </AlertDescription>
                    </Alert>

                    <Button
                        onClick={handleTimeoutClick}
                        disabled={isPending || isConfirming}
                        size="lg"
                        className="w-full"
                        variant="destructive"
                    >
                        {isPending ? (
                            <>
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                Sending transaction...
                            </>
                        ) : isConfirming ? (
                            <>
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                Confirming transaction...
                            </>
                        ) : (
                            "Claim Pot via Timeout"
                        )}
                    </Button>
                </CardContent>
            </Card>

            <AlertDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Timeout Claim</AlertDialogTitle>
                        <AlertDialogDescription>
                            You are about to claim the pot due to opponent
                            timeout. This action will transfer the pot to your
                            wallet. This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex justify-end gap-3">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmTimeout}>
                            Confirm & Claim Pot
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}