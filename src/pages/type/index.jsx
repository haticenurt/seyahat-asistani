import { Link } from "react-router-dom";

const travelTypes = [
    {
        title: "Ucuz",
        description: "Butce dostu seceneklerle en uygun yolculugu bul.",
        price: "En ekonomik",
        to: "/cheap",
        className: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-100",
    },
    {
        title: "Orta",
        description: "Fiyat ve konfor dengesini koruyan secenekleri listele.",
        price: "Dengeli tercih",
        to: "/medium",
        className: "border-sky-200 bg-sky-50 text-sky-700 hover:border-sky-400 hover:bg-sky-100",
    },
    {
        title: "Konfor",
        description: "Daha rahat ve kaliteli yolculuk alternatiflerini sec.",
        price: "Rahat yolculuk",
        to: "/comfort",
        className: "border-violet-200 bg-violet-50 text-violet-700 hover:border-violet-400 hover:bg-violet-100",
    },
];

export default function Type(){
    return(
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-10">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                        Yolculuk tipi
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-950 md:text-5xl">
                        Nasil bir yolculuk istersin?
                    </h1>
                    <p className="mt-3 max-w-2xl text-base text-slate-600">
                        Onceligini sec, sana uygun rota ve ulasim seceneklerini ona gore hazirlayalim.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {travelTypes.map(type => (
                        <Link
                            key={type.title}
                            to={type.to}
                            className={`group flex min-h-56 flex-col justify-between rounded-2xl border p-6 shadow-lg shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-xl ${type.className}`}
                        >
                            <div>
                                <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-sm font-bold shadow-sm">
                                    {type.price}
                                </span>
                                <h2 className="mt-6 text-3xl font-black text-slate-950">
                                    {type.title}
                                </h2>
                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                    {type.description}
                                </p>
                            </div>

                            <span className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition group-hover:bg-slate-800">
                                Sec
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
