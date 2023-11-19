"use client";
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [requestParams, setRequestParams] = useState({
    startDate: "",
    endDate: "",
    dmaRegion: "",
    score: "",
    rank: "",
  });

  const dmaRegions: string[] = [];

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent default browser page refresh.
    e.preventDefault();

    // Get form data as an object.
    const data = new FormData(e.currentTarget);
    const obj = {
      startDate: data.get("startDate")?.toString() ?? "",
      endDate: data.get("endDate")?.toString() ?? "",
      dmaRegion: data.get("dmaRegion")?.toString() ?? "",
      score: data.get("score")?.toString() ?? "",
      rank: data.get("rank")?.toString() ?? "",
    };

    // Submit to your backend API...
    console.log(obj);
    setRequestParams(obj);
  };

  return (
    <main className={styles.main}>
      <form onSubmit={onSubmit}>
        <label htmlFor="startDate">
          Start Date
          <input
            id="startDate"
            name="startDate"
            type="date"
            // min="2019-01-01"
            // max="2022-11-10"
            required
          />
        </label>
        <label htmlFor="endDate">
          End Date
          <input id="endDate" name="endDate" type="date" required />
        </label>
        <label htmlFor="dmaRegion">
          DMA Regions
          <select
            disabled={!dmaRegions.length}
            id="dmaRegion"
            name="dmaRegion"
            required
          >
            <option />
            {dmaRegions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="score">
          score
          <input id="score" name="score" type="number" min={0} max={100} />
        </label>
        <label htmlFor="rank">
          rank
          <input id="rank" name="rank" type="number" min={1} max={25} />
        </label>
        <button type="submit">run query</button>
      </form>
    </main>
  );
}
