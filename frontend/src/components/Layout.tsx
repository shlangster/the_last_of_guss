import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { apiAuth } from '../api';

export default function Layout({ children }: { children: React.ReactNode }) {
    const { me, setMe } = useAuth();
    const nav = useNavigate();
    return (
        <div>
            <header className="card" style={{ borderRadius: 0 }}>
                <div className="container row" style={{ justifyContent: 'space-between' }}>
                    <div className="row" style={{ gap: 16 }}>
                        <Link to="/" className="h2">The Last of Guss</Link>            
                    </div>
                    <div className="row" style={{ gap: 8 }}>
                        {me ? (
                            <>
                                <span className="badge">{me.username} · {me.role}</span>
                                <button onClick={async () => {
                                    await apiAuth.logout();
                                    setMe(null); nav('/login');
                                }}>Выйти</button>
                            </>
                        ) : (
                            <Link to="/login"><button>Войти</button></Link>
                        )}
                    </div>
                </div>
            </header>
            <main className="container" style={{ paddingTop: 16 }}>{children}</main>
        </div>
    );
}