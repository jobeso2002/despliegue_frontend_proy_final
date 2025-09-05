import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import jugador_1 from "@/assets/iniciocarusel/jugadores1.png";
import jugador_2 from "@/assets/iniciocarusel/jugadores2.png";
import jugador_3 from "@/assets/iniciocarusel/jugadores3.png";
import noticia1 from "@/assets/iniciocarusel/Noticias1.png";
import noticia2 from "@/assets/iniciocarusel/Noticias2.png";
import noticia3 from "@/assets/iniciocarusel/Noticias3.png";
import entrenador from "@/assets/iniciocarusel/entrenador.jpg";
import monitora from "@/assets/iniciocarusel/entrenadora11.jpg";

const noticia_1 =
  "https://images.unsplash.com/photo-1547347298-4074fc3086f0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80";

const images = [
  {
    img: noticia1,
    title: "Finalizaron los Torneos Departamentales 2024-2",
    description:
      "Liga de Voleibol El jugador ideal de voleibol tendría que tener una importante inteligencia táctica...\n\n" +
      "Además, es fundamental que los jugadores desarrollen habilidades técnicas sólidas y mantengan una excelente condición física. " +
      "Nuestros torneos departamentales han demostrado el alto nivel competitivo que hemos alcanzado en la región.\n\n" +
      "Este año contamos con la participación de 15 equipos en la categoría sub-17 y 12 equipos en la categoría sub-21, " +
      "demostrando el crecimiento constante de nuestro deporte en la zona.",
  },
  {
    img: noticia2,
    title: "Livolce brilló en los Campeonatos Nacionales",
    description:
      "Voleibol  Sub-17 y Sub-21\n\n" +
      "Nuestros equipos representaron con orgullo a la región en los Campeonatos Nacionales de Voleibol, " +
      "obteniendo resultados destacados en ambas categorías.\n\n" +
      "En la categoría Sub-17, el equipo femenino logró el tercer puesto, mientras que en la categoría Sub-21, " +
      "el equipo masculino alcanzó las semifinales, demostrando un excelente desempeño técnico y táctico.",
  },
  {
    img: noticia3,
    title: "Escuela de Voleibol MÁS Voley",
    description:
      "Inscripciones abiertas. Julio Monsalve, Castilla.\n\n" +
      "La escuela de voleibol MÁS Voley abre sus puertas para la nueva temporada con programas de formación " +
      "para niños y jóvenes desde los 8 años.\n\n" +
      "Contamos con:\n" +
      "- Entrenamientos técnicos especializados\n" +
      "- Preparación física adaptada\n" +
      "- Desarrollo de valores deportivos\n" +
      "- Participación en torneos locales y regionales\n\n" +
      "Horarios flexibles y grupos reducidos para una atención personalizada.",
  },
];

const trainers = [
  {
    img: entrenador,
    name: "Carlos Martínez",
    role: "Entrenador Principal",
    description:
      "Con más de 15 años de experiencia en voleibol competitivo, mi enfoque combina técnica avanzada y desarrollo táctico.",
  },
  {
    img: monitora,
    name: "Ana Rodríguez",
    role: "Monitora Técnica",
    description:
      "Especializada en formación juvenil, priorizo fundamentos sólidos y crecimiento personal. ",
  },
];

const athletes = [
  { img: jugador_1, name: "jugador1" },
  { img: jugador_2, name: "jugador2" },
  { img: jugador_3, name: "jugador3" },
];

