/**
 * MAPA DE LA APLICACIÓN PSICOFACT
 * Este objeto sirve como base de conocimientos para que la IA entienda la estructura
 * y funcionalidades de la aplicación sin depender de un manual externo.
 */

const PSICOFACT_APP_MAP = {
    nombre: "PsicoFact",
    version: "2026.1",
    descripcion: "Sistema de gestión integral para psicólogos y gabinetes de psicología.",
    
    arquitectura: {
        frontend: "HTML5, CSS3, JavaScript (ES6+)",
        backend_db: "Firebase Firestore",
        autenticacion: "Firebase Auth",
        ia: "Google Gemini API"
    },

    paginas_principales: {
        "index.html": "Página de inicio y pantalla de login. Punto de entrada principal.",
        "agenda.html": "Gestión de citas y calendario. Sincronización con Google Calendar.",
        "pacientes.html": "Listado general de pacientes activos y gestión de altas.",
        "Expediente_paciente.html": "Vista detallada de un paciente: historia clínica, sesiones y evolución.",
        "psilogia.html": "Hub central de herramientas de Inteligencia Artificial (Psilogia IA).",
        "facturas.html": "Módulo de facturación, cobros y gestión económica.",
        "configuracion.html": "Ajustes del facultativo, centros de trabajo y preferencias del sistema.",
        "utilidades.html": "Copias de seguridad, exportación de datos (CSV/Excel) y optimización."
    },

    especificos_ia: {
        "Sentiment_dashboard.html": "Panel visual de evolución emocional mediante análisis de notas.",
        "Pautas.html": "Generador de recomendaciones personalizadas para pacientes tras la sesión.",
        "Mapa_calor.html": "Análisis de patrones lingüísticos y adjetivos usados en terapia.",
        "Copiloto.html": "Asistente en tiempo real (Voice-to-Insight) para transcripción y notas clínicas."
    },

    flujos_comunes: {
        crear_cita: "Desde agenda.html pulsando en el calendario o botón '+'.",
        ver_historia: "Desde pacientes.html -> Seleccionar paciente -> Ver Expediente.",
        diagnostico_ia: "Dentro del expediente de un paciente, buscar el icono de Psia o ir a la sección de Psilogia IA.",
        configurar_clinica: "Sección de centros/clínicas dentro de configuración o menús laterales."
    },

    iconografia: {
        "🏠": "Inicio/Dashboard",
        "📅": "Agenda",
        "👤": "Pacientes",
        "🛠️": "Utilidades/Configuración",
        "✨": "Funciones de IA",
        "🗑️": "Eliminar registro",
        "✏️": "Editar registro"
    }
};

export default PSICOFACT_APP_MAP;
