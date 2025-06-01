import { Component, AfterViewInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Ampliar cada entrada con una descripción larga y realista
interface GuideEntry {
  img: string;
  alt: string;
  title: string;
  desc: string;
  longDesc?: string;
}

@Component({
  selector: 'app-guides',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './guides.component.html',
  styleUrls: ['./guides.component.css']
})
export class GuidesComponent implements AfterViewInit {
  // Artículos destacados
  featuredArticles: GuideEntry[] = [
    {
      img: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80',
      alt: 'Entrenamiento básico perro',
      title: 'Entrena a tu perro: Comandos básicos',
      desc: 'Aprende los comandos esenciales para educar a tu perro de forma efectiva.',
      longDesc: `🐶 El entrenamiento básico es fundamental para la convivencia y seguridad de tu perro.

👉 Comienza con comandos simples como "sentado", "quieto", "ven" y "abajo". Utiliza refuerzos positivos, como premios y caricias, para motivar a tu mascota.

⏳ Practica en sesiones cortas y frecuentes, y sé paciente: cada perro aprende a su ritmo.

💡 Recuerda: la constancia y la paciencia son claves para lograr resultados duraderos.

🎉 Un perro bien entrenado es más feliz, seguro y sociable.`
    },
    {
      img: 'https://images.unsplash.com/photo-1518715308788-3005759c41c8?auto=format&fit=crop&w=400&q=80',
      alt: 'Comportamiento gato',
      title: 'Entendiendo el comportamiento felino',
      desc: 'Descubre cómo piensan los gatos y fortalece vuestro vínculo.',
      longDesc: `🐱 Los gatos son animales fascinantes con comportamientos a menudo misteriosos para sus dueños.

💬 Entender su lenguaje corporal, vocalizaciones y hábitos es clave para fortalecer el vínculo con tu felino.

🎯 Por ejemplo, un gato que frota su cabeza contra ti está mostrando afecto y marcando territorio.

🧶 Rascar es un comportamiento natural que les ayuda a afilar sus garras y marcar su territorio. Proporcionar rascadores y juguetes interactivos puede ayudar a mantener a tu gato feliz y saludable.

🛁 Además, los gatos son animales muy limpios que dedican una gran parte de su día a acicalarse. Este comportamiento no solo les ayuda a mantenerse limpios, sino que también es una forma de relajación.

⚠️ Si tu gato se acicala en exceso, puede ser un signo de estrés o problemas de piel, así que asegúrate de proporcionarle un ambiente tranquilo y revisa su piel regularmente.`
    },
    {
      img: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=400&q=80',
      alt: 'Cuidados conejo',
      title: 'Cuidados para tu conejo',
      desc: 'Consejos para mantener a tu conejo sano y feliz.',
      longDesc: `🐰 Los conejos son mascotas adorables y cariñosas, pero requieren cuidados específicos para mantenerse saludables y felices.

🥕 Es fundamental proporcionarles una dieta equilibrada, rica en heno, verduras frescas y pellets de alta calidad. El heno debe constituir la mayor parte de su dieta, ya que es esencial para su salud dental y digestiva.

💧 Además, los conejos necesitan acceso constante a agua fresca y limpia.

🏡 Su espacio debe ser seguro y cómodo, con suficiente área para moverse, jugar y explorar. Los conejos son animales muy activos e inteligentes que necesitan estimulación mental y física.

🎾 Proporciona juguetes seguros y realiza sesiones de juego diario para mantenerlos entretenidos.

🩺 También es importante programar visitas regulares al veterinario para chequeos de salud y vacunaciones.

👶 La socialización es clave desde una edad temprana para asegurar que tu conejo sea amigable y esté bien adaptado.

📅 Recuerda que los conejos son animales de carga y pueden vivir entre 8 y 12 años, por lo que adoptar un conejo es un compromiso a largo plazo.`
    },
    {
      img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
      alt: 'Cuidados pájaro',
      title: 'Cuidados básicos para aves',
      desc: 'Todo lo que necesitas saber para cuidar a tu ave doméstica.',
      longDesc: `🐦 Cuidar de un ave doméstica puede ser una experiencia muy gratificante, pero también implica una gran responsabilidad.

🍽️ Las aves necesitan una dieta equilibrada que varía según la especie, pero generalmente incluye semillas, frutas, verduras y, en algunos casos, proteínas como huevos o insectos. Es crucial investigar las necesidades dietéticas específicas de tu ave y proporcionar suplementos vitamínicos si es necesario.

🏠 El alojamiento es otro aspecto clave en el cuidado de las aves. Necesitan una jaula espaciosa y segura, con barrotes lo suficientemente estrechos como para evitar que se escapen. La jaula debe limpiarse regularmente para prevenir enfermedades.

🧩 Además, las aves son animales muy sociales e inteligentes que requieren estimulación mental y física. Proporciona juguetes, perchas y oportunidades para volar y explorar fuera de la jaula en un ambiente seguro.

🛁 Las aves también necesitan baños regulares para mantener su plumaje en buen estado y prevenir problemas de piel.

🩺 Por último, es importante programar chequeos veterinarios regulares para asegurarte de que tu ave esté sana y libre de enfermedades.`
    },
    {
      img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
      alt: 'Perro mayor',
      title: 'Cuidados para perros mayores',
      desc: 'Recomendaciones para el bienestar de tu perro en la vejez.',
      longDesc: `🦴 A medida que los perros envejecen, sus necesidades cambian y es importante ajustar su cuidado para asegurar su bienestar.

🍽️ La alimentación es un aspecto crucial; los perros mayores a menudo requieren una dieta especial que sea más fácil de digerir y que contenga nutrientes que apoyen la salud de las articulaciones, como los ácidos grasos omega-3.

🏃 El ejercicio sigue siendo importante en la vejez, pero puede que tu perro no necesite tantas actividades intensas como antes. Paseos más cortos y juegos suaves pueden ser suficientes para mantenerlo en forma y saludable.

🛁 También es un buen momento para introducir actividades de bajo impacto, como nadar, que son suaves para las articulaciones.

🩺 Además, los perros mayores son más propensos a desarrollar problemas de salud, como artritis, problemas dentales y enfermedades cardíacas. Por eso, es esencial realizar chequeos veterinarios regulares para detectar y tratar cualquier problema de salud de manera temprana.

🛌 Por último, asegúrate de que tu perro tenga un lugar cómodo y cálido para descansar, ya que los perros mayores pueden ser más sensibles a las temperaturas extremas.`
    },
    {
      img: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fd8?auto=format&fit=crop&w=400&q=80',
      alt: 'Gato en adopción',
      title: 'Adopta un gato: Lo que debes saber',
      desc: 'Guía para una adopción responsable y feliz.',
      longDesc: `🐱 Adoptar un gato es una experiencia gratificante, pero también conlleva una gran responsabilidad.

📅 Antes de adoptar, es importante considerar varios factores para asegurarte de que estás listo para cuidar de un gato. Los gatos pueden vivir entre 12 y 15 años, o incluso más, por lo que adoptar un gato es un compromiso a largo plazo.

🍽️ Necesitan una dieta equilibrada, atención veterinaria regular, y un ambiente seguro y enriquecido. Además, los gatos son animales muy limpios que dedican mucho tiempo a acicalarse, pero también necesitan tu ayuda para mantener su higiene, especialmente si son de pelo largo.

👥 La socialización es clave, especialmente si estás adoptando un gato adulto. Tómate el tiempo para conocer a tu gato y permitirle que se adapte a su nuevo hogar a su propio ritmo.

🏠 Proporciona un lugar tranquilo y seguro donde pueda retirarse si se siente abrumado.

🛒 Por último, pero no menos importante, asegúrate de que tu hogar esté preparado para un gato. Esto incluye tener los suministros necesarios, como comida, agua, una caja de arena, rascadores y juguetes. También es importante hacer que tu hogar sea seguro, asegurándote de que no haya plantas tóxicas, cables sueltos o pequeños objetos que pueda tragar.`
    },
    {
      img: 'https://images.unsplash.com/photo-1518717764422-6dc5118520e1?auto=format&fit=crop&w=400&q=80',
      alt: 'Perro y ejercicio',
      title: 'Ejercicio diario para tu perro',
      desc: 'Ideas para mantener a tu perro activo y saludable.',
      longDesc: `🏃‍♂️ El ejercicio diario es esencial para la salud y el bienestar de tu perro.

✅ No solo ayuda a mantener un peso saludable, sino que también es crucial para su salud mental. Los perros que no hacen suficiente ejercicio pueden desarrollar problemas de comportamiento, como morder o cavar.

💪 Además, el ejercicio regular ayuda a fortalecer los músculos y las articulaciones, y puede prevenir enfermedades como la diabetes y la hipertensión.

📅 Las necesidades de ejercicio de tu perro dependerán de su edad, raza y estado de salud general. Los perros jóvenes y activos, como los cachorros y los perros de trabajo, necesitarán más ejercicio que los perros mayores o menos activos.

🎾 Es importante encontrar un equilibrio y adaptar la rutina de ejercicio de tu perro a sus necesidades individuales. Algunas ideas de ejercicio incluyen paseos, carreras, juegos de fetch, y natación.

🧩 También es beneficioso proporcionar juguetes interactivos que estimulen mentalmente a tu perro y lo mantengan activo incluso cuando estás en casa.`
    },
    {
      img: 'https://images.unsplash.com/photo-1518717764422-6dc5118520e1?auto=format&fit=crop&w=400&q=80',
      alt: 'Gato y enriquecimiento',
      title: 'Enriquecimiento ambiental para gatos',
      desc: 'Cómo estimular la mente y el cuerpo de tu felino.',
      longDesc: `🏡 El enriquecimiento ambiental es fundamental para mantener a tu gato feliz y saludable, especialmente si vive en un apartamento o en un espacio pequeño.

🐾 Los gatos son animales curiosos e inteligentes que necesitan estimulación mental y física para evitar el aburrimiento y el estrés.

🧩 Una forma de enriquecer el ambiente de tu gato es a través de juguetes interactivos que desafíen su mente y lo mantengan entretenido.

🛋️ Los rascadores son esenciales no solo para mantener sus garras en buen estado, sino también para proporcionar un lugar donde pueda estirarse y ejercitarse.

🌳 Además, considera la posibilidad de crear un espacio seguro al aire libre donde tu gato pueda explorar y disfrutar del sol. Esto puede ser un balcón cerrado, un patio o incluso un árbol para gatos.

📏 También es importante proporcionar lugares altos donde tu gato pueda trepar y observar su territorio desde arriba.

🐱 Recuerda que cada gato es único, así que tómate el tiempo para descubrir qué tipo de enriquecimiento disfruta más tu felino.`
    },
    {
      img: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fd8?auto=format&fit=crop&w=400&q=80',
      alt: 'Conejo y salud',
      title: 'Salud preventiva en conejos',
      desc: 'Vacunas y revisiones recomendadas para tu conejo.',
      longDesc: `🩺 La salud preventiva es clave para asegurar una vida larga y saludable para tu conejo.

💉 Esto incluye vacunaciones regulares, chequeos veterinarios y cuidados dentales. Los conejos son propensos a ciertos problemas de salud, como enfermedades dentales, problemas digestivos y enfermedades respiratorias, por lo que es importante estar atento a cualquier signo de enfermedad y llevar a tu conejo al veterinario para chequeos regulares.

🥗 Además, la alimentación juega un papel crucial en la salud de tu conejo. Una dieta equilibrada, rica en heno, verduras frescas y pellets de alta calidad, es esencial para mantener su sistema digestivo en buen estado y prevenir problemas como la obesidad y los trastornos gastrointestinales.

💧 También es importante proporcionar agua fresca y limpia en todo momento.

🏃 El ejercicio regular es otro componente clave de la salud preventiva. Asegúrate de que tu conejo tenga suficiente espacio para moverse y explorar, y proporciona juguetes y actividades que estimulen su mente y cuerpo.

🛌 Por último, pero no menos importante, asegúrate de que el entorno de tu conejo sea seguro y limpio, y que tenga un lugar cómodo y cálido para descansar.`
    }
  ];

  // Tips de cuidado
  tips: GuideEntry[] = [
    {
      img: 'https://images.unsplash.com/photo-1518717764422-6dc5118520e1?auto=format&fit=crop&w=400&q=80',
      alt: 'Consejo 1',
      title: 'Consejo de cuidado 1',
      desc: 'Descripción corta del consejo de cuidado 1.',
      longDesc: `Detalles extensos y útiles sobre el consejo de cuidado 1.`
    },
    {
      img: 'https://images.unsplash.com/photo-1518717764422-6dc5118520e1?auto=format&fit=crop&w=400&q=80',
      alt: 'Consejo 2',
      title: 'Consejo de cuidado 2',
      desc: 'Descripción corta del consejo de cuidado 2.',
      longDesc: `Detalles extensos y útiles sobre el consejo de cuidado 2.`
    },
    {
      img: 'https://images.unsplash.com/photo-1518717764422-6dc5118520e1?auto=format&fit=crop&w=400&q=80',
      alt: 'Consejo 3',
      title: 'Consejo de cuidado 3',
      desc: 'Descripción corta del consejo de cuidado 3.',
      longDesc: `Detalles extensos y útiles sobre el consejo de cuidado 3.`
    },
    {
      img: 'https://images.unsplash.com/photo-1518717764422-6dc5118520e1?auto=format&fit=crop&w=400&q=80',
      alt: 'Consejo 4',
      title: 'Consejo de cuidado 4',
      desc: 'Descripción corta del consejo de cuidado 4.',
      longDesc: `Detalles extensos y útiles sobre el consejo de cuidado 4.`
    },
    {
      img: 'https://images.unsplash.com/photo-1518717764422-6dc5118520e1?auto=format&fit=crop&w=400&q=80',
      alt: 'Consejo 5',
      title: 'Consejo de cuidado 5',
      desc: 'Descripción corta del consejo de cuidado 5.',
      longDesc: `Detalles extensos y útiles sobre el consejo de cuidado 5.`
    }
  ];

  // Guías
  guides: GuideEntry[] = [
    {
      img: 'https://images.unsplash.com/photo-1518717764422-6dc5118520e1?auto=format&fit=crop&w=400&q=80',
      alt: 'Guía 1',
      title: 'Guía de cuidado 1',
      desc: 'Descripción corta de la guía de cuidado 1.',
      longDesc: `Detalles extensos y útiles sobre la guía de cuidado 1.`
    },
    {
      img: 'https://images.unsplash.com/photo-1518717764422-6dc5118520e1?auto=format&fit=crop&w=400&q=80',
      alt: 'Guía 2',
      title: 'Guía de cuidado 2',
      desc: 'Descripción corta de la guía de cuidado 2.',
      longDesc: `Detalles extensos y útiles sobre la guía de cuidado 2.`
    },
    {
      img: 'https://images.unsplash.com/photo-1518717764422-6dc5118520e1?auto=format&fit=crop&w=400&q=80',
      alt: 'Guía 3',
      title: 'Guía de cuidado 3',
      desc: 'Descripción corta de la guía de cuidado 3.',
      longDesc: `Detalles extensos y útiles sobre la guía de cuidado 3.`
    },
    {
      img: 'https://images.unsplash.com/photo-1518717764422-6dc5118520e1?auto=format&fit=crop&w=400&q=80',
      alt: 'Guía 4',
      title: 'Guía de cuidado 4',
      desc: 'Descripción corta de la guía de cuidado 4.',
      longDesc: `Detalles extensos y útiles sobre la guía de cuidado 4.`
    },
    {
      img: 'https://images.unsplash.com/photo-1518717764422-6dc5118520e1?auto=format&fit=crop&w=400&q=80',
      alt: 'Guía 5',
      title: 'Guía de cuidado 5',
      desc: 'Descripción corta de la guía de cuidado 5.',
      longDesc: `Detalles extensos y útiles sobre la guía de cuidado 5.`
    }
  ];

  // Remove old index-based navigation properties and methods
  // featuredIndex, tipsIndex, guidesIndex, get ...Visible(), prev/next...()

  // --- Keep only slice-based navigation ---
  // Carrusel: mostrar 5 a la vez
  featuredStart = 0;
  featuredEnd = 5;
  tipsStart = 0;
  tipsEnd = 5;
  guidesStart = 0;
  guidesEnd = 5;

  // --- Navigation methods for slice-based carousels ---
  nextFeatured() {
    if (this.featuredEnd < this.filteredFeaturedArticles.length) {
      this.featuredStart++;
      this.featuredEnd++;
    }
  }
  prevFeatured() {
    if (this.featuredStart > 0) {
      this.featuredStart--;
      this.featuredEnd--;
    }
  }
  nextTips() {
    if (this.tipsEnd < this.filteredTips.length) {
      this.tipsStart++;
      this.tipsEnd++;
    }
  }
  prevTips() {
    if (this.tipsStart > 0) {
      this.tipsStart--;
      this.tipsEnd--;
    }
  }
  nextGuides() {
    if (this.guidesEnd < this.filteredGuides.length) {
      this.guidesStart++;
      this.guidesEnd++;
    }
  }
  prevGuides() {
    if (this.guidesStart > 0) {
      this.guidesStart--;
      this.guidesEnd--;
    }
  }

  // --- Reset indices when search changes ---
  private _searchText: string = '';
  get searchText() {
    return this._searchText;
  }
  set searchText(val: string) {
    this._searchText = val;
    this.resetCarouselIndices();
  }
  resetCarouselIndices() {
    this.featuredStart = 0;
    this.featuredEnd = 5;
    this.tipsStart = 0;
    this.tipsEnd = 5;
    this.guidesStart = 0;
    this.guidesEnd = 5;
  }

  // --- Filtering logic (unchanged) ---
  get filteredFeaturedArticles(): GuideEntry[] {
    if (!this.searchText.trim()) return this.featuredArticles;
    const q = this.searchText.toLowerCase();
    return this.featuredArticles.filter((a: GuideEntry) =>
      a.title.toLowerCase().includes(q) ||
      a.desc.toLowerCase().includes(q) ||
      (a.longDesc && a.longDesc.toLowerCase().includes(q))
    );
  }
  get filteredTips(): GuideEntry[] {
    if (!this.searchText.trim()) return this.tips;
    const q = this.searchText.toLowerCase();
    return this.tips.filter((a: GuideEntry) =>
      a.title.toLowerCase().includes(q) ||
      a.desc.toLowerCase().includes(q) ||
      (a.longDesc && a.longDesc.toLowerCase().includes(q))
    );
  }
  get filteredGuides(): GuideEntry[] {
    if (!this.searchText.trim()) return this.guides;
    const q = this.searchText.toLowerCase();
    return this.guides.filter((a: GuideEntry) =>
      a.title.toLowerCase().includes(q) ||
      a.desc.toLowerCase().includes(q) ||
      (a.longDesc && a.longDesc.toLowerCase().includes(q))
    );
  }

  // Nueva propiedad para controlar el modal y la entrada seleccionada
  selectedEntry: GuideEntry | null = null;
  modalOpen = false;

  openModal(entry: GuideEntry) {
    this.selectedEntry = entry;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedEntry = null;
  }

  @ViewChild('interactiveBgCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    // Fondo interactivo eliminado
  }
}
