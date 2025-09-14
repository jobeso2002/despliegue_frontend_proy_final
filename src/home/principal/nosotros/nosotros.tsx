import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import fondopersona from "@/assets/fondoperso.jpg";
import deporte from "@/assets/iniciocarusel/Quienessomos.png";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import equipo1 from "@/assets/equipos/333009.png";
import equipo2 from "@/assets/equipos/Alakran (1).jpg";
import equipo3 from "@/assets/equipos/Dragones.jpg";
import equipo4 from "@/assets/equipos/Hunters blanco.jpg";
import equipo5 from "@/assets/equipos/LOGO AGUILAS.jpg";
import equipo6 from "@/assets/equipos/LOGO NJ.jpeg";
import equipo7 from "@/assets/equipos/LOGO VIKING@S.jpg";
import equipo8 from "@/assets/equipos/LOGO WOLFTEAM.png";
import equipo9 from "@/assets/equipos/Logo Storm Blanco.jpg";
import equipo10 from "@/assets/equipos/Winx.png";
import equipo11 from "@/assets/equipos/logo alpha.jpg";
import equipo12 from "@/assets/equipos/logo guerrer@s.jpg";
import equipo13 from "@/assets/equipos/logo hunters.jpg";
import equipo14 from "@/assets/equipos/logo israel.jpg";
import equipo15 from "@/assets/equipos/logo ludam.jpg";
import equipo16 from "@/assets/equipos/logo mas voley.jpg";
import equipo17 from "@/assets/equipos/logo pacific.jpg";
import equipo18 from "@/assets/equipos/logo panthers.jpg";
import equipo19 from "@/assets/equipos/logo saen.jpg";
import equipo20 from "@/assets/equipos/logo team zeta.jpg";
import equipo21 from "@/assets/equipos/logo valkiria.jpg";
import equipo22 from "@/assets/equipos/logo voley kids.jpg";
import equipo23 from "@/assets/equipos/logo warriors.jpg";

import React from "react";

