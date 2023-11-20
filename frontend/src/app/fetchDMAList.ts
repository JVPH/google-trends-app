import { QueryFunction } from "@tanstack/react-query";
import type { DMAListAPIResponse } from "./APIResponseTypes";

const fetchDMAList: QueryFunction<DMAListAPIResponse, ["dmaList"]> = async ({
  queryKey,
}) => {
  const res = await fetch(`http://localhost:5000/api/queries/dna_names`);

  if (!res.ok) {
    throw new Error(`DMAList fetch did not work.`);
  }

  return res.json();
};

export default fetchDMAList;
