import { QueryStatus, useQuery } from "@tanstack/react-query";
import fetchDMAList from "./fetchDMAList";

export default function useDMAList() {
  const results = useQuery({ queryKey: ["dmaList"], queryFn: fetchDMAList });

  // safely checks if dma_names exist, if it doesn't it returns an empty array
  return [results?.data?.dma_names ?? [], results.status] as [
    string[],
    QueryStatus,
  ];
}
