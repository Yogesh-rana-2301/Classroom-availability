import { useEffect, useMemo, useState } from "react";
import { AuditTable } from "../features/admin";
import { fetchAdminAuditLogs } from "../features/admin/api/adminApi";
import TextInput from "../shared/forms/TextInput";
import Button from "../shared/components/Button";

const DEFAULT_PAGE_SIZE = 20;

export default function AdminAuditLogsPage() {
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");
  const [userId, setUserId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [data, setData] = useState({
    rows: [],
    total: 0,
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    count: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const query = useMemo(() => {
    const params = { page, pageSize };

    if (action.trim()) {
      params.action = action.trim();
    }

    if (entity.trim()) {
      params.entity = entity.trim();
    }

    if (userId.trim()) {
      params.userId = userId.trim();
    }

    return params;
  }, [action, entity, page, pageSize, userId]);

  useEffect(() => {
    let active = true;

    async function run() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetchAdminAuditLogs(query);
        if (active) {
          setData({
            rows: response?.rows || [],
            total: response?.total || 0,
            page: response?.page || page,
            pageSize: response?.pageSize || pageSize,
            count: response?.count || 0,
          });
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError?.response?.data?.message ||
              "Unable to load audit logs. Please try again.",
          );
          setData((current) => ({ ...current, rows: [], total: 0, count: 0 }));
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
  }, [page, pageSize, query]);

  const totalPages = Math.max(
    1,
    Math.ceil((data.total || 0) / (data.pageSize || pageSize)),
  );

  function clearFilters() {
    setAction("");
    setEntity("");
    setUserId("");
    setPage(1);
    setPageSize(DEFAULT_PAGE_SIZE);
  }

  return (
    <section className="page admin-audit-page">
      <h1>Audit Logs</h1>
      <p>Immutable trail of booking, cancellation, and override events.</p>

      <div className="admin-audit-toolbar">
        <label>
          Action
          <TextInput
            type="text"
            value={action}
            placeholder="AUTH_LOGIN"
            onChange={(event) => {
              setAction(event.target.value);
              setPage(1);
            }}
          />
        </label>

        <label>
          Entity
          <TextInput
            type="text"
            value={entity}
            placeholder="BOOKING"
            onChange={(event) => {
              setEntity(event.target.value);
              setPage(1);
            }}
          />
        </label>

        <label>
          User ID
          <TextInput
            type="text"
            value={userId}
            placeholder="clx123"
            onChange={(event) => {
              setUserId(event.target.value);
              setPage(1);
            }}
          />
        </label>

        <label>
          Page Size
          <select
            value={String(pageSize)}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
          >
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </label>

        <div className="admin-audit-toolbar-actions">
          <Button type="button" onClick={clearFilters}>
            Reset Filters
          </Button>
        </div>
      </div>

      {error ? (
        <p className="status-error" role="alert">
          {error}
        </p>
      ) : null}

      {isLoading ? <p>Loading audit logs...</p> : null}

      {!isLoading && data.rows.length === 0 ? (
        <p>No audit log rows found for selected filters.</p>
      ) : null}

      {data.rows.length > 0 ? (
        <div className="admin-audit-table-wrap">
          <AuditTable rows={data.rows} />
        </div>
      ) : null}

      <div className="admin-audit-pagination">
        <p>
          Page {page} of {totalPages} | Total rows: {data.total || 0}
        </p>

        <div className="admin-audit-pagination-actions">
          <Button
            type="button"
            disabled={page <= 1 || isLoading}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </Button>

          <Button
            type="button"
            disabled={page >= totalPages || isLoading}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
