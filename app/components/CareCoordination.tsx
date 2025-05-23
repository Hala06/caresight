export default function PostureMonitor() {
  return (
    <>
      {/* Care Coordination */}
      <div className="bg-white p-4 rounded-2xl shadow-lg col-span-1">
        <h2 className="text-xl font-bold mb-2">Care Coordination</h2>
        <div className="flex flex-col space-y-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full">
            Send Summary to Family
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-full">
            Schedule Check-in
          </button>
        </div>
      </div>
    </>
  );
}
