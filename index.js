import "dotenv/config";
import colors from "colors";
import {
  inquireMenu,
  pausa,
  leerInput,
  listarLugares,
} from "./helpers/inquirer.js";
import { Busquedas } from "./models/busquedas.js";

const main = async () => {
  const busquedas = new Busquedas();
  let opt;

  do {
    opt = await inquireMenu();

    switch (opt) {
      case 1:
        const termino = await leerInput("Ciudad: ");
        const lugares = await busquedas.ciudad(termino);
        const idSeleccionado = await listarLugares(lugares);

        if (idSeleccionado === 0) continue;

        const lugarSel = lugares.find((lugar) => lugar.id === idSeleccionado);
        busquedas.agregarHistorial(lugarSel.nombre);

        const datosClima = await busquedas.climaLugar(
          lugarSel.lat,
          lugarSel.lng
        );

        console.clear();
        console.log("\nInformación de la ciudad\n".green);
        console.log(`Ciudad: ${lugarSel.nombre.green}`);
        console.log(`Lat:  ${lugarSel.lat}`);
        console.log(`Lng:  ${lugarSel.lng}`);
        console.log(`Temperatura: ${datosClima.temp}`);
        console.log(`Mínima: ${datosClima.min}`);
        console.log(`Máxima: ${datosClima.max}`);
        console.log(`Estado del clima: ${datosClima.desc.green}`);

        break;
      case 2:
        console.log();
        busquedas.historialCapitalizado.forEach((lugar, i) => {
          const idx = (i + 1 + ".").green;
          console.log(`${idx} ${lugar}`);
        });
        break;
    }

    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
