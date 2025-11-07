import { useState, useEffect } from "react";
import { RefreshCw, CheckCheck, LoaderCircle, Copy, Check, ArrowUpRight, LoaderPinwheel, AlertCircle, BadgeAlert } from "lucide-react";

import { Link } from "react-router";
import { useForm } from "react-hook-form";


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
} from "@/components/ui/form";

import SelectMove from "./selectMove";
import { useFirstPlayerLogic } from "../actions/firstPlayerLogic";


interface CopyButtonProps {
    text: string;
    label?: string;
}

function CopyButton({
    text,
    label = "Copy",
}: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;

        const timer = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(timer);
    }, [copied]);

    const handleCopy = async () => {
        if (!text) {
            console.error("Text to copy is empty");
            return;
        }

        try {
            const url = `${window.location.origin}/${text}`;
            await navigator.clipboard.writeText(url);
            setCopied(true);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <Button
            onClick={handleCopy}
            variant="outline"
            size="lg"
            className="gap-2"
        >
            {copied ? (
                <>
                    <Check className="h-4 w-4" />
                    Copied!
                </>
            ) : (
                <>
                    <Copy className="h-4 w-4" />
                    {label}
                </>
            )}
        </Button>
    );
}

function SaltCopyButton({ salt }: { salt: number }) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const timer = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(timer);
    }, [copied]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(salt.toString());
            setCopied(true);
        } catch (err) {
            console.error("Failed to copy salt:", err);
        }
    };

    return (
        <Button
            onClick={handleCopy}
            variant="ghost"
            size="sm"
            className="h-8 gap-1"
        >
            {copied ? (
                <>
                    <Check className="h-3 w-3" />
                    Copied!
                </>
            ) : (
                <>
                    <Copy className="h-3 w-3" />
                    Copy Salt
                </>
            )}
        </Button>
    );
}

