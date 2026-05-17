import { useState } from "react";

/* eslint-disable react/prop-types */

export default function TravelPreference({ type, title, description, accentClass }){
    const [message, setMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const savePreference = async wantsCarRental => {
        setIsSaving(true);
        setSelectedOption(wantsCarRental);
        setMessage("");

        try {
            const response = await fetch("https://travel-assistant-production-273c.up.railway.app/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    travelType: type,
                    wantsCarRental,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Secim kaydedilemedi.");
            }

            setMessage("Secimin kaydedildi.");
        } catch (error) {
            setMessage(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return(
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-10">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8">
                    <p className={`text-sm font-semibold uppercase tracking-wide ${accentClass}`}>
                        {title}
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-950 md:text-5xl">
                        Arac kiralamak ister misin?
                    </h1>
                    <p className="mt-3 max-w-2xl text-base text-slate-600">
                        {description}
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => savePreference(true)}
                        className={`rounded-2xl border p-6 text-left shadow-lg shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed ${
                            selectedOption === true
                                ? "border-emerald-500 bg-emerald-50"
                                : "border-slate-200 bg-white hover:border-emerald-300"
                        }`}
                    >
                        <span className="text-sm font-bold uppercase tracking-wide text-emerald-600">
                            Evet
                        </span>
                        <h2 className="mt-4 text-2xl font-black text-slate-950">
                            Arac kirala
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            Varis noktasinda daha ozgur hareket etmek istiyorum.
                        </p>
                    </button>

                    <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => savePreference(false)}
                        className={`rounded-2xl border p-6 text-left shadow-lg shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed ${
                            selectedOption === false
                                ? "border-slate-900 bg-slate-100"
                                : "border-slate-200 bg-white hover:border-slate-400"
                        }`}
                    >
                        <span className="text-sm font-bold uppercase tracking-wide text-slate-500">
                            Hayir
                        </span>
                        <h2 className="mt-4 text-2xl font-black text-slate-950">
                            Arac istemiyorum
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            Toplu tasima, transfer veya yurume secenekleri yeterli.
                        </p>
                    </button>
                </div>

                {message && (
                    <p className="mt-5 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                        {message}
                    </p>
                )}
            </div>
        </div>
    )
}
