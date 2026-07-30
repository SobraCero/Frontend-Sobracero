<template>
  <div class="min-h-screen font-sans text-slate-800 bg-[#fafaf9] overflow-x-hidden selection:bg-emerald-200">
    <!-- NAVBAR FLOTANTE -->
    <header class="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-stone-200/50 transition-all duration-300" :class="{'shadow-sm': scrolled}">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div class="flex items-center gap-1 cursor-pointer" @click="scrollToTop">
          <img src="/logo-sobra-cero.png" alt="Logo SobraCero" class="h-16 w-auto object-contain" />
          <span class="text-2xl font-black tracking-tight text-emerald-900 hidden sm:block">SobraCero</span>
        </div>

        <nav class="hidden md:flex gap-8 items-center text-sm font-bold text-stone-600">
          <a href="#inicio" class="hover:text-emerald-600 transition-colors">Inicio</a>
          <a href="#como-funciona" class="hover:text-emerald-600 transition-colors">¿Cómo funciona?</a>
          <a href="#impacto" class="hover:text-emerald-600 transition-colors">Impacto</a>
          <a href="#preguntas" class="hover:text-emerald-600 transition-colors">Preguntas Frecuentes</a>
        </nav>

        <div class="flex items-center gap-4">
          <button @click="irALogin" class="hidden sm:block px-5 py-2.5 text-sm font-bold text-stone-600 hover:text-emerald-700 transition-colors">
            Iniciar Sesión
          </button>
          <button @click="irARegistro" class="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all active:scale-95">
            Únete
          </button>
        </div>
      </div>
    </header>

    <!-- 1. HERO SECTION (Carrusel) -->
    <section id="inicio" class="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20">
      
      <!-- Carrusel de Imágenes de Fondo -->
      <transition-group name="fade" tag="div" class="absolute inset-0 z-0">
        <div 
          v-for="(slide, index) in heroSlides" 
          :key="`bg-${index}`"
          v-show="currentSlide === index"
          class="absolute inset-0 w-full h-full"
        >
          <img :src="slide.image" alt="Fondo SobraCero" class="w-full h-full object-cover object-center" />
          <!-- Overlays para asegurar legibilidad del texto -->
          <div class="absolute inset-0 bg-emerald-950/60 mix-blend-multiply"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent"></div>
        </div>
      </transition-group>
      
      <div class="max-w-7xl mx-auto px-6 w-full relative z-10 py-12 flex flex-col items-center text-center">
        <transition name="slide-up" mode="out-in">
          <div :key="`text-${currentSlide}`" class="flex flex-col items-center">
            <h1 class="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight drop-shadow-xl" v-html="slide.title" v-for="(slide, index) in heroSlides" v-show="currentSlide === index" :key="`title-${index}`">
            </h1>
            
            <p class="text-lg md:text-xl text-emerald-50/90 mb-10 leading-relaxed max-w-2xl drop-shadow-md" v-for="(slide, index) in heroSlides" v-show="currentSlide === index" :key="`desc-${index}`">
              {{ slide.subtitle }}
            </p>
          </div>
        </transition>

        <!-- Controles del Carrusel -->
        <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          <button 
            v-for="(_, index) in heroSlides" 
            :key="`dot-${index}`"
            @click="setSlide(index)"
            class="h-1.5 rounded-full transition-all duration-500"
            :class="currentSlide === index ? 'w-8 bg-emerald-400' : 'w-2 bg-white/50 hover:bg-white/80'"
            aria-label="Cambiar slide"
          ></button>
        </div>
      </div>
    </section>


    <!-- 3. ¿CÓMO FUNCIONA? -->
    <section id="como-funciona" class="py-24 px-6 bg-[#f3f4f6] relative border-y border-stone-200 scroll-mt-20">
      <div class="max-w-7xl mx-auto relative z-10">
        <div class="mb-16 text-center flex flex-col items-center">
          <h2 class="text-4xl md:text-5xl font-black mb-4 text-slate-900">¿Cómo funciona?</h2>
          <p class="text-lg text-stone-500 max-w-xl text-center">Un flujo transparente y automatizado para que la ayuda llegue rápido, sin crear páginas adicionales.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-6 lg:gap-8">
          
          <!-- Paso 1 -->
          <div class="bg-white rounded-3xl pt-8 px-8 pb-0 border border-stone-100 shadow-sm hover:shadow-xl transition-shadow flex flex-col h-full overflow-hidden relative">
            <h3 class="text-xl md:text-2xl font-bold text-slate-800 mb-3">Publica excedentes</h3>
            <p class="text-stone-500 leading-relaxed mb-6 flex-grow">
              Restaurantes o personas suben los alimentos disponibles en buen estado a la plataforma de manera rápida.
            </p>
            <!-- Mockup CSS -->
            <div class="mt-auto relative w-full h-48 bg-stone-50 rounded-t-xl border-x border-t border-stone-200 p-4 flex flex-col gap-3">
              <div class="flex gap-3 items-center">
                <div class="w-10 h-10 bg-emerald-100 rounded-lg shrink-0 flex items-center justify-center">
                  <BoxIcon class="w-5 h-5 text-emerald-600" />
                </div>
                <div class="flex-1 space-y-2">
                  <div class="h-2.5 bg-stone-200 rounded w-3/4"></div>
                  <div class="h-2 bg-stone-200 rounded w-1/2"></div>
                </div>
              </div>
              <div class="h-20 bg-white rounded-lg border border-stone-100 p-3 shadow-sm flex flex-col justify-between">
                <div class="space-y-2">
                  <div class="h-1.5 bg-stone-100 rounded w-full"></div>
                  <div class="h-1.5 bg-stone-100 rounded w-full"></div>
                  <div class="h-1.5 bg-stone-100 rounded w-2/3"></div>
                </div>
              </div>
              <div class="absolute bottom-4 right-4 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md z-10">
                Publicar
              </div>
            </div>
          </div>

          <!-- Paso 2 -->
          <div class="bg-white rounded-3xl pt-8 px-8 pb-0 border border-stone-100 shadow-sm hover:shadow-xl transition-shadow flex flex-col h-full overflow-hidden relative">
            <h3 class="text-xl md:text-2xl font-bold text-slate-800 mb-3">Reserva por ONGs</h3>
            <p class="text-stone-500 leading-relaxed mb-6 flex-grow">
              Las fundaciones exploran las donaciones disponibles y reservan los alimentos que necesitan para su comunidad.
            </p>
            <!-- Mockup CSS -->
            <div class="mt-auto relative w-full h-48 bg-emerald-50 rounded-t-xl border-x border-t border-emerald-100 flex flex-col p-4 gap-3 overflow-hidden">
              <div class="flex gap-2 mb-1">
                <div class="w-1/2 h-20 bg-white rounded-lg border border-emerald-200 p-2 shadow-sm flex flex-col opacity-70">
                  <div class="w-full h-8 bg-stone-100 rounded mb-2"></div>
                  <div class="h-1.5 bg-stone-200 w-3/4 rounded mb-1"></div>
                  <div class="h-1 bg-stone-200 w-1/2 rounded"></div>
                </div>
                <!-- Card Reservada -->
                <div class="w-1/2 h-24 bg-white rounded-lg border-2 border-emerald-500 p-2 shadow-lg flex flex-col relative scale-105 z-10 -ml-2 mt-4">
                  <div class="w-full h-10 bg-emerald-100 rounded mb-2 flex items-center justify-center">
                    <CheckIcon class="w-4 h-4 text-emerald-600" />
                  </div>
                  <div class="h-1.5 bg-stone-200 w-3/4 rounded mb-1"></div>
                  <div class="h-1 bg-stone-200 w-1/2 rounded"></div>
                  <div class="absolute -top-2 -right-2 bg-emerald-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow-md">
                    Reservado
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Paso 3 -->
          <div class="bg-white rounded-3xl pt-8 px-8 pb-0 border border-stone-100 shadow-sm hover:shadow-xl transition-shadow flex flex-col h-full overflow-hidden relative">
            <h3 class="text-xl md:text-2xl font-bold text-slate-800 mb-3">Retiro directo</h3>
            <p class="text-stone-500 leading-relaxed mb-6 flex-grow">
              La organización retira los alimentos directamente en el local del donante. Nosotros facilitamos la conexión.
            </p>
            <!-- Mockup CSS -->
            <div class="mt-auto relative w-full h-48 bg-sky-50 rounded-t-xl border-x border-t border-sky-100 overflow-hidden">
              <!-- Simple Map Background -->
              <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(#94a3b8 1.5px, transparent 1.5px); background-size: 20px 20px;"></div>
              
              <!-- Route Line -->
              <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 20 80 Q 50 20 80 30" fill="none" stroke="#10b981" stroke-width="2.5" stroke-dasharray="6,6" class="animate-pulse" />
              </svg>

              <!-- Pin 1 (Local) -->
              <div class="absolute bottom-6 left-6 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center z-10 border-2 border-emerald-500">
                <StoreIcon class="w-4 h-4 text-emerald-600" />
              </div>

              <!-- Pin 2 (ONG) -->
              <div class="absolute top-8 right-6 w-10 h-10 bg-emerald-600 rounded-full shadow-xl flex items-center justify-center z-10 animate-bounce">
                <MapPinIcon class="w-5 h-5 text-white" />
              </div>
              
              <div class="absolute bottom-4 right-4 bg-white text-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md border border-stone-100 flex items-center gap-1.5 z-20">
                <div class="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                En camino
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- 4. IMPACTO SOCIAL -->
    <section id="impacto" class="w-full flex flex-col justify-center py-24 px-6 bg-emerald-950 text-white relative overflow-hidden scroll-mt-20">
      <!-- Decoraciones de Fondo -->
      <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-700/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto relative z-10 w-full">
        <div class="grid lg:grid-cols-2 gap-10 items-center">
          
          <!-- Image (Left Side) -->
          <div class="relative order-2 lg:order-1 max-w-[360px] mx-auto lg:max-w-full">
            <div class="absolute inset-0 bg-emerald-500/20 blur-[50px] rounded-[3rem]"></div>
            <img src="/images/donacion.avif" alt="Entrega de alimentos rescatados" class="relative z-10 w-full h-auto object-cover rounded-3xl shadow-2xl border border-emerald-700/50" />
          </div>

          <!-- Text and Points (Right Side) -->
          <div class="order-1 lg:order-2 lg:pl-8">
            <h2 class="text-2xl md:text-3xl lg:text-4xl font-black mb-4 leading-tight">
              El verdadero impacto se mide en acciones.
            </h2>
            <p class="text-sm md:text-base text-emerald-100/80 mb-8 leading-relaxed">
              Creemos que cada alimento rescatado cuenta una historia de esperanza. Más que números, nos enfocamos en generar un cambio real y tangible en nuestra comunidad.
            </p>

            <!-- Puntos de Impacto (Lista sin iconos grandes) -->
            <div class="space-y-5">
              <div class="border-l-2 border-emerald-500 pl-4 py-1">
                <h3 class="text-base font-bold text-white mb-1">Reducción del Desperdicio</h3>
                <p class="text-sm text-emerald-100/70">Evitamos que alimentos en perfecto estado terminen en la basura.</p>
              </div>
              
              <div class="border-l-2 border-emerald-500 pl-4 py-1">
                <h3 class="text-base font-bold text-white mb-1">El Puente Ideal</h3>
                <p class="text-sm text-emerald-100/70">Actuamos como intermediarios entre quienes tienen excedentes y las ONGs que los retiran directamente.</p>
              </div>
              
              <div class="border-l-2 border-emerald-500 pl-4 py-1">
                <h3 class="text-base font-bold text-white mb-1">Catálogo Disponible</h3>
                <p class="text-sm text-emerald-100/70">Las fundaciones pueden explorar y reservar lo que realmente necesitan, optimizando la ayuda.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- 5. PREGUNTAS FRECUENTES -->
    <section id="preguntas" class="py-24 px-6 bg-white relative scroll-mt-20">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-black mb-4 text-slate-900">Preguntas Frecuentes</h2>
          <p class="text-lg text-stone-500">Resolvemos tus dudas sobre cómo funciona la red de donación.</p>
        </div>

        <div class="space-y-4">
          <!-- Pregunta 1 -->
          <details class="group bg-[#fafaf9] rounded-2xl border border-stone-200 overflow-hidden" open>
            <summary class="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-slate-800 hover:text-emerald-700 transition-colors">
              <span class="text-lg">¿Tiene algún costo utilizar la plataforma?</span>
              <span class="transition group-open:rotate-180">
                <ChevronDownIcon class="w-5 h-5 text-emerald-600" />
              </span>
            </summary>
            <div class="text-stone-500 px-6 pb-6 leading-relaxed">
              No, SobraCero es una plataforma completamente gratuita tanto para los locales que publican donaciones como para las organizaciones sociales que las reservan y retiran. Nuestro objetivo es reducir la merma, no cobrar por ella.
            </div>
          </details>
          
          <!-- Pregunta 2 -->
          <details class="group bg-[#fafaf9] rounded-2xl border border-stone-200 overflow-hidden">
            <summary class="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-slate-800 hover:text-emerald-700 transition-colors">
              <span class="text-lg">¿Qué tipo de alimentos se pueden publicar?</span>
              <span class="transition group-open:rotate-180">
                <ChevronDownIcon class="w-5 h-5 text-emerald-600" />
              </span>
            </summary>
            <div class="text-stone-500 px-6 pb-6 leading-relaxed">
              Se pueden publicar alimentos preparados excedentes, productos envasados próximos a vencer, frutas y verduras fuera del estándar comercial pero aptas para consumo. Todo debe estar en perfectas condiciones de inocuidad.
            </div>
          </details>

          <!-- Pregunta 3 -->
          <details class="group bg-[#fafaf9] rounded-2xl border border-stone-200 overflow-hidden">
            <summary class="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-slate-800 hover:text-emerald-700 transition-colors">
              <span class="text-lg">¿Cómo se valida a las ONGs registradas?</span>
              <span class="transition group-open:rotate-180">
                <ChevronDownIcon class="w-5 h-5 text-emerald-600" />
              </span>
            </summary>
            <div class="text-stone-500 px-6 pb-6 leading-relaxed">
              Toda organización social, comedor o fundación pasa por un proceso de verificación manual por nuestro equipo donde deben demostrar su personalidad jurídica y que activamente entregan alimentos a personas vulnerables.
            </div>
          </details>

          <!-- Pregunta 4 -->
          <details class="group bg-[#fafaf9] rounded-2xl border border-stone-200 overflow-hidden">
            <summary class="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-slate-800 hover:text-emerald-700 transition-colors">
              <span class="text-lg">¿Quién es el responsable del retiro?</span>
              <span class="transition group-open:rotate-180">
                <ChevronDownIcon class="w-5 h-5 text-emerald-600" />
              </span>
            </summary>
            <div class="text-stone-500 px-6 pb-6 leading-relaxed">
              La organización social que reserva la donación es la responsable de enviar a alguien de su equipo a retirar los alimentos al local en el horario establecido en la publicación.
            </div>
          </details>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-emerald-950 pt-20 pb-10 px-6 border-t border-emerald-900">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div class="md:col-span-1">
            <div class="flex items-center gap-1 mb-6">
              <img src="/logo-sobra-cero.png" alt="Logo" class="h-10 w-auto object-contain brightness-0 invert" />
              <span class="text-xl font-black text-white">SobraCero</span>
            </div>
            <p class="text-emerald-100/70 text-sm leading-relaxed">Conectando excedentes alimentarios con quienes más lo necesitan a través de la tecnología.</p>
          </div>

          <div>
            <h4 class="font-bold text-white mb-4">Plataforma</h4>
            <ul class="space-y-3 text-sm text-emerald-100/70">
              <li><a href="#como-funciona" class="hover:text-emerald-400 transition-colors">¿Cómo funciona?</a></li>
              <li><a href="#impacto" class="hover:text-emerald-400 transition-colors">Impacto Social</a></li>
              <li><a href="#preguntas" class="hover:text-emerald-400 transition-colors">Preguntas Frecuentes</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-white mb-4">Compañía</h4>
            <ul class="space-y-3 text-sm text-emerald-100/70">
              <li><a href="#" class="hover:text-emerald-400 transition-colors">Sobre Nosotros</a></li>
              <li><a href="#" class="hover:text-emerald-400 transition-colors">Contacto</a></li>
              <li><a href="#" class="hover:text-emerald-400 transition-colors">Términos Legales</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-white mb-4">Contacto</h4>
            <ul class="space-y-3 text-sm text-emerald-100/70">
              <li class="flex items-center gap-2"><MessageSquareIcon class="w-4 h-4 text-emerald-500" /> soportesobracero@gmail.com</li>
              <li class="flex items-center gap-2"><MapPinIcon class="w-4 h-4 text-emerald-500" /> Temuco, Chile</li>
            </ul>
          </div>
        </div>

        <div class="border-t border-emerald-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-emerald-100/50">
          <p>© 2026 SobraCero. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  LeafIcon, HeartIcon, ArrowRightIcon, MapPinIcon, BellIcon, BoxIcon,
  UsersIcon, StoreIcon, ShoppingCartIcon, BuildingIcon,
  CheckCircleIcon, PlayIcon, MessageSquareIcon, QuoteIcon,
  ChevronDownIcon, CheckIcon
} from 'lucide-vue-next';

