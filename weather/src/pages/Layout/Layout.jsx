import { Link, Outlet } from "react-router"
import "./Layout.css"

const Layout = () => {
    return (
        <div className="container">
            <nav className="nav">
                <h4 className="title">Погода в Омске</h4>
                <ul className="list">
                    <li>
                        <Link to="/" className="link">Главная</Link>
                    </li>
                </ul>
            </nav>
            <main className="main">
                <Outlet />
            </main>
            <footer className="footer">
                <p>ФЕДУК - МОРЯК</p>
            </footer>
        </div>
    )
}

export default Layout