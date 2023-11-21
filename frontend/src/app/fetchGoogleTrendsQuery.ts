import { QueryFunction } from "@tanstack/react-query";
import type { GoogleTrendsAPIResponse } from "./APIResponseTypes";

const baseUrl = "http://localhost:5000";

const fetchGoogleTrendsQuery: QueryFunction<
  GoogleTrendsAPIResponse[],
  [
    "googleTrendsQuery",
    {
      week_start: string;
      week_end: string;
      dma_name: string;
      refresh_start: string;
      refresh_end: string;
    },
  ]
> = async function ({ queryKey }) {
  const { week_start, week_end, dma_name, refresh_start, refresh_end } =
    queryKey[1];

  const res = await fetch(
    `${baseUrl}/api/queries/make_dataset_query?week_start=${week_start}&week_end=${week_end}&refresh_start=${refresh_start}&refresh_end=${refresh_end}&dma_name=${dma_name}`,
  );

  if (!res.ok)
    throw new Error(
      `Dataset query did not work: ${week_start}, ${week_end}, ${refresh_start}, ${refresh_end}, ${dma_name}`,
    );

  return res.json();
};

export default fetchGoogleTrendsQuery;