const router = useRouter();

const irALogin = () => router.push('/login');
const irARegistro = () => router.push('/registro');

// Lógica del Carrusel
const currentSlide = ref(0);
let slideInterval: number | ReturnType<typeof setInterval> | null = null;

const heroSlides = [
  {
    image: '/images/landing.jpg',
    title: 'Menos desperdicio,<br/>más impacto social.',
    subtitle: 'SobraCero es la red tecnológica que une a locales comerciales con organizaciones sociales para evitar el desperdicio de comida y generar un impacto real.'
  },
  {
    image: '/images/alimentos.avif',
    title: 'Rescata alimentos,<br/>alimenta comunidades.',
    subtitle: 'Cada producto salvado es una oportunidad para nutrir a quienes más lo necesitan en nuestra ciudad.'
  },
  {
    image: '/images/desperdicio.jpg',
    title: 'Detengamos el<br/>desperdicio juntos.',
    subtitle: 'Miles de toneladas de comida en perfecto estado se tiran cada día. Únete a la solución.'
  },
  {
    image: '/images/que%20es%20merma.webp',
    title: 'Convierte tu merma<br/>en esperanza.',
    subtitle: 'Lo que para tu local es un excedente, para una fundación es el plato principal del día.'
  }
];

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % heroSlides.length;
};

const setSlide = (index: number) => {
  currentSlide.value = index;
  resetInterval();
};

const resetInterval = () => {
  if (slideInterval) clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 6000);
};

// Control de Navbar al scrollear
const scrolled = ref(false);

const handleScroll = () => {
  scrolled.value = window.scrollY > 20;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  resetInterval();
});

onUnmounted(() => {
  window.addEventListener('scroll', handleScroll);
  if (slideInterval) clearInterval(slideInterval);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}

.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }

.animate-float {
  animation: float 4s ease-in-out infinite;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 5rem;
}
</style>