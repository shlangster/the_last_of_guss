import { RoundInfo } from "../../api";
import ActiveInfo from "./ActiveInfo";
import CooldownInfo from "./CooldownInfo";
import FinishedInfo from "./FinishedInfo";

type Props = { 
    info: RoundInfo;
    onTimerEnd?: () => void;
};

const statusComponents = {
    finished: FinishedInfo,
    active: ActiveInfo,
    cooldown: CooldownInfo,
} as const;

export default function StatusInfo({ info, onTimerEnd }: Props) {
    const StatusComponent = statusComponents[info.status as keyof typeof statusComponents];
    
    if (!StatusComponent) {
        return <></>;
    }
    
    return <StatusComponent info={info} onTimerEnd={onTimerEnd} />;
}
