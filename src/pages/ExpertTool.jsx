import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import Navigation from "../components/layout/Navigation.jsx";

const links = [{ to: "/expert/shield", label: "Екранування", end: false }];

export default function ExpertTool() {
    return (
        <div className="mx-auto flex min-h-[100svh] max-w-4xl flex-col gap-6 px-6 py-8 pb-16">
            <Header subtitle="Інструмент Експерта" />
            <Navigation links={links} />
            <Outlet />
        </div>
    );
}
