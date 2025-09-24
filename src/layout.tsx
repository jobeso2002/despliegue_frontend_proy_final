import { Link, Outlet } from "react-router-dom";
import liga from "./assets/liga.jpg";
import facebook from "./assets/redes/facebook.png";
import instagram from "./assets/redes/instagram.png";
import twiter from "./assets/redes/twiter.png";
import titok from "./assets/redes/tito.jpg";
import whasaph from "./assets/redes/whasa.jpg";
import aliado1 from "./assets/aliados/Indeportes.jpg";
import aliado2 from "./assets/aliados/fedelo.png";
import aliado3 from "./assets/aliados/inde.jpg";
import patrocinador1 from "./assets/patrocinadores/ancla.png";
import patrocinador2 from "./assets/patrocinadores/caribe.jpg";
import patrocinador3 from "./assets/patrocinadores/mega.jpg";
import { Menubar, MenubarMenu, MenubarTrigger } from "./components/ui/menubar";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { AiTwotoneInfoCircle } from "react-icons/ai";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Encabezado */}
      <header className="bg-green-600 text-white py-4 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Contenedor de imagen y título */}
          <div className="flex items-center mb-4 md:mb-0">
            <img
              src={liga}
              alt="Liga Voleibol"
              className="w-10 h-10 rounded-full mr-3 object-contain"
            />
            <h1 className="text-xl font-bold">
              <Link to="/">Ligavoleibol</Link>
            </h1>
          </div>

          {/* Menú mejorado */}
          <nav className="w-full md:w-auto">
            <Menubar className="bg-transparent border-none">
              <MenubarMenu>
                <MenubarTrigger className=" px-4 py-2 rounded-md ">
                  <Link to="/">Inicio</Link>
                </MenubarTrigger>
                <MenubarTrigger className=" px-4 py-2 rounded-md ">
                  <Link to="/nosotros">Nosotros</Link>
                </MenubarTrigger>
                <MenubarTrigger className=" px-4 py-2 rounded-md ">
                  <Link to="/login">Iniciar sesión</Link>
                </MenubarTrigger>
              </MenubarMenu>
            </Menubar>
          </nav>
        </div>
      </header>

      {/* Cuerpo */}
      <main className="flex-grow p-6 bg-gray-100">
        <Outlet /> {/* Aquí se renderizarán las rutas hijas */}
      </main>

      {/* Pie de página */}
      <footer className="bg-gradient-to-r from-green-500 to-black text-white py-12 px-8">
        <div className="container mx-auto">
          {/* Contenedor principal */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
            {/* Sección Aliados y Patrocinadores */}
            <div className="w-full md:w-2/3 flex flex-col md:flex-row items-center justify-center space-x-16 md:ml-52">
              {/* Aliados */}
              <div className="text-center">
                <h2 className="text-xl font-bold mb-4">Aliados</h2>
                <div className="flex justify-center items-center space-x-4">
                  <img
                    src={aliado1}
                    alt="Aliado 1"
                    className="h-12 object-contain"
                  />
                  <img
                    src={aliado3}
                    alt="Aliado 2"
                    className="h-12 object-contain"
                  />
                  <img
                    src={aliado2}
                    alt="Aliado 3"
                    className="h-12 object-contain"
                  />
                </div>
              </div>

              {/* Separador */}
              <div className="h-16 border-l border-white mx-8 hidden md:block"></div>

              {/* Patrocinadores */}
              <div className="text-center">
                <h2 className="text-xl font-bold mb-4">Patrocinadores</h2>
                <div className="flex justify-center items-center space-x-4">
                  <img
                    src={patrocinador1}
                    alt="Patrocinador 1"
                    className="h-12 object-contain"
                  />
                  <img
                    src={patrocinador2}
                    alt="Patrocinador 2"
                    className="h-12 object-contain"
                  />
                  <img
                    src={patrocinador3}
                    alt="Patrocinador 3"
                    className="h-12 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Línea separadora */}
          <div className="my-8 border-t border-white"></div>

          {/* Redes sociales y contacto */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
            {/* Contacto */}
            <div className="text-center md:text-right">
              <p className="flex items-center space-x-2">
                <FaMapMarkerAlt />
                <span>Calle 52 No. 47, Valledupar - Cesar</span>
              </p>
              <p className="flex items-center space-x-2">
                <FaPhoneAlt />
                <span>318 765 8965</span>
              </p>
              <p className="flex items-center space-x-2">
                <AiTwotoneInfoCircle />
                <span>
                  <a href="/politica-de-datos" className="underline">
                    Política de tratamiento de datos
                  </a>
                </span>
              </p>
            </div>

            {/* Redes sociales */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold mb-4">Síguenos:</h3>
              <div className="flex justify-center md:justify-start space-x-4">
                <a
                  href="https://www.facebook.com/LIVOLEYCESAR?mibextid=ZbWKwL"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={facebook} alt="Facebook" className="h-8 w-8" />
                </a>
                <a
                  href="https://x.com/LIVOLCE?t=fEWX0hwwyT9r0JguIahVhQ&s=09"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={twiter} alt="Twitter" className="h-8 w-8" />
                </a>
                <a
                  href="https://www.instagram.com/voleycesar?igsh=cGYxZWJnMjluenlq"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={instagram} alt="Instagram" className="h-8 w-8" />
                </a>
                <a
                  href="https://www.tiktok.com/@voleycesar?_t=ZS-8sUdiIDRkKv&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={titok} alt="Titok" className="h-8 w-8" />
                </a>
                <a
                  href="https://web.whatsapp.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={whasaph} alt="Whassaph" className="h-8 w-8" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center text-[11px] text-gray-300 p-2">
          <span>
            © 2025 - José Obeso - Yulith Carrascal Todos los derechos
            reservados.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
