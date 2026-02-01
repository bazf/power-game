import PropTypes from "prop-types";

export default function RadiationBeam({ status }) {
    let beamClass = "bg-slate-200";
    if (status === "success") {
        beamClass = "bg-accentGreen/70";
    } else if (status === "fail") {
        beamClass = "bg-accentOrange/80";
    }

    return (
        <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-6">
            <div className="flex w-full items-center justify-between">
                <div className="h-16 w-16 rounded-full bg-accentOrange/80 shadow-lg" />
                <div className="flex-1">
                    <div
                        className={`mx-4 h-2 rounded-full transition-all ${beamClass}`}
                        style={{
                            width: status ? "60%" : "90%",
                        }}
                    />
                </div>
                <div className="h-24 w-10 rounded-xl border-4 border-slate-300 bg-slate-100" />
            </div>
            <div className="text-center">
                {status === "success" && (
                    <p className="text-lg font-semibold text-accentGreen">Промені зупинені</p>
                )}
                {status === "fail" && (
                    <p className="text-lg font-semibold text-accentOrange">
                        Промені пройшли крізь бар'єр
                    </p>
                )}
                {!status && (
                    <p className="text-sm text-slate-500">
                        Натисніть "ПОЧАТИ ТЕСТ", щоб запустити симуляцію.
                    </p>
                )}
            </div>
        </div>
    );
}

RadiationBeam.propTypes = {
    status: PropTypes.oneOf(["success", "fail", null]),
};
