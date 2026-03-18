import { useEffect, useState } from "react";
import { fetchClassrooms } from "../api/availabilityApi";

export function useAvailability(filters) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function run() {
      setIsLoading(true);
      try {
        const response = await fetchClassrooms(filters);
        if (active) {
          setData(response.items || []);
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

  return { data, isLoading };
}
