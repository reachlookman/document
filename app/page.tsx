// app/page.tsx or wherever this page is rendered
import { Suspense } from "react";
import Home from "../components/HomeClient"; // Move your current code to this component

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Home />
    </Suspense>
  );
}
