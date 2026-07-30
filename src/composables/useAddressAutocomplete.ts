import { ref } from 'vue';

export function useAddressAutocomplete() {
    const sugerencias = ref<any[]>([]);
    const mostrarSugerencias = ref(false);
    let timeout: any = null;

    const buscarDirecciones = (query: string) => {
        // Limpiamos el timeout anterior (Debounce)
        if (timeout) clearTimeout(timeout);

        if (!query || query.length < 3) {
            sugerencias.value = [];
            mostrarSugerencias.value = false;
            return;
        }

        timeout = setTimeout(async () => {
            try {
                // Agregamos "Chile" a la búsqueda para mejorar la precisión local
                const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query + ', Chile')}&limit=5`);
                if (response.ok) {
                    const data = await response.json();
                    sugerencias.value = data.features;
                    mostrarSugerencias.value = data.features.length > 0;
                }
            } catch (error) {
                console.error('Error buscando direcciones:', error);
            }
        }, 300); // 300ms de retraso
    };

    const formatearDireccion = (feature: any) => {
        const p = feature.properties;
        const partes = [];

        // Armar la calle y número
        if (p.street) {
            partes.push(`${p.street} ${p.housenumber || ''}`.trim());
        } else if (p.name) {
            partes.push(p.name);
        }

        // Agregar ciudad/comuna y región
        if (p.city || p.town) partes.push(p.city || p.town);
        if (p.state) partes.push(p.state);

        return partes.join(', ');
    };

    return {
        sugerencias,
        mostrarSugerencias,
        buscarDirecciones,
        formatearDireccion
    };
}