export default function FirstPlayer() {
    const {
        isConnected,
        isSecondPlayer,
        setIsSecondPlayer,
        isMove,
        setIsMove,
        stakeAmount,
        setStakeAmount,
        isSalt,
        setIsSalt,
        contractAddress,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        handleDeploy,
    } = useFirstPlayerLogic();

    const form = useForm({
        defaultValues: {
            move: "",
            opponent: isSecondPlayer,
            stake: stakeAmount,
            salt: isSalt,
        },
    });

    useEffect(() => {
        if (isSalt === 0) {
            const randomSalt = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
            setIsSalt(randomSalt);
        }
    }, [isSalt, setIsSalt]);

    const handleReset = () => {
        setIsSecondPlayer("");
        setStakeAmount("");
        const newSalt = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        setIsSalt(newSalt);
    };

    return (
        <div className="bg-linear-to-br from-slate-50 to-slate-100 p-6 md:p-8">
            <div className="max-w-xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        Start the Game
                    </h1>
                    <p className="text-muted-foreground">
                        Set up your game and challenge an opponent
                    </p>
                </div>

                <Form {...form}>
                    <Card className="border-slate-200 shadow-sm">
                        <CardContent className="pt-6 space-y-5">
                            <FormItem>
                                <FormControl>
                                    <SelectMove  value={isMove} onValueChange={setIsMove}  />
                                </FormControl>
                            </FormItem>

                            <FormItem>
                                <FormLabel className="text-slate-700">
                                    Opponent Address
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        value={isSecondPlayer}
                                        onChange={(e) => setIsSecondPlayer(e.target.value)}
                                        placeholder="0x..."
                                        className="font-mono text-sm"
                                    />
                                </FormControl>
                            </FormItem>

                            <FormItem>
                                <FormLabel className="text-slate-700">
                                    Stake Amount (ETH)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="string"
                                        value={stakeAmount}
                                        onChange={(e) => setStakeAmount(e.target.value)}
                                        placeholder="0.01"
                                        className="font-mono"
                                    />
                                </FormControl>
                            </FormItem>

                            <FormItem>
                                <div className="flex items-center justify-between mb-1">
                                    <FormLabel className="text-slate-700">
                                        Your Salt (Auto-Generated)
                                    </FormLabel>
                                    <SaltCopyButton salt={isSalt} />
                                </div>
                                <FormDescription className="text-xs text-primary mb-1">
                                    ⚠️ IMPORTANT: Copy and save this salt! You'll need it to reveal your move later.
                                </FormDescription>
                                <FormControl>
                                    <Input
                                        type="text"
                                        value={isSalt}
                                        readOnly
                                        className="font-mono bg-slate-50 cursor-not-allowed"
                                    />
                                </FormControl>
                            </FormItem>

                            <Alert className="bg-accent border-input">
                                <BadgeAlert className="h-4 w-4 text-primary" />
                                <AlertTitle className="text-primary">Info - Save Your Salt!</AlertTitle>
                                <AlertDescription className="text-primary text-sm">
                                    Without your salt, you won't be able to reveal your move and complete the game. Make sure to copy it before proceeding!
                                </AlertDescription>
                            </Alert>
                            
                        <div className="flex gap-2">
                            <Button
                                onClick={handleDeploy}
                                variant="default"
                                disabled={isPending || isConfirming || !isConnected}
                                className="flex-1"
                                size="lg"
                            >
                                {isPending || isConfirming ? (
                                    <>
                                        <LoaderCircle  className="mr-2 h-4 w-4 animate-spin" />
                                        {isPending ? "Deploying..." : "Confirming..."}
                                    </>
                                ) : (
                                    "Deploy the Game Contract"
                                )}
                            </Button>
                            {!isPending && !isConfirming && (
                                    <Button
                                        type="button"
                                        onClick={handleReset}
                                        variant="outline"
                                        size="lg"
                                        className="gap-2"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>
                            )}
                        </div>
                        {!isConnected && (
                                <Alert className="border-input bg-accent">
                                    <AlertCircle className="h-4 w-4 text-primary" />
                                    <AlertTitle className="text-primary">
                                        Wallet Not Connected
                                    </AlertTitle>
                                    <AlertDescription className="text-primary text-sm">
                                        Please connect your wallet to deploy the game contract.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </Form>

                {hash && (
                    <Card className="mt-6 border-slate-200 shadow-sm">
                        <CardContent className="pt-6 space-y-4">
                            {isConfirming && (
                                <Alert className="border-chart-3 bg-primary/25">
                                    <LoaderPinwheel className="h-4 w-4 text-primary/50 animate-bounce"/>
                                    <AlertTitle className="text-primary">
                                        Confirming transaction...
                                    </AlertTitle>
                                    <div className="mt-2 h-1 w-full bg-accent rounded-full overflow-hidden">
                                        <div className="h-full w-1/2 bg-ring rounded-full animate-pulse" />
                                    </div>
                                </Alert>
                            )}

                            {isSuccess && contractAddress && (
                                <>
                                    <Alert className="border-blue-200 bg-blue-50">
                                        <CheckCheck  className="h-4 w-4 text-blue-600" />
                                        <AlertTitle className="text-blue-900">
                                            Game Created!
                                        </AlertTitle>
                                        <AlertDescription className="text-blue-800 text-sm">
                                            Share the link below with your opponent to start
                                            playing.
                                        </AlertDescription>
                                    </Alert>

                                    <Alert className="border-blue-200 bg-blue-50">
                                        <BadgeAlert className="h-4 w-4 text-blue-600" />
                                        <AlertTitle className="text-blue-900">
                                            Don't Forget Your Salt!
                                        </AlertTitle>
                                        <AlertDescription className="text-blue-800 text-sm space-y-2">
                                            <p>Your Salt: <span className="font-mono font-bold">{isSalt}</span></p>
                                            <SaltCopyButton salt={isSalt} />
                                        </AlertDescription>
                                    </Alert>

                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <CopyButton
                                                text={`secondPlayer?contractAddress=${contractAddress}`}
                                                label="Copy Game Link"
                                            />
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="icon"
                                                
                                            >
                                                <Link
                                                    target="_blank"
                                                    to={`/secondPlayer?contractAddress=${contractAddress}`}
                                                >
                                                    <ArrowUpRight className="w-4 h-4 text-primary" />
                                                </Link>
                                            </Button>
                                        </div>
                                        <Button
                                            asChild
                                            variant="default"
                                            className="w-full"
                                        >
                                            <Link
                                                to={`/gameOutcome?contractAddress=${contractAddress}`}
                                            >
                                                View Result Page
                                            </Link>
                                        </Button>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}