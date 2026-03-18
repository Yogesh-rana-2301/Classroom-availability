import { useEffect, useState } from "react";
import { fetchMyBookings } from "../api/bookingsApi";

export function useBookings() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function run() {
      setIsLoading(true);
      try {
        const response = await fetchMyBookings();
        if (active) {
          setItems(response.items || []);
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
  }, []);

  return { items, isLoading };
}
