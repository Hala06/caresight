type HealthOverviewProps = {
  medicationsCount: number;
  nextAppointment: string;
  healthScore: string;
};

export default function HealthOverview({
  medicationsCount,
  nextAppointment,
  healthScore,
}: HealthOverviewProps) {
  return (
    <div className="w-1/4 bg-white  text-black dark:text-white rounded-2xl shadow-md p-6 mx-4 my-4 border dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-800  mb-4">
        🗹 Health Overview
      </h2>

      {/* Medications */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 ">
          <div className="h-2 w-2 rounded-sm bg-blue-400" />
          Medications
        </div>
        <div className="text-sm font-semibold text-green-600">
          {medicationsCount} Active
        </div>
      </div>

      {/* Next Appointment */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 ">
          <div className="h-2 w-2 rounded-sm bg-orange-400" />
          Next Appointment
        </div>
        <div className="text-sm font-semibold text-orange-500">
          {nextAppointment}
        </div>
      </div>

      {/* Health Score */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-600 ">
          <div className="h-2 w-2 rounded-sm bg-green-500" />
          Health Score
        </div>
        <div className="text-sm font-semibold text-green-600">
          {healthScore}
        </div>
      </div>
    </div>
  );
}
