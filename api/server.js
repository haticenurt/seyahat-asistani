import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const databasePath = join(__dirname, "../data/trips.json");
const port = 3001;

const sendJson = (response, statusCode, data) => {
    response.writeHead(statusCode, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    });
    response.end(JSON.stringify(data));
};

const readTrips = async () => {
    try {
        const file = await readFile(databasePath, "utf8");
        return JSON.parse(file);
    } catch (error) {
        if (error.code === "ENOENT") {
            await mkdir(dirname(databasePath), { recursive: true });
            await writeFile(databasePath, "[]");
            return [];
        }

        throw error;
    }
};

const saveTrips = async trips => {
    await mkdir(dirname(databasePath), { recursive: true });
    await writeFile(databasePath, JSON.stringify(trips, null, 2));
};

const parseBody = request => new Promise((resolve, reject) => {
    let body = "";

    request.on("data", chunk => {
        body += chunk;
    });

    request.on("end", () => {
        try {
            resolve(body ? JSON.parse(body) : {});
        } catch (error) {
            reject(error);
        }
    });

    request.on("error", reject);
});

const validateTrip = trip => {
    if (!trip.from || !trip.to || !trip.date || !trip.passengers) {
        return "Tum alanlar doldurulmali.";
    }

    if (Number(trip.passengers) < 1) {
        return "Kisi sayisi en az 1 olmali.";
    }

    return null;
};

const saveLatestTripOptions = async options => {
    const trips = await readTrips();
    const latestTrip = trips.at(-1);

    if (!latestTrip) {
        return null;
    }

    latestTrip.travelType = options.travelType;
    latestTrip.wantsCarRental = options.wantsCarRental;
    latestTrip.updatedAt = new Date().toISOString();
    await saveTrips(trips);

    return latestTrip;
};

const server = createServer(async (request, response) => {
    if (request.method === "OPTIONS") {
        return sendJson(response, 200, {});
    }

    if (request.url === "/api/trips" && request.method === "GET") {
        const trips = await readTrips();
        return sendJson(response, 200, trips);
    }

    if (request.url === "/api/trips" && request.method === "POST") {
        try {
            const trip = await parseBody(request);
            const errorMessage = validateTrip(trip);

            if (errorMessage) {
                return sendJson(response, 400, { message: errorMessage });
            }

            const trips = await readTrips();
            const newTrip = {
                id: randomUUID(),
                from: trip.from,
                to: trip.to,
                dateType: trip.dateType || "day",
                date: trip.date,
                passengers: Number(trip.passengers),
                createdAt: new Date().toISOString(),
            };

            trips.push(newTrip);
            await saveTrips(trips);

            return sendJson(response, 201, newTrip);
        } catch {
            return sendJson(response, 400, { message: "Gecersiz istek." });
        }
    }

    if (request.url === "/api/trips/latest/options" && request.method === "POST") {
        try {
            const options = await parseBody(request);

            if (!options.travelType || typeof options.wantsCarRental !== "boolean") {
                return sendJson(response, 400, { message: "Secim bilgileri eksik." });
            }

            const updatedTrip = await saveLatestTripOptions(options);

            if (!updatedTrip) {
                return sendJson(response, 404, { message: "Kaydedilecek yolculuk bulunamadi." });
            }

            return sendJson(response, 200, updatedTrip);
        } catch {
            return sendJson(response, 400, { message: "Gecersiz istek." });
        }
    }

    return sendJson(response, 404, { message: "Endpoint bulunamadi." });
});

server.listen(port, () => {
    console.log(`API http://localhost:${port} adresinde calisiyor`);
});
