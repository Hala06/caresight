export default function EmergencyContacts() {
  return (
    // <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-r from-purple-500 to-blue-500 min-h-screen">
    <div>
      {/* Emergency Contacts */}
      <div className="bg-red-500 text-white p-4 rounded-2xl shadow-lg col-span-1">
        <h2 className="text-xl font-bold mb-2">Emergency Contacts</h2>
        <ul>
          <li className="flex justify-between items-center py-1">
            Dr. Smith (Primary) <input type="checkbox" />
          </li>
          <li className="flex justify-between items-center py-1">
            Family (Sarah) <input type="checkbox" />
          </li>
          <li className="flex justify-between items-center py-1 font-bold">
            Emergency: 911{" "}
            <span className="bg-red-700 text-white px-2 py-1 rounded-full">
              !
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
