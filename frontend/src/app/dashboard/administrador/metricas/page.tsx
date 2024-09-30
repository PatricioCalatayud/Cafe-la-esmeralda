"use client";
import PieChart from "@/components/PieChart/PieChart";
import { useAuthContext } from "@/context/auth.context";
import { getBestProducts, getDebts, getOrdersByUserMonth, getProductLeastSold, getProductMostSold, getWorstProducts } from "@/helpers/Metrics.helper";
import { Tabs } from "flowbite-react";
import {  HiCalendar, HiCash, HiClipboardList, HiMinus, HiOutlineChartPie,  HiPlus } from "react-icons/hi";
import { useEffect, useState } from "react";


const Metricas = () => {
    const { token } = useAuthContext();
    const [ordersByUserMonth, setOrdersByUserMonth] = useState<any>();
    const [worstProducts, setWorstProducts] = useState<any>();
    const [bestProducts, setBestProducts] = useState<any>();
    const [debts, setDebts] = useState<any>();
    const [productLeastSold, setProductLeastSold] = useState<any>();
    const [productMostSold, setProductMostSold] = useState<any>();
    useEffect(() => {
        const fetchData = async () => {
            const response = await getOrdersByUserMonth(token as string);
            setOrdersByUserMonth(response);
        console.log(response);
        const response1 = await  getWorstProducts(token as string);
        setWorstProducts(response1);
        console.log(response1);
        const response2 = await  getBestProducts(token as string);
        setBestProducts(response2);
        console.log(response2);
        const response3 = await  getDebts(token as string);
        setDebts(response3);
        console.log(response3);
        const response4 = await  getProductLeastSold(token as string);
        setProductLeastSold(response4);
        console.log(response4);
        const response5 = await  getProductMostSold(token as string);
        setProductMostSold(response5);
        console.log(response5);
        }
        fetchData();
    },[])
    return (
        <section className="p-1 sm:p-1 antialiased h-screen dark:bg-gray-700">
      <div className="w-full ">
        <div className="bg-white dark:bg-gray-800 relative shadow-2xl sm:rounded-lg overflow-hidden pb-20">
    <Tabs aria-label="Tabs with underline" variant="underline">
      <Tabs.Item active title="Productos vendidos" icon={HiOutlineChartPie}>
        <div className="flex justify-center"><PieChart /></div>
      </Tabs.Item>
      <Tabs.Item title="Productos mas vendidos" icon={HiPlus}>
      {/*productMostSold?.map ((product: any) => (
          <div className="flex justify-center">{product.description}</div>
        ))*/}
      </Tabs.Item>
      <Tabs.Item title="Productos menos vendidos" icon={HiMinus}>
      {productLeastSold?.map ((product: any, index: number) => (
          <div className="flex justify-center" key={index}>{product.description}</div>
        ))}
      </Tabs.Item>
      <Tabs.Item title="Productos por mes" icon={HiCalendar}>
        This is <span className="font-medium text-gray-800 dark:text-white">Contacts tab's associated content</span>.
        Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
        control the content visibility and styling.
      </Tabs.Item>
      <Tabs.Item title="Mejores productos" icon={HiClipboardList}>
      {bestProducts?.map ((product: any, index: number) => (
          <div className="flex justify-center" key={index}>{product.description}</div>
        ))}
      </Tabs.Item>
      <Tabs.Item title="Peores productos" icon={HiClipboardList}>
        {worstProducts?.map ((product: any , index: number) => (
          <div className="flex justify-center" key={index}>{product.description}</div>
        ))}
      </Tabs.Item>
      <Tabs.Item title="Pedidos de usuarios por mes" icon={HiCalendar}>
      {/*ordersByUserMonth?.map ((order: any) => (
        <div className="flex justify-center">{order.description}</div>
      ))*/}
      </Tabs.Item>
      <Tabs.Item title="Deudores" icon={HiCash}>
      {/*debts?.map ((debt: any) => (
          <div className="flex justify-center">{debt}</div>
        ))*/}
      </Tabs.Item>

    </Tabs>
   </div></div></section>
    )
    
};

export default Metricas;