import DocumentScanner from "./DocumentScanner";
import HealthOverview from "./HealthOverview";
import HealthTools from "./HealthTools";

// components/Hero.tsx
export default function Hero() {
  return (
    <>
      <div className="flex">
        <HealthOverview
          medicationsCount={3}
          nextAppointment="Tomorrow"
          healthScore="85/100"
        />

        <DocumentScanner />
      </div>
      <HealthTools />
    </>
  );
}
