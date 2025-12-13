export async function getPeriod(
  searchParams: Promise<Record<string, string | string[] | undefined>>,
) {
  const searchParamsResolved = await searchParams;
  const periodParam = searchParamsResolved.period;
  const period = Array.isArray(periodParam)
    ? periodParam[0]
    : (periodParam ?? "all");

  return period;
}
