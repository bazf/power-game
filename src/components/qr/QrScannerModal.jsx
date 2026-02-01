import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import Button from "../common/Button.jsx";

export default function QrScannerModal({ open, onClose, onResult }) {
    const videoRef = useRef(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) return undefined;

        let active = true;
        const codeReader = new BrowserQRCodeReader();

        const start = async () => {
            try {
                const devices = await BrowserQRCodeReader.listVideoInputDevices();
                const deviceId = devices[0]?.deviceId;
                await codeReader.decodeFromVideoDevice(deviceId, videoRef.current, (result, err) => {
                    if (!active) return;
                    if (result) {
                        onResult(result.getText());
                        onClose();
                        codeReader.reset();
                    }
                    if (err && err.name !== "NotFoundException") {
                        setError("Не вдалося зчитати QR. Спробуйте ще раз.");
                    }
                });
            } catch {
                if (active) {
                    setError("Немає доступу до камери або вона недоступна.");
                }
            }
        };

        start();

        return () => {
            active = false;
            codeReader.reset();
        };
    }, [open, onClose, onResult]);

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Сканер QR</h3>
                    <Button variant="ghost" onClick={onClose}>
                        Закрити
                    </Button>
                </div>
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                    <video ref={videoRef} className="h-64 w-full bg-black">
                        <track kind="captions" src="" label="captions" />
                    </video>
                </div>
                {error && <p className="mt-3 text-sm text-accentOrange">{error}</p>}
                <p className="mt-3 text-xs text-slate-500">
                    Дозвольте доступ до камери. Піднесіть QR-код ближче до центру.
                </p>
            </div>
        </div>
    );
}

QrScannerModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onResult: PropTypes.func.isRequired,
};
