import { RoundInfo } from "../../api";
import { formatTimeRemaining } from "../../functions";
import { useCountdownTimer } from "../../hooks/useCountdownTimer";

type Props = { 
    info: RoundInfo;
    onTimerEnd?: () => void;
};

export default function ActiveInfo({ info, onTimerEnd }: Props) {
    const timeRemaining = useCountdownTimer({
        targetDate: info.endsAt, 
        onTimerEnd
    });

    return (
        <div className="card" style={{ marginTop: 16 }}>
            <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                <span>Раунд активен!</span>
            </div>
            <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}><span>До конца осталось:</span><span>{formatTimeRemaining(timeRemaining)}</span>
            </div>
            <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}><span>Мои очки:</span><span>{info.me.points}</span>
            </div>
        </div>    
    );
}