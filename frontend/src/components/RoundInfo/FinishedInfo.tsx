import { RoundInfo } from "../../api";


type Props = { 
    info: RoundInfo;
};

export default function FinishedInfo({ info }: Props) {

    return (
        <div className="card" style={{ marginTop: 16 }}>
            <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                <span>Всего:</span><span>{info.totalPoints}</span>
            </div>
            <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}><span>Победитель:</span><span>{info.winner ? `${info.winner.username} - ${info.winner.points}` : 'нет'}</span>
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