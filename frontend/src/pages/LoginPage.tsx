import { useEffect, useState } from 'react';
import { useAuth } from '../auth';
import { apiAuth } from '../api';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const { me, setMe } = useAuth();
    const nav = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    useEffect(() => { if (me) nav('/'); }, [me]);
    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        try {
            const m = await apiAuth.login(username, password);
            setMe(m);
            nav('/');
        } catch (e: any) {
            setError(e.message);
        }
    }
    return (
        <div className="card" style={{ maxWidth: 420, margin: '4rem auto' }}>
            <div className="h1" style={{ marginBottom: 12 }}>Вход</div>
            <form onSubmit={onSubmit} className="row" style={{flexDirection:'column', gap: 12 }}>
                <input placeholder="Имя" value={username}
                    onChange={e => setUsername(e.target.value)} />
                <input type="password" placeholder="Пароль" value={password}
                    onChange={e => setPassword(e.target.value)} />
                <button type="submit">Войти</button>
                {error && <div className="small" style={{ color: '#fecaca' }}>{error}
                </div>}
            </form>
        </div>
    );
}