import { Link } from "react-router-dom";
import Button from "../shared/components/Button";
import PageHeader from "../shared/components/PageHeader";

export default function DashboardPage() {
  return (
    <section className="page">
      <PageHeader
        title="Dashboard"
        description="Role-aware overview: live availability, quick actions, pending bookings."
        breadcrumbs={[{ label: "Dashboard" }]}
        actions={
          <Link to="/classrooms">
            <Button type="button">Browse Rooms</Button>
          </Link>
        }
      />
    </section>
  );
}
