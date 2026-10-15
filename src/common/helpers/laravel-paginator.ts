type LaravelLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export function buildLaravelPaginator<T>(params: {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  path: string; // ej: http://localhost:4000/api/appointments
  query?: Record<string, any>; // para preservar termino, etc.
  maxLinks?: number; // cuantos números mostrar (Laravel suele poner ... si son muchos)
}) {
  const {
    data,
    total,
    page,
    perPage,
    path,
    query = {},
    maxLinks = 10,
  } = params;

  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const currentPage = Math.min(Math.max(page, 1), lastPage);

  const from = total === 0 ? null : (currentPage - 1) * perPage + 1;
  const to = total === 0 ? null : Math.min(currentPage * perPage, total);

  const makeUrl = (p: number) => {
    const q = new URLSearchParams({
      ...Object.fromEntries(
        Object.entries(query).filter(([, v]) => v !== undefined && v !== null),
      ),
      page: String(p),
    });
    return `${path}?${q.toString()}`;
  };

  const firstPageUrl = makeUrl(1);
  const lastPageUrl = makeUrl(lastPage);
  const nextPageUrl = currentPage < lastPage ? makeUrl(currentPage + 1) : null;
  const prevPageUrl = currentPage > 1 ? makeUrl(currentPage - 1) : null;

  // ---- links[] estilo Laravel
  const links: LaravelLink[] = [];

  links.push({ url: prevPageUrl, label: '« Previous', active: false });

  // Ventana de páginas + "..."
  // Queremos mostrar hasta maxLinks números, centrados alrededor del currentPage
  const windowSize = Math.max(5, maxLinks);
  let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
  let end = start + windowSize - 1;

  if (end > lastPage) {
    end = lastPage;
    start = Math.max(1, end - windowSize + 1);
  }

  // Si start > 1, ponemos 1 y/o "..."
  if (start > 1) {
    links.push({ url: makeUrl(1), label: '1', active: currentPage === 1 });

    if (start > 2) {
      links.push({ url: null, label: '...', active: false });
    }
  }

  for (let p = start; p <= end; p++) {
    links.push({
      url: makeUrl(p),
      label: String(p),
      active: p === currentPage,
    });
  }

  // Si end < lastPage, ponemos "..." y último
  if (end < lastPage) {
    if (end < lastPage - 1) {
      links.push({ url: null, label: '...', active: false });
    }

    links.push({
      url: makeUrl(lastPage),
      label: String(lastPage),
      active: currentPage === lastPage,
    });
  }

  links.push({ url: nextPageUrl, label: 'Next »', active: false });

  return {
    current_page: currentPage,
    data,
    first_page_url: firstPageUrl,
    from,
    last_page: lastPage,
    last_page_url: lastPageUrl,
    links,
    next_page_url: nextPageUrl,
    path,
    per_page: perPage,
    prev_page_url: prevPageUrl,
    to,
    total,
  };
}
