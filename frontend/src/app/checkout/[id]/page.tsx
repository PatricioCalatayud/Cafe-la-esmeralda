"use client";

import { useEffect, useState } from "react";
import { ICart } from "@/interfaces/IProductList";
import Image from "next/image";
import { postMarketPay } from "@/helpers/MarketPay.helper";
import MercadoPagoIcon from "@/components/footer/MercadoPagoIcon";
import { useAuthContext } from "@/context/auth.context";
import { Spinner } from "@material-tailwind/react";
import Link from "next/link";

const Checkout = ({ params }: { params: { id: string } }) => {
  const [cart, setCart] = useState<ICart[]>([]);
  const [user, setUser] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  });
  const [address, setAddress] = useState<string | null>(null);
  const [preferenceId, setPreferenceId] = useState<string>("");
  const { session, authLoading } = useAuthContext();

  useEffect(() => {
    const cartData = JSON.parse(
      localStorage.getItem("cart") || "[]"
    ) as ICart[];
    setCart(cartData);
  }, []);

  const shippingCost = 0; // Costo de envío

  const calcularSubtotal = () => {
    return cart.reduce((acc, item) => {
      return acc + (item.quantity || 1) * Number(item.price);
    }, 0);
  };

  const calcularDescuento = () => {
    return cart.reduce((acc, item) => {
      const descuentoPorProducto =
        (item.quantity || 1) *
        (Number(item.price) * (Number(item.discount || 0) / 100));
      return acc + descuentoPorProducto;
    }, 0);
  };

  const calcularIVA = () => {
    const subtotalConDescuento = calcularSubtotal() - calcularDescuento();
    return subtotalConDescuento * 0.21; // 21% de IVA
  };

  const calcularTotal = () => {
    const subtotalConDescuento = calcularSubtotal() - calcularDescuento();
    const iva = calcularIVA();
    return subtotalConDescuento + iva;
  };

  const subtotal = calcularSubtotal();
  const descuento = calcularDescuento();
  const iva = calcularIVA();
  const total = calcularTotal();

  useEffect(() => {
    const createPreference = async (total: number) => {
      if (cart.length !== 0) {
        try {
          const linkPayment = {
            price: total,
            orderId: params.id,
          };

          const response = await postMarketPay(linkPayment);
          if (response?.status === 200 || response?.status === 201) {
            setPreferenceId(response.data);
          }
        } catch (error) {
          console.error("Error creating payment preference:", error);
        }
      }
    };
    createPreference(Number(total));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  return (
    <div className="font-sans bg-white h-full mb-20">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-3 gap-6 py-6">
          {authLoading ? (
            <div className="flex px-6  mx-auto lg:col-span-2  w-full justify-center">
              <Spinner
                color="teal"
                className="h-12 w-12"
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              />
            </div>
          ) : (
            <div className="lg:col-span-2 max-lg:order-1 px-6 max-w-4xl mx-auto w-full">
              {preferenceId ? (
                <a
                  href={preferenceId}
                  target="_blank"
                  className="flex justify-center items-center bg-blue-500 hover:bg-blue-800 text-white gap-2 font-semibold rounded-xl py-2"
                >
                  Pagar con Mercado Pago{" "}
                  <MercadoPagoIcon color="#ffffff" height={"32px"} width={"32px"} />
                </a>
              ) : (
                <div className="flex justify-center items-center w-full h-full">
                  <h1 className="text-3xl">No existe link de mercado pago</h1>
                </div>
              )}
            </div>
          )}

          <div className="lg:col-span-1 md:col-span-1 lg:h-auto lg:sticky lg:top-0 lg:overflow-y-auto flex flex-col  px-6 lg:px-0">
            <div className="flex-1 p-8 bg-teal-600 rounded-t-xl sticky top-0 shadow-2xl">
              <h2 className="text-2xl font-bold text-white w-full text-center">
                Mis Pedidos
              </h2>
              <hr className="my-6" />
              <div className="space-y-6 mt-10">
                {cart.map((item, index) => (
                  <div key={index} className="grid sm:grid-cols-2 items-start gap-6">
                    <div className="max-w-[190px] shrink-0 rounded-md">
                      <Image
                        width={500}
                        height={500}
                        src={item.imgUrl}
                        className="w-40 h-40 object-cover rounded-xl"
                        alt={item.description}
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <h3 className="text-base text-white font-bold ">
                        {item.description}
                      </h3>
                      <ul className="text-xs text-white space-y-2 mt-2">
                        <li className="flex flex-wrap gap-4">
                          Tamaño <span className="ml-auto">{item.size} {item.unit}</span>
                        </li>
                        <li className="flex flex-wrap gap-4">
                          Cantidad{" "}
                          <span className="ml-auto">{item.quantity || 1}</span>
                        </li>
                        <li className="flex flex-wrap gap-4">
                          Producto{" "}
                          <span className="ml-auto">${Number(item.price)}</span>
                        </li>
                        <li className="flex flex-wrap gap-4">
                          Subtotal
                          <span className="ml-auto font-bold">
                            ${item.price * (item.quantity || 1)}
                          </span>
                        </li>
                        <li className="flex flex-wrap gap-4">
                          Descuento
                          {descuento > 0 && (
                            <span className="ml-auto">
                              -${(item.price * (item.quantity || 1) * (item.discount / 100)).toFixed(2)}
                            </span>
                          )}
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-teal-800 py-4 px-8 rounded-b-xl gap-6 flex flex-col">
              <div className="flex justify-between">
                <h4 className="text-base text-white font-semibold">Envío:</h4>
                <h4 className="text-base text-white font-semibold">${shippingCost.toFixed(2)}</h4>
              </div>
              <hr />
              <div className="flex justify-between">
                <h4 className="text-md text-white font-semibold">
                  Subtotal: 
                </h4>
                <h4 className="text-md text-white font-semibold">
                  ${(subtotal).toFixed(2)}
                </h4>
              </div>
              <div className="flex justify-between">
                <h4 className="text-md text-white font-semibold">
                  Descuento: 
                </h4>
                <h4 className="text-md text-white font-semibold">
                  -${(descuento).toFixed(2)}
                </h4>
              </div>
              <hr />
              <div className="flex justify-between">
                <h4 className="text-md text-white font-semibold">IVA (21%):</h4>
                <h4 className="text-md text-white font-semibold">${iva.toFixed(2)}</h4>
              </div>
              <hr />
              <div className="flex justify-between">
                <h4 className="text-lg text-white font-bold">
                  Total: 
                </h4>
                <h4 className="text-lg text-white font-bold">
                  ${(total).toFixed(2)}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;