import { RoundInfo } from "../../api";
import { formatTimeRemaining } from "../../functions";
import { useCountdownTimer } from "../../hooks/useCountdownTimer";

type Props = { 
    info: RoundInfo;
    onTimerEnd?: () => void;
};

export default function CooldownInfo({ info, onTimerEnd }: Props) {
    const timeRemaining = useCountdownTimer({
        targetDate: info.startsAt, 
        onTimerEnd
    });

    return (
        <div className="card" style={{ marginTop: 16 }}>
            <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                <span>Cooldown</span>
            </div>
            <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}><span>До начала осталось:</span><span>{formatTimeRemaining(timeRemaining)}</span>
            </div>
        </div>    
    );
}