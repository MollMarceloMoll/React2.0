import api from "./index";

export async function getVeterinaria() {
    const res = await api.get("/veterinaria");
    return res.data;
}

export async function crearProducto(producto: any) {
    const res = await api.post("/veterinaria", producto);
    return res.data;
}