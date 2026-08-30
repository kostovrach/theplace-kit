export function parseCmsQuery(raw: Record<string, string | string[] | undefined>): ICmsQuery {
    const result: ICmsQuery = {};

    // fields
    if (raw.fields !== undefined) {
        const value = Array.isArray(raw.fields) ? raw.fields[0] : raw.fields;
        if (typeof value === 'string' && value.trim()) {
            const trimmed = value.trim();

            if (trimmed.startsWith('[')) {
                try {
                    const parsed = JSON.parse(trimmed);
                    if (Array.isArray(parsed)) {
                        result.fields = parsed;
                    }
                } catch {
                    throw createError({
                        status: 400,
                        message: 'Invalid fields JSON',
                    });
                }
            } else {
                // Простой CSV: id,title,status
                result.fields = trimmed
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean);
            }
        }
    }

    // filter
    if (raw.filter !== undefined) {
        const value = Array.isArray(raw.filter) ? raw.filter[0] : raw.filter;
        if (typeof value === 'string' && value.trim()) {
            try {
                result.filter = JSON.parse(value);
            } catch {
                throw createError({
                    status: 400,
                    message: 'Invalid filter JSON',
                });
            }
        }
    }

    // sort
    if (raw.sort !== undefined) {
        const value = Array.isArray(raw.sort) ? raw.sort[0] : raw.sort;
        if (typeof value === 'string' && value.trim()) {
            const trimmed = value.trim();

            if (trimmed.startsWith('[')) {
                try {
                    const parsed = JSON.parse(trimmed);
                    if (Array.isArray(parsed)) {
                        result.sort = parsed;
                    }
                } catch {
                    throw createError({ status: 400, message: 'Invalid sort JSON' });
                }
            } else {
                result.sort = trimmed
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean);
            }
        }
    }

    // limit
    if (raw.limit !== undefined) {
        const value = Array.isArray(raw.limit) ? raw.limit[0] : raw.limit;
        const num = Number(value);
        if (!Number.isNaN(num)) {
            result.limit = num;
        }
    }

    // offset
    if (raw.offset !== undefined) {
        const value = Array.isArray(raw.offset) ? raw.offset[0] : raw.offset;
        const num = Number(value);
        if (!Number.isNaN(num) && num >= 0) {
            result.offset = num;
        }
    }

    // page
    if (raw.page !== undefined) {
        const value = Array.isArray(raw.page) ? raw.page[0] : raw.page;
        const num = Number(value);
        if (!Number.isNaN(num) && num >= 1) {
            result.page = num;
        }
    }

    // search
    if (raw.search !== undefined) {
        const value = Array.isArray(raw.search) ? raw.search[0] : raw.search;
        if (typeof value === 'string' && value.trim()) {
            result.search = value.trim();
        }
    }

    // deep
    if (raw.deep !== undefined) {
        const value = Array.isArray(raw.deep) ? raw.deep[0] : raw.deep;
        if (typeof value === 'string' && value.trim()) {
            try {
                result.deep = JSON.parse(value);
            } catch {
                throw createError({ status: 400, message: 'Invalid deep JSON' });
            }
        }
    }

    return result;
}
