import api from "./index";

export async function getAcceosorios() {
    const res = await api.get("/productos");
    return res.data;
}

export async function crearProducto(producto: any) {
    const res = await api.post("/accesorios", producto);
    return res.data;
}