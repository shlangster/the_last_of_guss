import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { apiAuth, apiRounds, RoundListItem } from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export default function RoundsListPage() {
    const { me, setMe } = useAuth();
    const [list, setList] = useState<RoundListItem[]>([]);
    const nav = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const m = await apiAuth.me();
                setMe(m);
                const l = await apiRounds.list();
                setList(l);
            } catch { nav('/login'); }
        })();
    }, []);

    async function createRound() {
        const r = await apiRounds.create();
        nav(`/rounds/${(r as any).id}`);
    }

    return (
        <Layout>
            <div className="row" style={{
                justifyContent: 'space-between',
                marginBottom: 12
            }}>
                <div className="h1">Раунды</div>
                {me?.role === 'admin' && (
                    <button onClick={createRound}>Создать раунд</button>
                )}
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                padding: '16px 0'
            }}>
                {list.map(r => (
                    <div key={r.id} className="card" style={{
                        padding: '20px',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        color: 'inherit'
                    }} onClick={() => nav(`/rounds/${r.id}`)}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '12px'
                        }}>
                            <div>
                                {r.id}
                            </div>
                        </div>
                        
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span>Старт:</span>
                                <span>{new Date(r.startsAt).toLocaleString()}</span>
                            </div>
                            
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span>Финиш:</span>
                                <span>{new Date(r.endsAt).toLocaleString()}</span>
                            </div>
                        </div>
                        
                        <div style={{
                            marginTop: '12px',
                            paddingTop: '12px',
                            borderTop: '1px solid #f0f0f0',
                            textAlign: 'center'
                        }}>
                             <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span>Статус:</span>
                                <span>{r.status === 'cooldown' ? 'Cooldown' : r.status === 'finished' ? 'Завершён' : 'Активен'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
}