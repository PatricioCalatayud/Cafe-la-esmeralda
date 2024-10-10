"use client"; 

import { useAuthContext } from "@/context/auth.context";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useProductContext } from "@/context/product.context";
import { IProductList } from "@/interfaces/IProductList";
import { postOrder, putOrderTransaction } from "@/helpers/Order.helper";
import Swal from "sweetalert2";

const ChatBot = dynamic(() => import("react-chatbotify"), { ssr: false });
const urlLocal = process.env.NEXT_PUBLIC_URL_LOCAL;
const ChatBotEsmeralda = () => {
  const { session, handleSignOut, token } = useAuthContext();
  const router = useRouter();
  const [flow, setFlow] = useState({});
  const pathname = usePathname();
  const {allProducts} = useProductContext();
  const [tooltipText, setTooltipText] = useState("Tienes alguna pregunta?");
  const [filteredProducts, setFilteredProducts] = useState<IProductList[] | undefined>(allProducts);
  const [form, setForm] = useState<string[]>()
  const [optionForm, setOptionForm] = useState<string>()
  const [address, setAddress] = useState<string>("")
  const [receiptId, setReceiptId] = useState<string>("")

  const helpLoginOptions = [
    "Registrarme",
    "Olvide mi contraseña",
    "Volver al inicio",
    "Mas opciones",
  ];
  const helpRegisterOptions = [
    "Iniciar sesion",
    "Volver al inicio",
    "Mas opciones",
  ];
  const helpClientOptions = [
    "Hacer el pedido por aca",
    "Quiero comprar",
    "Ver ofertas",
    "Ver mis ordenes",
    "Ver carrito",
    "Quiero hablar con una persona",
    "Calificar local",
    "Saber mas de la esmeralda",
    "Cerrar sesion",
  ];
  const helpAdminOptions = [
    "Ver Ordenes",
    "Ver Productos",
    "Agregar Productos",
    "Ver lista de usuarios",
    "Cerrar sesion",
  ];
  const helpUserOptions = [
    "Quiero comprar",
    "Ver ofertas",
    "Quiero hablar con una persona",
    "Saber mas de la esmeralda",
    "Ver Primeras Opciones",
  ];
  const helpShopOptions = ["Mas opciones"];
  const helpClientShopOptions = session && session.role === "Cliente"  ? ([
     "Hacer el pedido por aca",
    "Mas opciones"]) : (["Mas opciones"]);
  const userOptions = ["Iniciar sesion", "Registrarme", "Mas opciones"];
  const clientShopOptions = ["Es lo que necesito", "Quiero cambiar mi compra", "Volver al inicio"];
  
  useEffect(() => {
    if (allProducts) {
    setFilteredProducts(
      allProducts.reduce((acc: IProductList[], product: IProductList) => {
        const filteredSubproducts = product.subproducts?.filter(
          (subproduct) => subproduct.isAvailable
        );
        if (filteredSubproducts && filteredSubproducts.length > 0) {
          acc.push({
            ...product,
            subproducts: filteredSubproducts,
          });
        }
        return acc;
      }, [])
    );}
  }, [allProducts]);
  const price: any = form?.map((productString) => {
    // Divide el string en partes
const parts = productString.split(' - ');

// Obtiene el nombre del producto
const productName = parts[0];

// Encuentra todos los números en el string y los convierte a enteros
const numbers = (productString.match(/\d+/g) || []).map(num => parseInt(num, 10));

// Determina el amount a usar
const amount = numbers.length > 1 ? numbers[0] : (numbers[0] || 1);

// Determina la cantidad a usar
const quantity = numbers.length > 1 ? numbers[numbers.length - 1] : (1);

// Busca el producto en allProducts
const foundProduct = filteredProducts?.find(p => p.description.toLowerCase() === productName.toLowerCase());

if (!foundProduct) {
  throw new Error(`Product not found: ${productName}`);
}

// Busca el subproducto basado en la cantidad
const foundSubproduct = foundProduct.subproducts.find(sp => Number(sp.amount) === amount);

if (!foundSubproduct) {
  throw new Error(`Subproduct not found for amount: ${quantity}`);
}

return Number(foundSubproduct.price) * quantity * 1.21;
});

const totalPrice = (price || []).reduce((accumulator :any, currentValue:any) => accumulator + currentValue, 0);

  const handleCheckout = async() => {
    const products: any = form?.map((productString) => {
      // Divide el string en partes
  const parts = productString.split(' - ');

  // Obtiene el nombre del producto
  const productName = parts[0];
  
  // Encuentra todos los números en el string y los convierte a enteros
  const numbers = (productString.match(/\d+/g) || []).map(num => parseInt(num, 10));

  // Determina el amount a usar
  const amount = numbers.length > 1 ? numbers[0] : (numbers[0] || 1);

  // Determina la cantidad a usar
  const quantity = numbers.length > 1 ? numbers[numbers.length - 1] : (1);

  // Busca el producto en allProducts
  const foundProduct = filteredProducts?.find(p => p.description.toLowerCase() === productName.toLowerCase());

  if (!foundProduct) {
    throw new Error(`Product not found: ${productName}`);
  }

  // Busca el subproducto basado en la cantidad
  const foundSubproduct = foundProduct.subproducts.find(sp => Number(sp.amount) === amount);

  if (!foundSubproduct) {
    throw new Error(`Subproduct not found for amount: ${quantity}`);
  }

  return {
    productId: foundProduct.id,
    subproductId: foundSubproduct.id,
    quantity: quantity,
  };
    });
    const orderCheckout = {
      userId: session?.id,
      products,
      account: "Transferencia",
      address: address,
    };
    if (session) {
      Swal.fire({
        title: "Preparando orden para transferencia...",
        text: "Por favor espera.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const order = await postOrder(orderCheckout, token);
      
      if(order?.status === 200 || order?.status === 201) {
        Swal.close();
        
        router.push("/");
        setReceiptId(order.data.receipt.id);
      router.push(`/transfer/${order.data.id}`);
    }
  }}
  const handleUpload = async(params:any) => {
    const formData = new FormData();
    // Añadir la imagen al FormData si existe
    formData.append("id", receiptId);
      formData.append("file", params.files[0]);
      Swal.fire({
        title: "Enviando comprobante...",
        text: "Por favor espera.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const response = await putOrderTransaction( formData, token);
            if (response && ( response.status === 201 || response.status === 200)) {
              Swal.close();
              Swal.fire({
                icon: "success",
                title: "¡Comprobante agregado!",
                text: "El comprobante ha sido agregado con éxito.",
              })
              router.push("/dashboard/cliente/order");
          } else {
            Swal.fire({
              icon: "error",
              title: "¡Error!",
              text: "Ha ocurrido un error al agregar el comprobante.",
            });
          }
	}
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleRouteChange = (url: string) => {
      if (url === "/categories") {
        setTooltipText("Elige lo que quieras");
      } else {
        setTooltipText("Tienes alguna pregunta?");
      }
    };
    handleRouteChange(pathname);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return; // Evita que el código se ejecute en el servidor
    
    if (session ) {
      setFlow({
        start: {
          message: `Hola ${session.name}!`,
          transition: { duration: 1000 },
          path: "step2",
        },
        step2: {
          message: "¿Que quieres hacer?",
          options: session.role === "Administrador" ? helpAdminOptions : helpClientOptions,
          path: "process_options",
        },
        step3a: {
          message: "¿Que quieres hacer?",
          options: helpLoginOptions,
          path: "process_options",
        },
        step3b: {
          message: "¿Que quieres hacer?",
          options: helpRegisterOptions,
          path: "process_options",
        },
        step3c: {
          message: "¿Que quieres hacer?",
          options: helpUserOptions,
          path: "process_options",
        },
        step4: {
          message:
            "Puedes filtrar por categorias o promociones a la izquierda.",
          transition: { duration: 1000 },
          path: "step5",
        },
        step5: {
          message: "Arriba puedes filtrar por precio o alfabeticamente.",
          transition: { duration: 1000 },
          path: "step6",
        },
        step6: {
          message: "Clickea una de las opciones y veras los detalles.",
          options: helpClientShopOptions,
          path: "process_options",
        },
        step7: {
          message: "Clickea una de las opciones y veras los detalles.",
          checkboxes: filteredProducts?.flatMap(product =>
            product.subproducts.map(subproduct => 
              `${product.description} - ${subproduct.amount} ${subproduct.unit}`
            )
          ),
          function: (params: any) => setForm(params.userInput.split(", ")),
          path: "step8",
        },
        step8: {
          message: "Perfecto!.",
          options :clientShopOptions,
          path: "process_options",
        },
        preStep9: {
          transition: { duration: 1000 },
          path: "step9",
        },
        step9: {
          message: "Clickea una de las opciones y me diras si quieres mas de 1.",
          options:Array.isArray(form) && [...form, "Continuar"],
          function: async(params: any) => setOptionForm(params.userInput),
          path: "process_options",
        },
       
        step10: {
          message: "Dime cuantas quieres.",
          function: async (params: any) => {  
            const newInput = params.userInput; // El nuevo número que vas a agregar o reemplazar
            const index = form?.findIndex(option => option === optionForm);
            
            if (index !== -1) {
              // Copiamos el array form
              const updatedForm = [...form as any];
              
              // Verificamos si la opción ya tiene 3 partes separadas por "-"
              
              const parts = optionForm?.split(" - ");
              if (parts?.length === 3) {
                // Si ya tiene 3 partes, reemplazamos la última parte por `newInput`
                parts[2] = newInput;
                updatedForm[index as any] = parts.join(" - ");
              } else {
                // Si no tiene 3 partes, simplemente agregamos el nuevo número al final
                updatedForm[index as any] = `${optionForm} - ${newInput}`;
              }
              
              // Actualizamos el estado con el nuevo array
              setForm(updatedForm);
            } else {
              console.error("Opción no encontrada en form");
            }


          },
          path: "preStep9",
        },
        preStep11: {
          transition: { duration: 1000 },
          path: "step11",
        },
        step11: {
          message: "Genial, a donde lo enviamos.",
          function: (params: any) => setAddress(params.userInput),
          path: "preStep12",

        },
        preStep12: {
          transition: { duration: 1000 },
          path: "step12",
        },
        step12: {
          component: (
            <div className="bg-gray-100 border border-gray-400 rounded-lg p-4 m-4 w-full">
              {form?.map ((option, index) => (
                <p key={index}>{option}</p>
              ))}
              <p>Direccion: {address}</p>
              <p>Precio total con iva: $ {totalPrice}</p>
            </div>
          ),
          options: ["Listo, transferir", "Volver al inicio", "Cambiar dirección","Quiero cambiar mi compra"],
          path: "process_options",
        },
        step13: {
          message: "Adjunta comporbante de pago.",
          file: (params: any) => handleUpload(params),
          path: "step14",
        },
        step14: {
          message: "Perfecto!.",
          options: ["Ver mis ordenes", "Volver al inicio"],
          path: "process_options",
        },
        stepWtp: {
          message: "Los horarios de atención son de Lunes a Viernes de 9:00 a 13:30." + " " + "El tiempo de expera es de 30 minutos a 1 hora.",
          options:["Ir a WhatsApp", "Volver al inicio"],
          path: "process_options",
        },
        process_options: {
          transition: { duration: 0 },
          chatDisabled: true,
          path: async (params: any) => {
            let link = "";
    const userInputNormalized = params.userInput.toLowerCase().replace(/\s+/g, "");

    // Normaliza y verifica cada opción en el array `form`
    const formMatches = form?.some(item => item.toLowerCase().replace(/\s+/g, "") === userInputNormalized);

    if (formMatches) {
      return "step10";
    }

    switch (userInputNormalized) {
              case "quierocomprar":
                router.push(urlLocal + "/categories");
                await params.injectMessage(
                  "Ya estás acá, elige lo que quieras."
                );
                return "step4";
              case "verofertas":
                router.push(urlLocal + "/promociones");
                await params.injectMessage(
                  "Ya estás acá, elige lo que quieras."
                );
                return "step4";
                case "vermisordenes":
                router.push(urlLocal + "/dashboard/cliente/order");
                  await params.injectMessage(
                    "Aquí puedes revisar las ordenes."
                  );
                  return "step3c";
                case "cerrarsesion" :
                  handleSignOut();
                  return "step3c";
                case "hacerelpedidoporaca":
                  await params.injectMessage(
                    "Elige el producto que quieres."
                  );
                  return "step7";
                case "vercarrito":
                router.push(urlLocal + "/cart");
                await params.injectMessage(
                  "Ya estás en el carrito"
                );
                return "step3c";
              case "registrarme":
                await params.injectMessage("Ya estás acá, puedes registrarte.");
                router.push(urlLocal + "/register");
                return "step3b";
              case "iniciarsesion":
                router.push(urlLocal + "/login");
                await params.injectMessage(
                  "Ya estás acá, puedes iniciar sessión."
                );
                return "step3a";
              case "olvidemicontraseña":
                router.push(urlLocal + "/forgotPassword");
                return "step3b";
              case "volveralinicio":
                router.push(urlLocal + "/");
                return "step2";
              case "masopciones":
                return "step3c";
                case "calificarlocal":
                router.push(urlLocal + "/contact");
                return "step3c";
                case "irawhatsapp":
                  link = "https://api.whatsapp.com/send?phone=541158803709";
                  window.open(link, "_blank");
                  await params.injectMessage("Aquí puedes talk con una persona.");
                  return "step2";
                case "quierohablarconunapersona":
                  await params.injectMessage(
                    "Puedes, comunicarte por WhatsApp."
                  )
                  return "stepWtp";
              case "sabermasdelaesmeralda":
                await params.injectMessage(
                  "Aquí puedes ver mas sobre la esmeralda."
                );
                router.push(urlLocal + "/sobrenosotros");
                return "step3c";
              case "esloquenecesito":
                await params.injectMessage(
                  "Genial, continuemos con tu pedido."
                )
                return "step9"
              case "quierocambiarmicompra":
                return "step7";
              case "verprimerasopciones":
                return "step2";
              case "continuar":
                return "preStep11";
              case "listo,transferir":
                await params.injectMessage(
                  "Puedes agregar el comprobante por el chat o por la pagina web."
                );
                handleCheckout();
                return "step13";
              case "verordenes":
                router.push(urlLocal + "/dashboard/administrador/order");
                await params.injectMessage(
                  "Aquí puedes verificar comprobantes de transferencia, o cambiar estado de envios."
                );
                return "step2";
              case "verproductos":
                router.push(urlLocal + "/dashboard/administrador/product");
                await params.injectMessage(
                  "Aquí puedes editar los productos, editar subproductos, añadir subproductos, desabilitarlos o eliminarlos."
                );
                return "step2";
              case "agregarproductos":
                await params.injectMessage(
                  "Aquí puedes agregar los productos con sus subproductos."
                );
                router.push(urlLocal + "/dashboard/administrador/productAdd");
                return "step2";
              case "verlistadeusuarios":
                await params.injectMessage(
                  "Aquí puedes ver la lista de usuarios, convertirlos en clientes y viceversa. Ademas ver la situacion de los clientes."
                );
                router.push(urlLocal + "/dashboard/administrador/users");
                return "step2";
              case "cambiardirección":
                return "step11";
              default:
                return "unknown_input";
            }
            
          },
        },
        repeat: {
          transition: { duration: 3000 },
          path: "step3",
        },
      });
    } else {
      setFlow({
        start: {
          message: `Hola!`,
          transition: { duration: 1000 },
          path: "step2",
        },
        step2: {
          message: `Te recomendamos que ingreses a tu cuenta o crees una.`,
          options: userOptions,
          path: "process_options",
        },
        unknown_input: {
          message: "Lo siento no te entiendo, clickea una de las opciones.",
          options: userOptions,
          path: "process_options",
        },
        step3a: {
          message: "¿Que quieres hacer?",
          options: helpLoginOptions,
          path: "process_options",
        },
        step3b: {
          message: "¿Que quieres hacer?",
          options: helpRegisterOptions,
          path: "process_options",
        },
        step3c: {
          message: "¿Que quieres hacer?",
          options: helpUserOptions,
          path: "process_options",
        },
        step4: {
          message:
            "Puedes filtrar por categorias o promociones a la izquierda.",
          transition: { duration: 1500 },
          path: "step5",
        },
        step5: {
          message: "Arriba puedes filtrar por precio o alfabeticamente.",
          transition: { duration: 1500 },
          path: "step6",
        },
        step6: {
          message: "Clickea una de las opciones y veras los detalles.",
          options: helpShopOptions,
          path: "process_options",
        },
        stepWtp: {
          message: "Los horarios de atención son de Lunes a Viernes de 9:00 a 13:30." + " " + "El tiempo de expera es de 30 minutos a 1 hora.",
          options:["Ir a WhatsApp", "Volver al inicio"],
          path: "process_options",
        },
        process_options: {
          transition: { duration: 0 },
          chatDisabled: true,
          path: async (params: any) => {
            let link = "";
            console.log(params.userInput.toLowerCase().replace(/\s+/g, ""));
            switch (params.userInput.toLowerCase().replace(/\s+/g, "")) {
              case "quierocomprar":
                router.push(urlLocal + "/categories");
                await params.injectMessage(
                  "Ya estás acá, elige lo que quieras."
                );
                return "step4";
              case "verofertas":
                router.push(urlLocal + "/promociones");
                await params.injectMessage(
                  "Ya estás acá, elige lo que quieras."
                );
                return "step4";
              case "registrarme":
                await params.injectMessage("Ya estás acá, puedes registrarte.");
                router.push(urlLocal + "/register");
                return "step3b";
              case "iniciarsesion":
                router.push(urlLocal + "/login");
                await params.injectMessage(
                  "Ya estás acá, puedes iniciar sessión."
                );
                return "step3a";
              case "olvidemicontraseña":
                router.push(urlLocal + "/forgotPassword");
                return "step3b";
              case "volveralinicio":
                router.push(urlLocal + "/");
                return "step2";
              case "masopciones":
                return "step3c";
              case "irawhatsapp":
                link = "https://api.whatsapp.com/send?phone=541158803709";
                window.open(link, "_blank");
                await params.injectMessage("Aquí puedes talk con una persona.");
                break;
              case "quierohablarconunapersona":
                await params.injectMessage(
                  "Puedes, comunicarte por WhatsApp."
                )
                return "stepWtp"
              case "sabermasdelaesmeralda":
                await params.injectMessage(
                  "Aquí puedes ver mas sobre la esmeralda."
                )
                router.push(urlLocal + "/sobrenosotros");
                return "step3c";
              case "verprimerasopciones":
                return "step2";
              default:
                return "unknown_input";
            }
            return "repeat";
          },
        },
        repeat: {
          transition: { duration: 3000 },
          path: "step3",
        },
      });
    }
  }, [session, filteredProducts, form, optionForm, address,totalPrice, receiptId]);


  const settings ={
    general: {
      embedded: false,
      primaryColor: "#00796b",
    },
    header: {
      title: "EsmeraldaBot",
      avatar: "/Recurso1.png",
    },
    chatButton: {
      icon: "/Recurso1.png",
    },
    botBubble: {
      avatar: "/Recurso1.png",
    },
    tooltip: {
      text: tooltipText,
    },
    notification: {
      showCount: false,
    },
    chatHistory: {
      storageKey: "messages_bot",
    },
  };

  const styles = {
    headerStyle: {
      background: "#00796b",
      color: "#ffffff",
      padding: "10px",
      fontSize: "20px",
    },
    chatWindowStyle: {
      backgroundColor: "#f2f2f2",
    },
    botAvatarStyle: {
      backgroundColor: "#00796b",
    },


      tooltipStyle:  { fontSize: "15px" } ,
    
  };

  return <ChatBot styles={styles} settings={settings} flow={flow} />;
};

export default ChatBotEsmeralda;