function Nosotros() {
  const clubes = [
    //images para los clubes
    { nombre: "CLUB DE VOLEIBOL VIKINGS", img: equipo1 },
    { nombre: "CLUB DE VOLEIBOL ÁLAKRAN", img: equipo2 },
    { nombre: "CLUB DE VOLEIBOL DRAGONES", img: equipo3 },
    { nombre: "CLUB DE VOLEIBOL HUNTERS BLANCO", img: equipo4 },
    { nombre: "CLUB DE VOLEIBOL AGUILAS", img: equipo5 },
    { nombre: "CLUB DE VOLEIBOL ALPHA", img: equipo6 },
    { nombre: "CLUB DE VOLEIBOL GUERREROS", img: equipo7 },
    { nombre: "CLUB DE VOLEIBOL HUNTERS", img: equipo8 },
    { nombre: "CLUB DE VOLEIBOL ISRAEL", img: equipo9 },
    { nombre: "CLUB DE VOLEIBOL LUDAM", img: equipo10 },
    { nombre: "CLUB DE VOLEIBOL MAS VOLEY", img: equipo11 },
    { nombre: "CLUB DE VOLEIBOL NJ", img: equipo12 },
    { nombre: "CLUB DE VOLEIBOL PACIFIC", img: equipo13 },
    { nombre: "CLUB DE VOLEIBOL PANTHERS", img: equipo14 },
    { nombre: "CLUB DE VOLEIBOL SAENS", img: equipo15 },
    { nombre: "CLUB DE VOLEIBOL STORM", img: equipo16 },
    { nombre: "CLUB DE VOLEIBOL ZETA", img: equipo17 },
    { nombre: "CLUB DE VOLEIBOL VALKIRIA", img: equipo18 },
    { nombre: "CLUB DE VOLEIBOL VIKINGS", img: equipo19 },
    { nombre: "ACADEMIA DE VOLEY KIDS", img: equipo20 },
    { nombre: "CLUB DE VOLEIBOL WARRIORS", img: equipo21 },
    { nombre: "CLUB DE VOLEIBOL WOLFTEAM", img: equipo22 },
    { nombre: "CLUB DE VOLEIBOL WINX", img: equipo23 },
  ];

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-8 p-8">
        {/* Sección "QUIENES SOMOS" */}
        <div className="flex-1 bg-gray-100 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            QUIENES SOMOS
          </h2>
          <p className="text-gray-700">
            La Federación Colombiana de Voleibol es un organismo deportivo, de
            derecho privado, sin ánimo de lucro, dotado de personería jurídica,
            reconocimiento deportivo de deportes, con duración indefinida, que
            cumplió todos los trámites público y social, afiliada a la
            Federación Internacional de Voleibol (FIBV) y la Confederación
            Sudamericana de Voleibol CSV.
          </p>
        </div>

        {/* Imagen */}
        <div className="flex justify-center items-center">
          <img
            src={deporte}
            alt="Jugadora de voleibol"
            className="h-96 w-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Sección "Misión" y "Visión" */}
        <div className="flex flex-col flex-1 space-y-8">
          {/* Tarjeta Misión */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-center text-blue-700 mb-4">
              Misión
            </h3>
            <p className="text-gray-700">
              La federación promueve y desarrolla la cultura física en el país a
              través de la práctica del voleibol en sus diferentes modalidades,
              como un medio para que los atletas se conviertan en líderes que
              promuevan desarrollo social y contribuyan al mejoramiento de la
              sociedad.
            </p>
          </div>

          {/* Tarjeta Visión */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-center text-blue-700 mb-4">
              Visión
            </h3>
            <p className="text-gray-700">
              La federación es una organización líder en la estructura del
              deporte colombiano y sudamericano, con representatividad a todo
              nivel, con una organización fundamentada en valores éticos altos y
              el mejoramiento continuo.
            </p>
          </div>
        </div>
      </div>

      {/*///////////////////////////////*/}

      <div>
        <Card>
  <CardHeader>
    <CardTitle className="text-center text-2xl font-bold text-green-700">
      COMITÉ EJECUTIVO
    </CardTitle>
    <CardContent>
      <div className="flex gap-6 overflow-x-auto sm:overflow-visible sm:flex-wrap justify-start sm:justify-center px-2">
        <div className="flex-shrink-0 text-center">
          <img
            src={fondopersona}
            alt="Integrante 1"
            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full mx-auto"
          />
          <p className="mt-2 text-sm sm:text-base">nestor usiche</p>
          <p className="text-xs sm:text-sm">PRESIDENTE</p>
        </div>

        <div className="flex-shrink-0 text-center">
          <img
            src={fondopersona}
            alt="Integrante 2"
            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full mx-auto"
          />
          <p className="mt-2 text-sm sm:text-base">Señora Marta</p>
          <p className="text-xs sm:text-sm">VICEPRESIDENTE</p>
        </div>

        <div className="flex-shrink-0 text-center">
          <img
            src={fondopersona}
            alt="Integrante 3"
            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full mx-auto"
          />
          <p className="mt-2 text-sm sm:text-base">Señora Marta</p>
          <p className="text-xs sm:text-sm">TECNICO</p>
        </div>

        <div className="flex-shrink-0 text-center">
          <img
            src={fondopersona}
            alt="Integrante 4"
            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full mx-auto"
          />
          <p className="mt-2 text-sm sm:text-base">Señora Marta</p>
          <p className="text-xs sm:text-sm">SECRETARIA</p>
        </div>

        <div className="flex-shrink-0 text-center">
          <img
            src={fondopersona}
            alt="Integrante 5"
            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full mx-auto"
          />
          <p className="mt-2 text-sm sm:text-base">Señora Marta</p>
          <p className="text-xs sm:text-sm">VOCERO</p>
        </div>
      </div>
    </CardContent>
  </CardHeader>
</Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-green-700">
              CLUBES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Carousel
              plugins={[plugin.current]}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent className="flex gap-4">
                {clubes.map((club, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-3/4 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 flex flex-col items-center space-y-2"
                  >
                    <img
                      src={club.img}
                      alt={club.nombre}
                      className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-lg shadow-lg"
                    />
                    <p className="text-center text-xs sm:text-sm md:text-base font-medium text-gray-700">
                      {club.nombre}
                    </p>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Nosotros;
