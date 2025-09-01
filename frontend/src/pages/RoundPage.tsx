import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import Goose from '../components/Goose';
import { apiAuth, apiRounds, RoundInfo } from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../auth';
import StatusInfo from '../components/RoundInfo';
import { getRoundState } from '../utils/roundState';

export default function RoundPage() {
    const { id = '' } = useParams();
    const { me, setMe } = useAuth();
    const nav = useNavigate();
    const [info, setInfo] = useState<RoundInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    const state = useMemo(() => {
        if (!info) return { disabled: true, label: '' };
        return getRoundState(info);
    }, [info]);

    useEffect(() => {
        (async () => {
            try {
                const m = await apiAuth.me();
                setMe(m);
            } catch { nav('/login'); return; }
            try {
                const i = await apiRounds.get(id);
                setInfo(i);
            } catch (e: any) { setError(e.message); }
        })();
    }, [id]);

    async function tap() {
        try {
            const r = await apiRounds.tap(id);
            setInfo(prev => prev ? {
                ...prev, me: {
                    points: r.myPoints, 
                    taps: r.myTaps
                }
            } : prev);
        } catch (e: any) {
            setError(e.message);
        }
    }

    async function refreshRoundInfo() {
        try {
            const i = await apiRounds.get(id);
            setInfo(i);
        } catch (e: any) {
            setError(e.message);
        }
    }
    return (
        <Layout>{info && (
            <div className="row" style={{
                justifyContent: 'space-between',
                marginBottom: 12
            }}>
                <div className="h1">{state.label}</div>
            </div>
        )}
            <div className="card" style={{ display: 'grid', placeItems: 'center', gap: 16 }}>
                <Goose disabled={state.disabled} onTap={tap} />
                {info?.winner && info.status === 'finished' && (
                    <div>Победитель: {info.winner.username} · {info.winner.points} очков</div>
                )}
                {error && <div className="small" style={{ color: '#fecaca' }}>{error}
                </div>}
            </div>
            {info && (
                <StatusInfo info={info} onTimerEnd={refreshRoundInfo}/>
            )}
        </Layout>
    );
}