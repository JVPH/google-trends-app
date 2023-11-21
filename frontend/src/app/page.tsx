"use client";
import { useState } from "react";
import styles from "./page.module.css";
import useDMAList from "./useDMAlist";
import { useQuery } from "@tanstack/react-query";
import fetchGoogleTrendsQuery from "./fetchGoogleTrendsQuery";

export default function Home() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [requestParams, setRequestParams] = useState({
    week_start: "",
    week_end: "",
    dma_name: "",
    refresh_start: "",
    refresh_end: "",
  });

  const [dma_names] = useDMAList();
  const results = useQuery({
    queryKey: ["googleTrendsQuery", requestParams],
    queryFn: fetchGoogleTrendsQuery,
    enabled: formSubmitted,
  });

  const googleTrendsData = results?.data ?? [];

  console.log(googleTrendsData);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent default browser page refresh.
    e.preventDefault();

    // Get form data as an object.
    const data = new FormData(e.currentTarget);
    const obj = {
      week_start: data.get("week_start")?.toString() ?? "",
      week_end: data.get("week_end")?.toString() ?? "",
      dma_name: data.get("dma_name")?.toString() ?? "",
      refresh_start: data.get("refresh_start")?.toString() ?? "",
      refresh_end: data.get("refresh_end")?.toString() ?? "",
    };

    // Submit to your backend API...
    console.log(obj);
    setRequestParams(obj);
    setFormSubmitted(true);
  };

  return (
    <main className={styles.main}>
      <form onSubmit={onSubmit}>
        <label htmlFor="week_start">
          Start Date
          <input
            id="week_start"
            name="week_start"
            type="date"
            // min="2019-01-01"
            // max="2022-11-10"
            required
          />
        </label>
        <label htmlFor="week_end">
          End Date
          <input id="week_end" name="week_end" type="date" required />
        </label>
        <label htmlFor="dma_name">
          DMA Regions
          <select
            disabled={!dma_names.length}
            id="dma_name"
            name="dma_name"
            required
          >
            <option />
            {dma_names.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="refresh_start">
          refresh_start
          <input id="refresh_start" name="refresh_start" type="date" required />
        </label>
        <label htmlFor="refresh_end">
          refresh_end
          <input id="refresh_end" name="refresh_end" type="date" required />
        </label>
        <button type="submit">run query</button>
      </form>
    </main>
  );
}
