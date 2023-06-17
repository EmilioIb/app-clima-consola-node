import fs from "fs";
import axios from "axios";

class Busquedas {
  historial = ["a", "b"];
  dbPath = "./db/databse.json";

  constructor() {
    this.leerDB();
  }

  get paramsMapBox() {
    return {
      language: "es",
      limit: 5,
      access_token: process.env.MAPBOX_KEY,
    };
  }

  get paramsWheather() {
    return {
      units: "metric",
      lang: "es",
      appid: process.env.OPENWEATHER_KEY,
    };
  }

  get historialCapitalizado() {
    return this.historial.map((lugar) => {
      let palabras = lugar.split(" ");
      palabras = palabras.map((p) => p[0].toUpperCase() + p.substring(1));
      return palabras.join(" ");
    });
  }

  async ciudad(lugar = "") {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json?`,
        params: this.paramsMapBox,
      });

      const res = await instance.get();

      return res.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async climaLugar(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather?`,
        params: { ...this.paramsWheather, lat, lon },
      });

      const res = await instance.get();
      const { weather, main } = res.data;

      return {
        desc: weather[0].description,
        max: main.temp_max,
        min: main.temp_min,
        temp: main.temp,
      };
    } catch (error) {
      console.log(error);
    }
  }

  agregarHistorial(lugar = "") {
    if (this.historial.includes(lugar.toLocaleLowerCase())) return;

    this.historial = this.historial.splice(0, 5);

    this.historial.unshift(lugar.toLocaleLowerCase());
    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  leerDB() {
    if (!fs.existsSync(this.dbPath)) {
      return null;
    }

    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);

    this.historial = data.historial;
  }
}

export { Busquedas };
