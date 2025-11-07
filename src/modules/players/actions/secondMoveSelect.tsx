import { toast } from "sonner";
import { sepolia } from "viem/chains";
import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, LoaderCircle } from "lucide-react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { abi } from "@/constants/abi";
import { Move } from "@/constants/moveTypes";

import SelectMove from "../components/selectMove";

const CHAIN_ID = sepolia.id;

interface SecondMoveSelectProps {
    address: `0x${string}`;
    ethToStake: bigint;
}

export default function SecondMoveSelect({
    address,
    ethToStake,
}: SecondMoveSelectProps) {
    const [selectedMove, setSelectedMove] = useState<Move>(Move.Null);
    const { writeContract, isPending, data: hash, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess, isError } = useWaitForTransactionReceipt({ hash });

    const isTransactionPending = isPending || isConfirming;

    useEffect(() => {
        if (isSuccess) {
            toast.success(
                "Transaction confirmed, you can now visit the results page"
            );
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isError) {
            toast.error("Transaction failed. Please try again.");
        }
    }, [isError]);

    function handleSubmitMove() {
        if (selectedMove === Move.Null) {
            toast.error("Please select a move before playing");
            return;
        }

        writeContract({
            address,
            chainId: CHAIN_ID,
            abi,
            functionName: "play",
            args: [selectedMove],
            value: ethToStake,
        });
    }

    return (
        <div className="mx-auto max-w-md space-y-4 p-5">
            <SelectMove
                value={selectedMove}
                onValueChange={setSelectedMove}
                aria-label="Select your move"
            />

            <Button
                onClick={handleSubmitMove}
                disabled={isTransactionPending}
                className="w-full"
                aria-busy={isTransactionPending}
            >
                {isPending && (
                    <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Sending transaction...
                    </>
                )}
                {isConfirming && (
                    <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Confirming transaction...
                    </>
                )}
                {!isTransactionPending && "Play"}
            </Button>

            {isSuccess && (
                <Alert className="border-blue-200 bg-blue-50">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800">Success!</AlertTitle>
                    <AlertDescription className="text-blue-700">
                        Move registered successfully! You can now visit the result page
                        using the button below.
                    </AlertDescription>
                </Alert>
            )}

            {error && (
                <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800">Error</AlertTitle>
                    <AlertDescription className="text-red-700">
                        { "An error occurred. Please try again."}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}