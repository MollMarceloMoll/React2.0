import api from "./index";

export async function getProductos() {
    const res = await api.get("/productos");
    return res.data;
}


export async function crearProducto(producto: any) {
    const res = await api.post("/productos", producto);
    return res.data;
}