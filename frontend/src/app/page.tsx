"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import useDMAList from "./useDMAlist";
import { useQuery } from "@tanstack/react-query";
import fetchGoogleTrendsQuery from "./fetchGoogleTrendsQuery";
import MyChart from "./chart";
import performLogin from "./services/login";
import queryService, { QueryParameters } from "./services/queries";
import LoginForm from "./components/LoginForm";
import type { LoginAPIResponse } from "./APIResponseTypes";

export default function Home() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [requestParams, setRequestParams] = useState({
    week_start: "",
    week_end: "",
    dma_name: "",
    refresh_start: "",
    refresh_end: "",
  });
  const [user, setUser] = useState<null | LoginAPIResponse>(null);

  const [dma_names] = useDMAList();
  const results = useQuery({
    queryKey: ["googleTrendsQuery", requestParams],
    queryFn: fetchGoogleTrendsQuery,
    enabled: formSubmitted,
  });

  const googleTrendsData = results?.data ?? [];

  const calculateOldestRefreshDate = () => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);
    return currentDate.toISOString().split("T")[0];
  };

  // check if user credentials are stored in local storage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      // queryService.setToken(user.access_token);
    }
  }, []);

  const handleLogin = async (username: string) => {
    try {
      const user = await performLogin(username);

      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      setUser(user);
      // queryService.setToken(user.access_token);
    } catch (error) {
      console.log(error);
    }
  };

  // Uncontrolled form to avoid unnecessary re-renders
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

    setRequestParams(obj);
    setFormSubmitted(true);
  };

  // submit query to backend
  const addQuery = async () => {
    try {
      const returnedBlog = await queryService.create(
        {
          ...requestParams,
          name: "My First Query",
        },
        user?.access_token as string
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {user === null ? (
        <LoginForm handleLogin={handleLogin} />
      ) : (
        <div className={styles.logged}>
          <p>
            <i>{user.username}</i> logged in
          </p>
        </div>
      )}
      <main className={styles.main}>
        <h1 className={styles.headline}>
          DMA Insights: Term Popularity and Rankings
        </h1>
        <form onSubmit={onSubmit} className={styles.form}>
          <label htmlFor="week_start">
            Initial Week
            <input
              id="week_start"
              name="week_start"
              type="date"
              // max="2022-11-10"
              required
            />
          </label>
          <label htmlFor="week_end">
            Final Week
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
            Initial Refresh
            <input
              id="refresh_start"
              name="refresh_start"
              type="date"
              min={calculateOldestRefreshDate()}
              required
            />
          </label>
          <label htmlFor="refresh_end">
            Final Refresh
            <input id="refresh_end" name="refresh_end" type="date" required />
          </label>
          <button className={styles.button} type="submit">
            run query
          </button>
        </form>
        <div style={{ width: 1400, height: 400 }}>
          {googleTrendsData.length ? <MyChart data={googleTrendsData} /> : null}
        </div>
        {/* save query button only available after a form has been submitted (and the request parameters are populated) */}
        {formSubmitted ? (
          <button className={styles.button} onClick={addQuery}>
            Save Query
          </button>
        ) : null}
      </main>
    </>
  );
}
