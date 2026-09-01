/**
 * Очистка RichText от HTML-разметки и HTML-сущностей.
 *
 * Предварительное удаление содержимого тегов `<script>` и `<style>`.
 * Удаление остальных HTML-тегов с сохранением разделения текстовых фрагментов пробелами.
 * 
 * Декодирование часто используемых именованных и числовых HTML-сущностей.
 * Нормализация последовательностей пробельных символов и удаление пробелов
 * в начале и конце результата.
 *
 * @param html - RichText в виде HTML-строки.
 *
 * @returns Очищенный текст без HTML-разметки и поддерживаемых HTML-сущностей.
 * При отсутствии входного значения - пустая строка.
 * 
 * @example
 * 
 * const richText = `<h1>Hello World</h1>`
 * 
 * stripHtml(richText) // 'Hello World'
 */
export function stripHtml(html: string | null | undefined) {
    if (!html) return '';

    return html
        .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
        .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
        .replace(/<\/?[^>]+(>|$)/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;|&apos;/gi, "'")
        .replace(/&laquo;/gi, '«')
        .replace(/&raquo;/gi, '»')
        .replace(/&ldquo;/gi, '“')
        .replace(/&rdquo;/gi, '”')
        .replace(/&bdquo;/gi, '„')
        .replace(/&ndash;/gi, '–')
        .replace(/&mdash;/gi, '—')
        .replace(/&copy;/gi, '©')
        .replace(/&reg;/gi, '®')
        .replace(/&trade;/gi, '™')
        .replace(/&deg;/gi, '°')
        .replace(/&rub;/gi, '₽')
        .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
        .replace(/\s+/g, ' ')
        .trim();
}
