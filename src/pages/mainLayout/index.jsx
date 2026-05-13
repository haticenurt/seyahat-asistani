import { Outlet } from "react-router-dom";

export default function MainLayout(){
    return(
        <div className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex h-16 max-w-5xl items-center px-4">
                    <span className="text-lg font-bold text-slate-950">Anasayfa</span>
                </div>
            </header>
            <Outlet />
        </div>
    )
}
