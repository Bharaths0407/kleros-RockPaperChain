import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { Move } from "@/constants/moveTypes";

export default function SelectMove({
    value,
    onValueChange,
}: {
    value?: Move;
    onValueChange: (move: Move) => void;
}) {
    const moves = [
        { value: Move.Rock, label: "Rock" },
        { value: Move.Paper, label: "Paper" },
        { value: Move.Scissors, label: "Scissors" },
        { value: Move.Spock, label: "Spock" },
        { value: Move.Lizard, label: "Lizard" },
    ];

    const handleValueChange = (selectedValue: string) => {
        const move = moves.find(m => m.label === selectedValue);
        if (move) {
            onValueChange(move.value);
        }
    };

    const currentValue = moves.find(m => m.value === value)?.label;

    return (
        <div className="space-y-2">
            <Label htmlFor="move-select">Choose your move</Label>
            <Select 
                value={currentValue} 
                onValueChange={handleValueChange}
            >
                <SelectTrigger id="move-select" className="w-full">
                    <SelectValue placeholder="Select a move" />
                </SelectTrigger>
                <SelectContent>
                    {moves.map((move) => (
                        <SelectItem key={move.value} value={move.label}>
                            {move.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}