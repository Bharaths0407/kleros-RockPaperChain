import { toast } from "sonner";
import { useState, useEffect } from "react";
import { isAddress, parseEther } from "viem";
import { solidityPackedKeccak256 } from "ethers";
import {
    useAccount,
    useDeployContract,
    useWaitForTransactionReceipt,
} from "wagmi";

import { abi } from "@/constants/abi";
import { Move } from "@/constants/moveTypes";
import { bytecode } from "@/constants/byteCode";

export function useFirstPlayerLogic() {
    const { isConnected } = useAccount();
    const [isSalt, setIsSalt] = useState<number>(0);
    const [isMove, setIsMove] = useState<Move>(Move.Null);
    const [stakeAmount, setStakeAmount] = useState<string>("0");
    const [isSecondPlayer, setIsSecondPlayer] = useState<string>("");
    const [contractAddress, setContractAddress] = useState<`0x${string}`>();

    const { deployContract, data: hash, isPending } = useDeployContract();
    const {
        isLoading: isConfirming,
        isSuccess,
        data: receipt,
    } = useWaitForTransactionReceipt({ hash });

    const handleDeploy = () => {
        if (!isAddress(isSecondPlayer)) {
            toast("Invalid recipient address");
            return;
        }

        if (isMove === Move.Null) {
            toast("Please select a move");
            return;
        }

        try {
            const ethStaked = parseEther(stakeAmount);
            const moveHash = solidityPackedKeccak256(
                ["uint8", "uint256"],
                [isMove, isSalt]
            );

            deployContract({
                abi,
                bytecode,
                args: [moveHash, isSecondPlayer],
                value: ethStaked,
            });
        } catch (error) {
            toast("Failed to process deployment");
            console.error(error);
        }
    };

    useEffect(() => {
        if (isConfirming || contractAddress) {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [isConfirming, contractAddress]);

    useEffect(() => {
        if (receipt?.contractAddress) {
            setContractAddress(receipt.contractAddress);
        }
    }, [receipt]);

    return {
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
    };
};