import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialTripInfo = {
    from: "",
    to: "",
    dateType: "day",
    date: "",
    passengers: 1,
};

export default function Home(){
    const navigate = useNavigate();
    const [tripInfo, setTripInfo] = useState(initialTripInfo);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = event => {
        const { name, value } = event.target;

        setTripInfo(currentInfo => ({
            ...currentInfo,
            [name]: name === "passengers" ? Number(value) : value,
        }));
    };

    const handleDateTypeChange = dateType => {
        setTripInfo(currentInfo => ({
            ...currentInfo,
            dateType,
            date: "",
        }));
    };

    const handleSubmit = async event => {
        event.preventDefault();
        setIsSaving(true);
        setMessage("");

        try {
            const response = await fetch("http://localhost:3001/api/trips", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(tripInfo),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Kayit islemi basarisiz oldu.");
            }

            await response.json();
            setTripInfo(initialTripInfo);
            setMessage("Yolculuk bilgileri kaydedildi.");
            navigate("/type");
        } catch (error) {
            setMessage(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return(
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-10">
            <div className="mx-auto flex max-w-5xl flex-col gap-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                        Yolculuk planla
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-950 md:text-5xl">
                        Sana en uygun rotayi bulalim
                    </h1>
                    <p className="mt-3 max-w-2xl text-base text-slate-600">
                        Baslangic, varis, tarih ve kisi sayisini sec; bilgileri veritabanina kaydedelim.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/70 md:p-6"
                >
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_260px_150px_auto] xl:items-end">
                        <label className="block">
                            <span className="mb-2 block text-sm font-semibold text-slate-700">
                                Nerdesin?
                            </span>
                            <input
                                type="text"
                                name="from"
                                value={tripInfo.from}
                                onChange={handleChange}
                                placeholder="Orn: Istanbul"
                                required
                                className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm font-semibold text-slate-700">
                                Yolculuk nereye?
                            </span>
                            <input
                                type="text"
                                name="to"
                                value={tripInfo.to}
                                onChange={handleChange}
                                placeholder="Orn: Viyana"
                                required
                                className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                            />
                        </label>

                        <div>
                            <span className="mb-2 block text-sm font-semibold text-slate-700">
                                Tarih
                            </span>
                            <div className="mb-2 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
                                <button
                                    type="button"
                                    onClick={() => handleDateTypeChange("day")}
                                    className={`h-9 rounded-lg text-sm font-semibold transition ${tripInfo.dateType === "day" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                                >
                                    Gun
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDateTypeChange("month")}
                                    className={`h-9 rounded-lg text-sm font-semibold transition ${tripInfo.dateType === "month" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                                >
                                    Tum ay
                                </button>
                            </div>
                            <input
                                type={tripInfo.dateType === "day" ? "date" : "month"}
                                name="date"
                                value={tripInfo.date}
                                onChange={handleChange}
                                required
                                className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                            />
                        </div>

                        <label className="block">
                            <span className="mb-2 block text-sm font-semibold text-slate-700">
                                Kisi sayisi
                            </span>
                            <input
                                type="number"
                                name="passengers"
                                min="1"
                                max="12"
                                value={tripInfo.passengers}
                                onChange={handleChange}
                                required
                                className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="h-14 rounded-xl bg-emerald-600 px-8 text-base font-bold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none md:col-span-2 xl:col-span-1"
                        >
                            {isSaving ? "Kaydediliyor" : "Ara"}
                        </button>
                    </div>

                    {message && (
                        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}
