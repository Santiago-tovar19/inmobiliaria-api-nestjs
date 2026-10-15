type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export function laravelPaginate({
  data,
  total,
  perPage,
  currentPage,
  baseUrl,
}: {
  data: any[];
  total: number;
  perPage: number;
  currentPage: number;
  baseUrl: string;
}) {
  const lastPage = Math.ceil(total / perPage);

  const makePageUrl = (page: number | null) =>
    page ? `${baseUrl}?page=${page}&perPage=${perPage}` : null;

  const links: PaginationLink[] = [];

  // Previous
  links.push({
    url: currentPage > 1 ? makePageUrl(currentPage - 1) : null,
    label: '« Previous',
    active: false,
  });

  // Pages
  for (let page = 1; page <= lastPage; page++) {
    links.push({
      url: makePageUrl(page),
      label: String(page),
      active: page === currentPage,
    });
  }

  // Next
  links.push({
    url: currentPage < lastPage ? makePageUrl(currentPage + 1) : null,
    label: 'Next »',
    active: false,
  });

  return {
    current_page: currentPage,
    data,
    first_page_url: makePageUrl(1),
    from: total ? (currentPage - 1) * perPage + 1 : null,
    last_page: lastPage,
    last_page_url: makePageUrl(lastPage),
    links,
    next_page_url: currentPage < lastPage ? makePageUrl(currentPage + 1) : null,
    path: baseUrl,
    per_page: perPage,
    prev_page_url: currentPage > 1 ? makePageUrl(currentPage - 1) : null,
    to: Math.min(currentPage * perPage, total),
    total,
  };
}
