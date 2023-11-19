import type { QueryFunctionContext } from "@tanstack/react-query";

const fetchDMAList = async ({
  queryKey,
}: QueryFunctionContext<[string, string | null | undefined]>) => {
  // insert flask api here
  const apiRes = await fetch(``);

  return apiRes.json();
};

export default fetchDMAList;
