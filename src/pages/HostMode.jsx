import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import Navigation from "../components/layout/Navigation.jsx";

const links = [
    { to: "/host/energy", label: "Балансування", end: false },
    { to: "/host/shield", label: "Екранування", end: false },
    { to: "/host/reactor", label: "Реактор", end: false },
];

export default function HostMode() {
    return (
        <div className="mx-auto flex min-h-[100svh] max-w-6xl flex-col gap-6 px-6 py-8 pb-16">
            <Header subtitle="Мультиборд" />
            <Navigation links={links} />
            <Outlet />
        </div>
    );
}
