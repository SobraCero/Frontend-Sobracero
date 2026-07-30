export interface Donacion {
    id: number;
    tipo: string;
    kilos: number;
    vencimiento: string;
    publicado: Date;
    ubicacion: string;
    imagen: string;
    estado: 'disponible' | 'reservado' | 'entregado';
    receptor?: {
        ong: string;
        ubicacionDestino: string;
        fechaRecibido: string;
    };
    ong?: string;
}