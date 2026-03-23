import { useCallback, useEffect, useState } from "react";
import { fetchMyBookings } from "../api/bookingsApi";

export function useBookings(query = {}) {
  const [data, setData] = useState({
    items: [],
    total: 0,
    page: 1,
    pageSize: 20,
    count: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetchMyBookings(query);
      setData({
        items: response?.items || [],
        total: response?.total || 0,
        page: response?.page || query?.page || 1,
        pageSize: response?.pageSize || query?.pageSize || 20,
        count: response?.count || 0,
      });
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Failed to fetch your bookings. Please try again.",
      );
      setData((current) => ({
        ...current,
        items: [],
        total: 0,
        count: 0,
      }));
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    let active = true;

    async function run() {
      if (!active) {
        return;
      }

      await refetch();
    }

    run();

    return () => {
      active = false;
    };
  }, [refetch]);

  return { data, isLoading, error, refetch };
}
