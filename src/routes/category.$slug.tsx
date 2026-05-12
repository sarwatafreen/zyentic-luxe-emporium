import { createFileRoute, Link, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/category/$slug")({
  component: () => {
    const { slug } = Route.useParams();
    return <Navigate to="/shop" search={{ q: "", cat: slug }} />;
  },
});

// keep Link import to satisfy unused warnings if any tooling checks
void Link;
