import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

const Waitlist = () => {
  const [waitlistData, setWaitlistData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWaitlistData = async () => {
      try {
        const response = await fetch(
          "https://api.confidanto.com/wish-list/fetch",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setWaitlistData(data);
      } catch (err) {
        console.error("Error fetching waitlist data:", err);
        setError("Failed to load waitlist. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWaitlistData();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Waitlist Overview
        </h1>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500 animate-pulse text-lg">
                Loading waitlist...
              </p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : waitlistData.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">No waitlist data found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr className="text-left text-xs md:text-sm font-semibold uppercase tracking-wide">
                    <th className="py-4 px-4 md:px-6">Full Name</th>
                    <th className="py-4 px-4 md:px-6">Business Email</th>
                    <th className="py-4 px-4 md:px-6">Location</th>
                    <th className="py-4 px-4 md:px-6">Company</th>
                    <th className="py-4 px-4 md:px-6">User Type</th>
                    <th className="py-4 px-4 md:px-6">Experience</th>
                    <th className="py-4 px-4 md:px-6">Joined At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {waitlistData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-3 px-4 md:px-6 text-gray-700 text-xs md:text-sm">
                        {item.fullName}
                      </td>
                      <td className="py-3 px-4 md:px-6 text-gray-700 text-xs md:text-sm">
                        {item.email}
                      </td>
                      <td className="py-3 px-4 md:px-6 text-gray-700 text-xs md:text-sm">
                        {item.location}
                      </td>
                      <td className="py-3 px-4 md:px-6 text-gray-700 text-xs md:text-sm">
                        {item.companyName}
                      </td>
                      <td className="py-3 px-4 md:px-6 text-gray-700 text-xs md:text-sm">
                        {item.userType}
                      </td>
                      <td className="py-3 px-4 md:px-6 text-gray-700 text-xs md:text-sm">
                        {item.experienceLevel}
                      </td>
                      <td className="py-3 px-4 md:px-6 text-gray-500 text-xs md:text-sm">
                        {formatDate(item.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Waitlist;
