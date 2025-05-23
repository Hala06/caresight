export default function HealthAlerts() {
  return (
    <>
      {/* Health Alerts */}
      <div className="bg-white p-4 rounded-2xl shadow-lg col-span-1">
        <h2 className="text-xl font-bold mb-2">Health Alerts</h2>
        <div className="border-2 border-yellow-400 bg-yellow-100 text-yellow-800 p-3 rounded-xl">
          <p>💊 Medication reminder: Take blood pressure medication at 8 PM</p>
        </div>
      </div>
    </>
  );
}
