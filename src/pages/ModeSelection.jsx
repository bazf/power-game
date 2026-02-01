import { Link } from "react-router-dom";
import { useGameStore } from "../store/gameStore.js";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";

export default function ModeSelection() {
    const setMode = useGameStore((state) => state.setMode);

    return (
        <div className="mx-auto flex min-h-[100svh] max-w-5xl flex-col gap-8 px-6 py-12 pb-16">
            <div>
                <p className="text-xs uppercase tracking-[0.3em] text-accentBlue">Цілком таємно</p>
                <h1 className="text-4xl font-semibold">Центр Керування Енергією</h1>
                <p className="mt-2 text-slate-600">
                    Оберіть режим роботи для класу або індивідуальної експертизи.
                </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <h2 className="text-2xl font-semibold">МУЛЬТИБОРД</h2>
                    <p className="text-sm text-slate-500">
                        Головний екран для спільної роботи класу.
                    </p>
                    <Link to="/host" onClick={() => setMode("host")}>
                        <Button className="mt-4 w-full">ПЕРЕЙТИ ДО СИМУЛЯЦІЇ</Button>
                    </Link>
                </Card>
                <Card>
                    <h2 className="text-2xl font-semibold">СМАРТФОН</h2>
                    <p className="text-sm text-slate-500">
                        Калькулятори та довідники для учнів.
                    </p>
                    <Link to="/expert" onClick={() => setMode("expert")}>
                        <Button variant="ghost" className="mt-4 w-full">
                            ВІДКРИТИ ІНСТРУМЕНТИ
                        </Button>
                    </Link>
                </Card>
            </div>
        </div>
    );
}
