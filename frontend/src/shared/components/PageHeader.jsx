import { Link } from "react-router-dom";

export default function PageHeader({
  title,
  description,
  breadcrumbs = [],
  meta = null,
  actions = null,
}) {
  return (
    <header className="page-header-block">
      {breadcrumbs.length ? (
        <nav className="page-breadcrumbs" aria-label="Breadcrumb">
          <ol>
            {breadcrumbs.map((crumb, index) => {
              const isCurrent = index === breadcrumbs.length - 1;

              return (
                <li key={`${crumb.label}-${index}`}>
                  {crumb.to && !isCurrent ? (
                    <Link to={crumb.to}>{crumb.label}</Link>
                  ) : (
                    <span aria-current={isCurrent ? "page" : undefined}>
                      {crumb.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      ) : null}

      <div className="page-header-main">
        <div className="page-header-copy">
          <h1>{title}</h1>
          {description ? <p>{description}</p> : null}
          {meta ? <p className="page-meta">{meta}</p> : null}
        </div>

        {actions ? <div className="page-header-actions">{actions}</div> : null}
      </div>
    </header>
  );
}
