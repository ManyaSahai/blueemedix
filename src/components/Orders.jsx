import { useGetAllOrdersQuery } from "../redux/ordersApi";

export default function Orders(){

    const {data} = useGetAllOrdersQuery();
    console.log(data)

    return(
        <h1>Orders</h1>
    );
}