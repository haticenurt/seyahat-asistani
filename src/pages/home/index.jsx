import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight,
    CalendarDays,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Minus,
    Plane,
    Plus,
    Search,
    Shuffle,
    UserRound,
} from "lucide-react";

/* eslint-disable react/prop-types */

const heroImage = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=85";

const tripTypes = ["Round Trip", "One Way", "Multi City"];
const cabinClasses = ["Economy", "Premium Economy", "Business", "First"];
const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const formatMonth = date => date
    ? date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Select month";

const formatDate = date => date
    ? date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Select date";

const toDateValue = date => {
    if (!date) {
        return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const toMonthValue = date => {
    if (!date) {
        return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    return `${year}-${month}`;
};

const isSameDay = (firstDate, secondDate) => (
    firstDate &&
    secondDate &&
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
);

const isBetweenDates = (date, startDate, endDate) => {
    if (!date || !startDate || !endDate) {
        return false;
    }

    const time = date.setHours(0, 0, 0, 0);
    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(0, 0, 0, 0);

    return time > Math.min(start, end) && time < Math.max(start, end);
};

const buildCalendarDays = monthDate => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const mondayOffset = (firstDay.getDay() + 6) % 7;
    const totalDays = new Date(year, month + 1, 0).getDate();

    return [
        ...Array.from({ length: mondayOffset }, () => null),
        ...Array.from({ length: totalDays }, (_, index) => new Date(year, month, index + 1)),
    ];
};

function DatePicker({
    tripType,
    dateMode,
    setDateMode,
    departureDate,
    returnDate,
    departureMonth,
    returnMonth,
    onSelectDeparture,
    onSelectReturn,
    onSelectDepartureMonth,
    onSelectReturnMonth,
}){
    const [isOpen, setIsOpen] = useState(false);
    const [activeField, setActiveField] = useState("departure");
    const [visibleMonth, setVisibleMonth] = useState(new Date(2026, 4, 1));
    const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

    const months = useMemo(() => [
        visibleMonth,
        new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1),
    ], [visibleMonth]);

    const getFieldValue = field => {
        if (dateMode === "month") {
            return field === "departure" ? formatMonth(departureMonth) : formatMonth(returnMonth);
        }

        return field === "departure" ? formatDate(departureDate) : formatDate(returnDate);
    };

    const handleSelectDate = date => {
        if (activeField === "departure") {
            onSelectDeparture(date);

            if (tripType === "One Way") {
                onSelectReturn(null);
                setIsOpen(false);
                return;
            }

            if (returnDate && date > returnDate) {
                onSelectReturn(null);
            }

            setActiveField("return");
            return;
        }

        onSelectReturn(date);
        setIsOpen(false);
    };

    const handleSelectMonth = monthIndex => {
        const selectedMonth = new Date(visibleMonth.getFullYear(), monthIndex, 1);
        setVisibleMonth(selectedMonth);

        if (dateMode !== "month") {
            setIsMonthPickerOpen(false);
            return;
        }

        if (activeField === "departure") {
            onSelectDepartureMonth(selectedMonth);

            if (tripType === "One Way") {
                onSelectReturnMonth(null);
                setIsOpen(false);
                return;
            }

            setActiveField("return");
            return;
        }

        onSelectReturnMonth(selectedMonth);
        setIsOpen(false);
    };

    const openCalendar = field => {
        setActiveField(field);
        setIsOpen(true);
        setIsMonthPickerOpen(false);
    };

    return(
        <div className="relative">
            <div className="grid gap-3 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={() => openCalendar("departure")}
                    className={`group flex min-h-20 items-center gap-3 rounded-2xl border bg-white/85 px-4 text-left shadow-sm outline-none transition hover:-translate-y-0.5 hover:bg-white focus:ring-4 focus:ring-cyan-200 ${activeField === "departure" && isOpen ? "border-cyan-400" : "border-white/60"}`}
                >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-700">
                        <CalendarDays size={21} />
                    </span>
                    <span>
                        <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">
                            Departure
                        </span>
                        <span className="mt-1 block text-base font-black text-slate-950">
                            {getFieldValue("departure")}
                        </span>
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => openCalendar("return")}
                    disabled={tripType === "One Way"}
                    className={`group flex min-h-20 items-center gap-3 rounded-2xl border bg-white/85 px-4 text-left shadow-sm outline-none transition hover:-translate-y-0.5 hover:bg-white focus:ring-4 focus:ring-cyan-200 disabled:cursor-not-allowed disabled:opacity-50 ${activeField === "return" && isOpen ? "border-cyan-400" : "border-white/60"}`}
                >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700">
                        <CalendarDays size={21} />
                    </span>
                    <span>
                        <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">
                            Return
                        </span>
                        <span className="mt-1 block text-base font-black text-slate-950">
                            {tripType === "One Way" ? "Not needed" : getFieldValue("return")}
                        </span>
                    </span>
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 8, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full z-30 w-full overflow-hidden rounded-4xl border border-white/80 bg-white p-4 shadow-2xl shadow-slate-950/25 lg:w-190"
                    >
                        <div className="mb-4 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
                            {[
                                ["specific", "Specific dates"],
                                ["month", "Whole month"],
                            ].map(([mode, label]) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => {
                                        setDateMode(mode);
                                        setIsMonthPickerOpen(mode === "month");
                                    }}
                                    className={`h-10 rounded-xl text-sm font-black transition ${
                                        dateMode === mode
                                            ? "bg-white text-cyan-700 shadow-sm"
                                            : "text-slate-500 hover:text-slate-900"
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div className="mb-4 flex items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={() => setVisibleMonth(currentMonth => new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                                className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                                aria-label="Previous month"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsMonthPickerOpen(isOpen => !isOpen)}
                                className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-800 transition hover:bg-cyan-50 hover:text-cyan-700"
                            >
                                <CalendarDays size={16} />
                                {monthNames[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
                                <ChevronDown size={16} className={`transition ${isMonthPickerOpen ? "rotate-180" : ""}`} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setVisibleMonth(currentMonth => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                                className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                                aria-label="Next month"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {isMonthPickerOpen || dateMode === "month" ? (
                            <div className="rounded-3xl bg-slate-50 p-3">
                                <div className="mb-3 flex items-center justify-between px-2">
                                    <button
                                        type="button"
                                        onClick={() => setVisibleMonth(currentMonth => new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth(), 1))}
                                        className="grid h-9 w-9 place-items-center rounded-full bg-white text-slate-700 transition hover:bg-slate-200"
                                        aria-label="Previous year"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <h3 className="text-sm font-black text-slate-900">
                                        {visibleMonth.getFullYear()}
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setVisibleMonth(currentMonth => new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1))}
                                        className="grid h-9 w-9 place-items-center rounded-full bg-white text-slate-700 transition hover:bg-slate-200"
                                        aria-label="Next year"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                                    {monthNames.map((monthName, monthIndex) => (
                                        <button
                                            key={monthName}
                                            type="button"
                                            onClick={() => handleSelectMonth(monthIndex)}
                                            className={`rounded-2xl px-3 py-4 text-sm font-black transition ${
                                                monthIndex === visibleMonth.getMonth()
                                                    ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                                                    : "bg-white text-slate-700 hover:bg-cyan-50 hover:text-cyan-700"
                                            }`}
                                        >
                                            {monthName}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-4 lg:grid-cols-2">
                                {months.map(month => (
                                    <div key={`${month.getFullYear()}-${month.getMonth()}`} className="rounded-3xl bg-slate-50 p-3">
                                        <h3 className="mb-3 text-center text-sm font-black text-slate-900">
                                            {monthNames[month.getMonth()]} {month.getFullYear()}
                                        </h3>
                                        <div className="grid grid-cols-7 gap-1 text-center">
                                            {weekDays.map(day => (
                                                <span key={day} className="py-2 text-xs font-bold text-slate-400">
                                                    {day}
                                                </span>
                                            ))}
                                            {buildCalendarDays(month).map((date, index) => {
                                                const selected = isSameDay(date, departureDate) || isSameDay(date, returnDate);
                                                const inRange = date ? isBetweenDates(new Date(date), departureDate, returnDate) : false;

                                                return (
                                                    <button
                                                        key={date ? date.toISOString() : `empty-${index}`}
                                                        type="button"
                                                        disabled={!date}
                                                        onClick={() => handleSelectDate(date)}
                                                        className={`h-10 rounded-xl text-sm font-bold transition disabled:pointer-events-none ${
                                                            selected
                                                                ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                                                                : inRange
                                                                    ? "bg-cyan-100 text-cyan-800"
                                                                    : "text-slate-700 hover:bg-white hover:text-cyan-700 hover:shadow-sm"
                                                        }`}
                                                    >
                                                        {date?.getDate()}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function PassengerSelector({ passengers, setPassengers, cabinClass, setCabinClass }){
    const [isOpen, setIsOpen] = useState(false);
    const totalPassengers = passengers.adults + passengers.children;

    const updatePassengerCount = (type, change) => {
        setPassengers(currentPassengers => {
            const nextValue = Math.max(type === "adults" ? 1 : 0, currentPassengers[type] + change);
            return {
                ...currentPassengers,
                [type]: nextValue,
            };
        });
    };

    return(
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(isOpen => !isOpen)}
                className="flex min-h-20 w-full items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/85 px-4 text-left shadow-sm outline-none transition hover:-translate-y-0.5 hover:bg-white focus:ring-4 focus:ring-cyan-200"
            >
                <span className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-800">
                        <UserRound size={21} />
                    </span>
                    <span>
                        <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">
                            Passengers
                        </span>
                        <span className="mt-1 block text-base font-black text-slate-950">
                            {totalPassengers} traveler{totalPassengers > 1 ? "s" : ""}, {cabinClass}
                        </span>
                    </span>
                </span>
                <ChevronDown size={18} className={`text-slate-500 transition ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 8, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 right-0 top-full z-20 rounded-[1.75rem] border border-white/80 bg-white p-4 shadow-2xl shadow-slate-950/20"
                    >
                        {[
                            ["adults", "Adults", "Age 12+"],
                            ["children", "Children", "Age 2-11"],
                        ].map(([type, title, subtitle]) => (
                            <div key={type} className="flex items-center justify-between border-b border-slate-100 py-3 last:border-b-0">
                                <span>
                                    <span className="block text-sm font-black text-slate-950">
                                        {title}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-500">
                                        {subtitle}
                                    </span>
                                </span>
                                <span className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => updatePassengerCount(type, -1)}
                                        className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                                        aria-label={`Decrease ${title}`}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-5 text-center text-sm font-black text-slate-950">
                                        {passengers[type]}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => updatePassengerCount(type, 1)}
                                        className="grid h-9 w-9 place-items-center rounded-full bg-cyan-50 text-cyan-700 transition hover:bg-cyan-100"
                                        aria-label={`Increase ${title}`}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </span>
                            </div>
                        ))}

                        <label className="mt-4 block">
                            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                                Cabin class
                            </span>
                            <select
                                value={cabinClass}
                                onChange={event => setCabinClass(event.target.value)}
                                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                            >
                                {cabinClasses.map(option => (
                                    <option key={option}>{option}</option>
                                ))}
                            </select>
                        </label>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Home(){
    const navigate = useNavigate();
    const [tripType, setTripType] = useState("Round Trip");
    const [dateMode, setDateMode] = useState("specific");
    const [fromLocation, setFromLocation] = useState("Istanbul (IST)");
    const [toLocation, setToLocation] = useState("London (LHR)");
    const [departureDate, setDepartureDate] = useState(new Date(2026, 5, 12));
    const [returnDate, setReturnDate] = useState(new Date(2026, 5, 19));
    const [departureMonth, setDepartureMonth] = useState(new Date(2026, 5, 1));
    const [returnMonth, setReturnMonth] = useState(new Date(2026, 6, 1));
    const [passengers, setPassengers] = useState({ adults: 1, children: 0 });
    const [cabinClass, setCabinClass] = useState("Economy");

    const swapLocations = () => {
        setFromLocation(toLocation);
        setToLocation(fromLocation);
    };

    const handleSearch = event => {
        event.preventDefault();
        const totalPassengers = passengers.adults + passengers.children;
        const date = dateMode === "month" ? toMonthValue(departureMonth) : toDateValue(departureDate);
        const returnDateValue = tripType === "One Way"
            ? ""
            : dateMode === "month"
                ? toMonthValue(returnMonth)
                : toDateValue(returnDate);

        localStorage.setItem("tripInfo", JSON.stringify({
            from: fromLocation,
            to: toLocation,
            date,
            returnDate: returnDateValue,
            dateMode,
            passengers: totalPassengers,
            passengerBreakdown: passengers,
            cabinClass,
            tripType,
        }));
        navigate("/type");
    };

    return(
        <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
            <section
                className="relative flex min-h-[112vh] items-center bg-cover bg-center px-4 pb-72 pt-28 sm:px-6 lg:min-h-screen lg:px-8 lg:py-32"
                style={{ backgroundImage: `url(${heroImage})` }}
            >
                <div className="absolute inset-0 bg-slate-950/60" />
                <div className="absolute inset-0 bg-linear-to-b from-slate-950/70 via-slate-950/25 to-slate-950/80" />

                <nav className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-slate-950/20 backdrop-blur-xl">
                    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <a href="/" className="flex items-center gap-3">
                            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-cyan-700 shadow-lg shadow-cyan-950/20">
                                <Plane size={23} />
                            </span>
                            <span className="text-xl font-black tracking-tight">
                                AeroFind
                            </span>
                        </a>

                        <div className="hidden items-center gap-8 text-sm font-bold text-white/85 md:flex">
                            <a href="/" className="transition hover:text-white">
                                Flights
                            </a>
                            <a href="/" className="transition hover:text-white">
                                Login
                            </a>
                            <a href="/" className="rounded-full bg-white px-5 py-2.5 text-slate-950 shadow-lg shadow-white/10 transition hover:-translate-y-0.5 hover:bg-cyan-50">
                                Sign Up
                            </a>
                        </div>
                    </div>
                </nav>

                <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.35fr] lg:items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="max-w-2xl pt-6"
                    >
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-cyan-50 backdrop-blur-xl">
                            <Plane size={16} />
                            Smarter flight planning
                        </div>
                        <h1 className="text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                            Search flights with calendar clarity.
                        </h1>
                        <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-white/78">
                            Pick your route, compare dates smoothly, and plan the flight that fits your schedule in a clean startup-grade search experience.
                        </p>
                    </motion.div>

                    <motion.form
                        onSubmit={handleSearch}
                        initial={{ opacity: 0, y: 36, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.15, duration: 0.7 }}
                        className="rounded-4xl border border-white/30 bg-white/72 p-4 text-slate-950 shadow-2xl shadow-slate-950/35 backdrop-blur-2xl sm:p-6"
                    >
                        <div className="mb-5 flex flex-wrap gap-2">
                            {tripTypes.map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => {
                                        setTripType(type);
                                        if (type === "One Way") {
                                            setReturnDate(null);
                                            setReturnMonth(null);
                                        }
                                    }}
                                    className={`rounded-full px-4 py-2 text-sm font-black transition ${
                                        tripType === type
                                            ? "bg-slate-950 text-white shadow-lg shadow-slate-950/20"
                                            : "bg-white/70 text-slate-600 hover:bg-white hover:text-slate-950"
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr]">
                            <label className="block rounded-2xl border border-white/60 bg-white/85 px-4 py-3 shadow-sm transition focus-within:ring-4 focus-within:ring-cyan-200">
                                <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">
                                    From
                                </span>
                                <input
                                    value={fromLocation}
                                    onChange={event => setFromLocation(event.target.value)}
                                    className="mt-2 h-9 w-full bg-transparent text-lg font-black text-slate-950 outline-none placeholder:text-slate-400"
                                    placeholder="City or airport"
                                />
                            </label>

                            <button
                                type="button"
                                onClick={swapLocations}
                                className="mx-auto grid h-12 w-12 place-items-center self-center rounded-full border border-white/70 bg-white text-cyan-700 shadow-lg shadow-slate-950/10 transition hover:rotate-180 hover:bg-cyan-50 lg:mt-5"
                                aria-label="Swap destinations"
                            >
                                <Shuffle size={19} />
                            </button>

                            <label className="block rounded-2xl border border-white/60 bg-white/85 px-4 py-3 shadow-sm transition focus-within:ring-4 focus-within:ring-cyan-200">
                                <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">
                                    To
                                </span>
                                <input
                                    value={toLocation}
                                    onChange={event => setToLocation(event.target.value)}
                                    className="mt-2 h-9 w-full bg-transparent text-lg font-black text-slate-950 outline-none placeholder:text-slate-400"
                                    placeholder="City or airport"
                                />
                            </label>
                        </div>

                        <div className="mt-3 grid gap-3 lg:grid-cols-[1.25fr_0.75fr]">
                            <DatePicker
                                tripType={tripType}
                                dateMode={dateMode}
                                setDateMode={setDateMode}
                                departureDate={departureDate}
                                returnDate={returnDate}
                                departureMonth={departureMonth}
                                returnMonth={returnMonth}
                                onSelectDeparture={setDepartureDate}
                                onSelectReturn={setReturnDate}
                                onSelectDepartureMonth={setDepartureMonth}
                                onSelectReturnMonth={setReturnMonth}
                            />
                            <PassengerSelector
                                passengers={passengers}
                                setPassengers={setPassengers}
                                cabinClass={cabinClass}
                                setCabinClass={setCabinClass}
                            />
                        </div>

                        <motion.button
                            type="submit"
                            whileHover={{ y: -2, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-5 flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-cyan-500 via-blue-600 to-indigo-600 text-lg font-black text-white shadow-xl shadow-blue-950/30 outline-none transition focus:ring-4 focus:ring-cyan-200"
                        >
                            <Search size={22} />
                            Search flights
                            <ArrowRight size={20} />
                        </motion.button>
                    </motion.form>
                </div>
            </section>
        </main>
    );
}
