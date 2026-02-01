import PropTypes from "prop-types";
import { QRCodeCanvas } from "qrcode.react";
import Card from "../common/Card.jsx";

export default function QrCodePanel({ title, subtitle, value }) {
    if (!value) {
        return null;
    }

    return (
        <Card className="flex flex-col items-center gap-4">
            <div className="text-center">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">QR</p>
                <h3 className="text-lg font-semibold">{title}</h3>
                {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
            </div>
            <QRCodeCanvas value={value} size={220} />
            <div className="w-full">
                <p className="text-xs text-slate-400">Код для ручного вводу:</p>
                <textarea
                    readOnly
                    className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                    rows={3}
                    value={value}
                />
            </div>
        </Card>
    );
}

QrCodePanel.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    value: PropTypes.string,
};
