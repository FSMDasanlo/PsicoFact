/**
 * Importa las funciones de Firebase y el SDK de Google Generative AI.
 * Asegúrate de que tu package.json en la carpeta 'functions' tenga estas dependencias.
 */
const { onCall } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require("firebase-functions/logger"); // Para logs en Cloud Functions

// Configura tu clave de API de Gemini.
// ¡IMPORTANTE! No la pongas directamente aquí en producción.
// Usa las variables de entorno de Firebase Functions:
// firebase functions:config:set gemini.api_key="TU_API_KEY_DE_GEMINI"
// Luego, accede a ella con process.env.GEMINI_API_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "TU_API_KEY_DE_GEMINI_AQUI_PARA_TESTS_LOCALES"; // Reemplaza con tu clave real para pruebas locales si no usas config
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Define la función `generarDiagnostico` como una función HTTPS Callable
exports.generarDiagnostico = onCall(async (request) => {
    logger.info("Iniciando generarDiagnostico Cloud Function", { structuredData: true });

    // Verifica que la solicitud contenga los datos de evaluación
    if (!request.data || !request.data.evaluationData) {
        logger.error("Datos de evaluación no proporcionados en la solicitud.");
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Se requiere 'evaluationData' para generar el diagnóstico."
        );
    }

    const evaluationData = request.data.evaluationData;

    // Construye un prompt para la IA con los datos de la evaluación
    let prompt = "Eres un psicólogo clínico experto. Analiza la siguiente información de una evaluación psicológica y genera una impresión diagnóstica concisa y profesional, incluyendo posibles codificaciones (ej. DSM-5, CIE-10) si la información lo permite. Si la información es insuficiente, indícalo. No incluyas preguntas ni sugerencias de tratamiento, solo el diagnóstico.\n\n";
    
    // Añade los datos de la evaluación al prompt
    // Puedes ajustar cómo formateas esto para que la IA lo entienda mejor
    for (const section in evaluationData) {
        if (typeof evaluationData[section] === 'object' && evaluationData[section] !== null) {
            prompt += `\n--- ${section.replace(/_/g, ' ').toUpperCase()} ---\n`;
            for (const key in evaluationData[section]) {
                if (evaluationData[section][key]) {
                    prompt += `${key.replace(/_/g, ' ')}: ${evaluationData[section][key]}\n`;
                }
            }
        } else if (evaluationData[section]) {
            prompt += `\n--- ${section.replace(/_/g, ' ').toUpperCase()} ---\n`;
            prompt += `${evaluationData[section]}\n`;
        }
    }

    logger.info("Prompt generado para la IA:", { prompt: prompt.substring(0, 500) + "..." }); // Log solo una parte del prompt

    try {
        // Inicializa el modelo de IA (puedes elegir 'gemini-pro' o 'gemini-1.5-pro' si tienes acceso)
        const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // O "gemini-1.5-pro"

        // Genera el contenido con la IA
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        logger.info("Diagnóstico generado por la IA:", { diagnostico: text });

        // Devuelve el diagnóstico al cliente
        return { diagnostico: text };

    } catch (error) {
        logger.error("Error al generar diagnóstico con IA:", error);
        throw new functions.https.HttpsError(
            "internal",
            "Error al generar el diagnóstico con IA.",
            error.message
        );
    }
});