function Inicio() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  const [selectedNews, setSelectedNews] = useState<{
    title: string;
    description: string;
    img: string;
  } | null>(null);

  const openNewsModal = (news: {
    title: string;
    description: string;
    img: string;
  }) => {
    setSelectedNews(news);
  };

  const closeNewsModal = () => {
    setSelectedNews(null);
  };

  return (
    <div className="bg-gray-50">
      {/* Modal para mostrar noticia completa */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={closeNewsModal}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg z-10 hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <img
                src={selectedNews.img}
                alt={selectedNews.title}
                className="h-64 w-full object-cover object-top"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                {selectedNews.title}
              </h2>
              <div className="whitespace-pre-line text-gray-700">
                {selectedNews.description}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeNewsModal}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animated Hero Section */}
      <div className="relative h-screen max-h-[700px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r z-10 flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-green-600 mb-6 animate-fade-in">
              Liga de Voleibol <span className="text-green-600">del Cesar</span>
            </h1>
            <p className="text-xl text-black mb-8 animate-fade-in delay-100">
              Formando campeones dentro
              <span className="text-green-600"> y fuera de la cancha</span>
            </p>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={noticia_1}
            alt="Voleibol"
            className="w-full h-full object-cover animate-zoom-in"
          />
        </div>
      </div>

      {/* Noticias Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-green-800 mb-4 relative inline-block">
            Noticias
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-yellow-400 rounded-full"></span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Mantente al día con las últimas novedades de nuestra liga y torneos
          </p>
        </div>

        <div className="flex justify-center">
          <Carousel className="w-full max-w-6xl">
            <CarouselContent className="-ml-4">
              {images.map((image, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-2 h-full">
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden h-full transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={image.img}
                          alt={image.title}
                          className="w-full h-full object-cover object-top transition duration-500 hover:scale-110"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <h3 className="text-white font-bold text-lg">
                            {image.title}
                          </h3>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {image.description.split("\n")[0]}
                        </p>
                        <button
                          onClick={() => openNewsModal(image)}
                          className="text-green-600 font-semibold flex items-center group"
                        >
                          Leer más
                          <span className="ml-2 group-hover:translate-x-1 transition duration-300">
                            →
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex bg-white/80 hover:bg-white text-green-800" />
            <CarouselNext className="hidden md:flex bg-white/80 hover:bg-white text-green-800" />
          </Carousel>
        </div>
      </section>

      {/* Equipo Section */}
      <section className="py-20 bg-gradient-to-br from-green-700 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 relative inline-block">
              CONOCE NUESTRO EQUIPO
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-yellow-400 rounded-full"></span>
            </h2>
            <p className="max-w-2xl mx-auto opacity-90">
              El talento humano que hace posible nuestro éxito
            </p>
          </div>

          {/* Entrenadores */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-center mb-12 text-yellow-300">
              Entrenadores y monitores
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {trainers.map((trainer, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 border border-white/20 hover:border-yellow-300/50 transition duration-300"
                >
                  <div className="w-40 h-50 rounded-full overflow-hidden border-4 border-yellow-300/80 flex-shrink-0">
                    <img
                      src={trainer.img}
                      alt={trainer.name}
                      className="w-full h-full object-cover scale-110"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">{trainer.name} </h4>
                    <p className="text-yellow-300 mb-2">{trainer.role}</p>
                    <p className="opacity-80">{trainer.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deportistas */}
          <div>
            <h3 className="text-3xl font-bold text-center mb-12 text-yellow-300">
              Nuestros deportistas
            </h3>
            <div className="flex justify-center">
              <Carousel
                className=" max-w-xl mx-auto  "
                plugins={[plugin.current]}
                onMouseLeave={plugin.current.reset}
              >
                <CarouselContent>
                  {athletes.map((athlete, index) => (
                    <CarouselItem key={index}>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:border-yellow-300/50 transition duration-300">
                        {/* Contenedor con altura fija y fondo neutral */}
                        <div className="relative h-96 bg-gray-800/30 flex items-center justify-center overflow-hidden">
                          <img
                            src={athlete.img}
                            alt={athlete.name}
                            className="h-full w-full object-cover"
                            style={{
                              objectPosition: "center top",
                            }}
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="bg-white/80 hover:bg-white text-green-800" />
                <CarouselNext className="bg-white/80 hover:bg-white text-green-800" />
              </Carousel>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Inicio;
