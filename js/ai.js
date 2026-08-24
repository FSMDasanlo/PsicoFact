// Única función de acceso a la API de IA — todas las páginas la usan.
async function callGroqAI(messages, { temperature = 0.5, maxTokens } = {}) {
    const body = {
        model: window.APP_CONFIG?.aiModel || 'openai/gpt-oss-120b',
        messages,
        temperature
    };
    if (maxTokens) body.max_tokens = maxTokens;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.APP_CONFIG?.groqApiKey}`
        },
        body: JSON.stringify(body)
    });

    const raw = await response.text();
    let data = null;
    try { data = raw ? JSON.parse(raw) : null; } catch (_) {}

    if (!response.ok) {
        if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After');
            const hint = retryAfter ? ` Intenta de nuevo en ${retryAfter}s.` : ' Intenta de nuevo en unos segundos.';
            throw new Error('Límite de uso alcanzado (429).' + hint);
        }
        throw new Error(data?.error?.message || `Error HTTP ${response.status}`);
    }

    let content = data?.choices?.[0]?.message?.content || '';
    // Elimina bloques <think> que algunos modelos embeben en el contenido
    content = content.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();

    if (!content) {
        console.error('[callGroqAI] Sin contenido:', { status: response.status, model: body.model, data });
        throw new Error('La IA no devolvió respuesta utilizable.');
    }

    return content;
}
