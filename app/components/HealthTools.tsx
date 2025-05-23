export default function HealthTools() {
  return (
    <>
      <div className="w-1/4 bg-white  text-black dark:text-white rounded-2xl shadow-md p-6 mx-4 my-4 border dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800  mb-4">
          🗹 Health Tools
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm border bg-blue-400 rounded-sm p-2">
            <div className="border h-2 w-2 rounded-sm bg-white" />
            Medication Tracker
          </div>
          <div className="flex items-center gap-2 text-sm bg-green-500 rounded-sm p-2">
            <div className="h-2 w-2 rounded-sm bg-white" />
            Appointment Scheduler
          </div>
          <div className="flex items-center gap-2 text-sm  bg-orange-400 rounded-sm p-2">
            <div className="h-2 w-2 rounded-sm bg-white" />
            Health Score Calculator
          </div>
        </div>
      </div>
    </>
  );
}
