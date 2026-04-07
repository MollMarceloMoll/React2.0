import api from "./index";

export async function getGranja() {
    const res = await api.get("/granja");
    return res.data;
}

export async function crearProducto(producto: any) {
    const res = await api.post("/granja", producto);
    return res.data;
}