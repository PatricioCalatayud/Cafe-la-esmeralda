"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { AiOutlineMenu, AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { Dropdown } from "flowbite-react";
import Image from "next/image";
import { useProductContext } from "@/context/product.context";
import { useAuthContext } from "@/context/auth.context";
import { useCartContext } from "@/context/cart.context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faCartShopping,
  faHandshake,
  faHeart,
  faHouse,
  faMagnifyingGlass,
  faMugHot,
  faQuestion,
  faScrewdriverWrench,
  faTag,
  faTruck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [nav, setNav] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { searchResults: searchProductResults, searchProducts } =
    useProductContext();
  const { session, handleSignOut: signOut } = useAuthContext();
  const { cartItemCount, setCartItemCount } = useCartContext(); // Importando setCartItemCount

  const hideNavbar =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgotPassword" ||
    pathname === "/resetPassword";

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    searchProducts(term);
  };

  const handleProductClick = () => {
    setSearchTerm("");
  };

  const handleNavLinkClick = () => {
    setNav(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(); // Cerrar sesión
      setCartItemCount(0); // Reiniciar contador de carrito a 0
      localStorage.removeItem("cart"); // (Opcional) Limpiar el carrito en localStorage
      router.push("/login"); // Redirigir al login
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (hideNavbar) {
    return null;
  }

  return (
    <header className="relative text-gray-600 body-font z-50">
      <div className="relative z-20 container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
        <div className="flex items-center text-gray-900 mb-4 md:mb-0 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center">
            <AiOutlineMenu
              onClick={() => setNav(!nav)}
              size={30}
              className="mr-2 cursor-pointer lg:hidden"
            />
            <Link href="/" className="flex items-center text-gray-900">
              <div className="w-20 h-25 text-white p-2 md:w-16 md:h-20">
                <Image
                  width={500}
                  height={500}
                  src="/esmeraldaLogosolo.png"
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          </div>
          <div className="flex items-center w-full md:w-auto justify-between space-x-2 md:hidden">
            <div className="relative flex items-center w-full md:w-auto justify-between md:justify-start space-x-2">
              <input
                className="bg-gray-200 rounded-full pl-10 pr-4 py-1 focus:outline-none w-full md:w-64"
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <AiOutlineSearch
                style={{ width: "20px", height: "20px" }}
                className="absolute left-2 text-gray-600"
              />
            </div>
            <button
              onClick={() => router.push("/cart")}
              className="text-teal-700 flex items-center p-2 rounded-full relative"
            >
              <FontAwesomeIcon icon={faCartShopping} size="xl" />
              {cartItemCount > 0 && (
                <span className="bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-white absolute -top-1 -right-1">
                  {cartItemCount}
                </span>
              )}
            </button>
            {!session && (
              <Link href="/login">
                <button className="text-gray-900 font-bold">
                  Iniciar Sesion
                </button>
              </Link>
            )}
            {session && (
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  session.image ? (
                    <Image
                      src={session.image}
                      alt="imagen"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <Image
                      src="/perfilModerno.png"
                      alt="imagen por defecto"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )
                }
              >
                <Dropdown.Header>
                  <span className="block text-sm">{session.name}</span>
                  <span className="block truncate text-sm font-medium ">
                    {session.email}
                  </span>
                </Dropdown.Header>
                {session?.role === "Administrador" ? (
                  <Dropdown.Item href="/dashboard/administrador/profile">
                    <FontAwesomeIcon
                      icon={faScrewdriverWrench}
                      style={{ marginRight: "5px" }}
                    />
                    Panel de Administrador
                  </Dropdown.Item>
                ) : (
                  <Dropdown.Item href="/dashboard/cliente/profile">
                    <FontAwesomeIcon
                      icon={faScrewdriverWrench}
                      style={{ marginRight: "5px" }}
                    />
                    Panel de Cliente
                  </Dropdown.Item>
                )}
                <Dropdown.Item onClick={handleSignOut}>
                  <FontAwesomeIcon
                    icon={faXmark}
                    style={{ marginRight: "5px" }}
                    size="xl"
                  />
                  Salir
                </Dropdown.Item>
              </Dropdown>
            )}
          </div>
        </div>
        <nav className="hidden lg:flex xl:ml-auto xl:mr-auto flex-wrap items-center text-base justify-center gap-5 mx-2">
          <Link
            href="/categories"
            className={` hover:text-gray-900 ${
              pathname === "/categories" && "text-gray-900 font-bold"
            }`}
          >
            Tienda Online
          </Link>
          <Dropdown
            arrowIcon={true}
            inline
            label={
              <div
                className={` hover:text-gray-900   ${
                  (pathname === "/sobrenosotros" ||
                    pathname === "/mvv" ||
                    pathname === "/faq") &&
                  "text-gray-900 font-bold"
                }`}
              >
                Nosotros
              </div>
            }
          >
            <Dropdown.Item
              href="/sobrenosotros"
              className={` hover:text-gray-900   ${
                pathname === "/sobrenosotros" && "text-gray-900 font-bold"
              }`}
            >
              Sobre la Esmeralda
            </Dropdown.Item>
            <Dropdown.Item
              href="/mvv"
              className={` hover:text-gray-900   ${
                pathname === "/mvv" && "text-gray-900 font-bold"
              }`}
            >
              Mision Vision Valores
            </Dropdown.Item>
            <Dropdown.Item
              href="/faq"
              className={` hover:text-gray-900   ${
                pathname === "/faq" && "text-gray-900 font-bold"
              }`}
            >
              Preguntas Frecuentes
            </Dropdown.Item>
          </Dropdown>
          <Link
            href="/politica"
            className={` hover:text-gray-900 ${
              pathname === "/politica" && "text-gray-900 font-bold"
            }`}
          >
            Politica
          </Link>
          {session && (
            <Link
              href="/contact"
              className={` hover:text-gray-900 ${
                pathname === "/contact" && "text-gray-900 font-bold"
              }`}
            >
              Contacto
            </Link>
          )}
          <Link
            href="/promociones"
            className={` hover:text-gray-900 ${
              pathname === "/promociones" && "text-gray-900 font-bold"
            }`}
          >
            Promociones
          </Link>
        </nav>
        <div className="hidden md:flex items-center space-x-2">
          <div className="relative flex items-center w-full md:w-auto justify-between md:justify-start space-x-2">
            <input
              className="bg-gray-200 rounded-xl pl-12 pr-4 py-1 focus:outline-none w-full md:w-64 "
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className="border-r border-gray-600 flex items-center justify-center absolute w-8">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className=" text-gray-600"
                style={{ width: "20px", height: "20px" }}
              />
            </div>
          </div>
          <button
            onClick={() => router.push("/cart")}
            className="text-teal-700 flex items-center p-2 rounded-full relative"
          >
            <FontAwesomeIcon icon={faCartShopping} size="xl" />
            {cartItemCount > 0 && (
              <span className="bg-red-400 rounded-full w-6 h-6 flex items-center justify-center text-white absolute -top-1 -right-1">
                {cartItemCount}
              </span>
            )}
          </button>
          {!session && (
            <Link href="/login">
              <button className="text-gray-900 font-bold">
                Iniciar Sesion
              </button>
            </Link>
          )}
          {session && (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <div className="flex  items-center gap-2 ">
                  {session?.image ? (
                    <Image
                      src={session?.image}
                      alt="imagen"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <Image
                      src="/perfilModerno.png"
                      alt="imagen por defecto"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <p className="text-sm text-center w-20 text-wrap">
                    {session?.name}
                  </p>
                </div>
              }
            >
              <Dropdown.Header>
                <span className="block truncate text-sm font-medium relative z-50">
                  {session?.email}
                </span>
              </Dropdown.Header>
              {session?.role === "Administrador" ? (
                <Dropdown.Item href="/dashboard/administrador/profile">
                  <FontAwesomeIcon
                    icon={faScrewdriverWrench}
                    style={{ marginRight: "5px" }}
                  />
                  Panel de Administrador
                </Dropdown.Item>
              ) : (
                <div className="flex flex-col">
                  <Dropdown.Item href="/dashboard/cliente/profile">
                    <FontAwesomeIcon
                      icon={faScrewdriverWrench}
                      style={{ marginRight: "5px" }}
                    />
                    Panel de cliente
                  </Dropdown.Item>
                  <Dropdown.Item href="/dashboard/cliente/order">
                    <FontAwesomeIcon
                      icon={faTruck}
                      style={{ marginRight: "5px" }}
                    />
                    Envios
                  </Dropdown.Item>
                </div>
              )}

              <Dropdown.Item onClick={handleSignOut}>
                <FontAwesomeIcon
                  icon={faXmark}
                  style={{ marginRight: "5px" }}
                  size="xl"
                />
                Salir
              </Dropdown.Item>
            </Dropdown>
          )}
        </div>
      </div>
      {searchProductResults !== undefined &&
        searchProductResults.length > 0 &&
        searchTerm && (
          <div className="absolute sm:top-20 top-24 sm:right-40 right-0 z-50 sm:w-1/2 w-full shadow-xl lg:w-1/3 bg-white flex flex-col rounded-lg justify-end border border-gray-300">
            {searchProductResults?.map((product: any) => (
              <Link
                href={`/products/${product.id}`}
                key={product.id}
                onClick={handleProductClick}
              >
                <div className="flex items-center p-2 border-b border-gray-200">
                  <Image
                    width={500}
                    height={500}
                    src={product.imgUrl}
                    alt={product.description}
                    className="w-12 h-12 object-cover mr-2"
                  />
                  <p className="text-gray-800">{product.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

      {nav && (
        <div
          className="bg-black/80 fixed w-full h-screen z-20 top-0 left-0"
          onClick={() => setNav(false)}
        ></div>
      )}

      <div
        className={
          nav
            ? "fixed top-0 left-0 w-[300px] h-screen bg-white z-20 duration-300"
            : "fixed top-0 left-[-100%] w-[300px] h-screen bg-white z-20 duration-300"
        }
      >
        <AiOutlineClose
          onClick={() => setNav(!nav)}
          size={30}
          className="absolute right-4 top-4 cursor-pointer dark:text-black"
        />
        <h2 className="text-2xl p-4 dark:text-black">
          La <span className="font-bold">Esmeralda Cafe</span>
        </h2>
        <nav>
          <ul className="flex flex-col p-4 text-gray-800">
            <li className="text-xl py-4 flex">
              <Link
                href="/"
                className={`hover:text-orange-400 gap-4 flex items-center ${
                  pathname === "/" ? "text-orange-400 font-bold" : ""
                }`}
                onClick={handleNavLinkClick}
              >
                <FontAwesomeIcon icon={faHouse} />
                Inicio
              </Link>
            </li>
            {session && (
              <li className="text-xl py-4 flex">
                <Link
                  href="/dashboard/cliente/order"
                  className={`hover:text-orange-400 gap-4 flex items-center ${
                    pathname === "/dashboard/cliente/order"
                      ? "text-orange-400 font-bold"
                      : ""
                  }`}
                  onClick={handleNavLinkClick}
                >
                  <FontAwesomeIcon icon={faTruck} />
                  Envios
                </Link>
              </li>
            )}

            <li className="text-xl py-4 flex">
              <Link
                href="/categories"
                className={`hover:text-orange-400 gap-4 flex items-center ${
                  pathname === "/categories"
                    ? "text-orange-400 font-bold"
                    : ""
                }`}
                onClick={handleNavLinkClick}
              >
                <FontAwesomeIcon icon={faBagShopping} />
                Tienda Online
              </Link>
            </li>
            <li className="text-xl py-4 flex">
              <Link
                href="/promociones"
                className={`hover:text-orange-400 gap-4 flex items-center ${
                  pathname === "/promociones"
                    ? "text-orange-400 font-bold"
                    : ""
                }`}
                onClick={handleNavLinkClick}
              >
                <FontAwesomeIcon icon={faTag} />
                Promociones
              </Link>
            </li>
            <li className="text-xl py-4 flex">
              <Link
                href="/cart"
                className={`hover:text-orange-400 gap-4 flex items-center ${
                  pathname === "/cart" ? "text-orange-400 font-bold" : ""
                }`}
                onClick={handleNavLinkClick}
              >
                <FontAwesomeIcon icon={faCartShopping} />
                Carrito
              </Link>
            </li>

            <li className="text-xl py-4 flex">
              <Link
                href="/sobrenosotros"
                className={`hover:text-orange-400 gap-4 flex items-center ${
                  pathname === "/sobrenosotros"
                    ? "text-orange-400 font-bold"
                    : ""
                }`}
                onClick={handleNavLinkClick}
              >
                <FontAwesomeIcon icon={faMugHot} />
                Sobre la Esmeralda
              </Link>
            </li>

            <li className="text-xl py-4 flex">
              <Link
                href="/politica"
                className={`hover:text-orange-400 gap-4 flex items-center ${
                  pathname === "/politica" ? "text-orange-400 font-bold" : ""
                }`}
                onClick={handleNavLinkClick}
              >
                <FontAwesomeIcon icon={faHandshake} />
                Politica
              </Link>
            </li>
            <li className="text-xl py-4 flex">
              <Link
                href="/mvv"
                className={`hover:text-orange-400 gap-4 flex ${
                  pathname === "/mvv" ? "text-orange-400 font-bold" : ""
                }`}
                onClick={handleNavLinkClick}
              >
                <FontAwesomeIcon icon={faHeart} />
                Mision Vision Valores
              </Link>
            </li>

            <li className="text-xl py-4 flex">
              <Link
                href="/faq"
                className={`hover:text-orange-400 gap-4 flex items-center ${
                  pathname === "/faq" ? "text-orange-400 font-bold" : ""
                }`}
                onClick={handleNavLinkClick}
              >
                <FontAwesomeIcon icon={faQuestion} />
                Preguntas Frecuentes
              </Link>
            </li>
          </ul>
        </nav>

      </div>
    </header>
  );
};

export default Navbar;