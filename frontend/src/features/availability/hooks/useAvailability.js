import { useEffect, useState } from "react";
import { fetchClassrooms } from "../api/availabilityApi";

export function useAvailability(filters) {
  const [data, setData] = useState({
    items: [],
    total: 0,
    page: 1,
    pageSize: 20,
    count: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function run() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetchClassrooms(filters);

        if (active) {
          setData({
            items: response?.items || [],
            total: response?.total || 0,
            page: response?.page || filters?.page || 1,
            pageSize: response?.pageSize || filters?.pageSize || 20,
            count: response?.count || 0,
          });
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError?.response?.data?.message ||
              "Failed to load classrooms. Please try again.",
          );
          setData((current) => ({
            ...current,
            items: [],
            count: 0,
          }));
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    run();

    return () => {
      active = false;
    };
  }, [filters]);

  return { data, isLoading, error };
}
