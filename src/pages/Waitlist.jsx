import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

const Waitlist = () => {
  const [waitlistData, setWaitlistData] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    const fetchWaitlistData = async () => {
      try {
        const response = await fetch("https://api.confidanto.com/api/waitlist/waitlist-data");
        const data = await response.json();
        setWaitlistData(data); // Assuming the API returns an array of objects
      } catch (error) {
        console.error("Error fetching waitlist data:", error);
      }
    };

    fetchWaitlistData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <AdminSidebar />
      <div className="w-screen md:w-4/5 lg:w-3/4 p-4 md:p-6 mx-auto overflow-y-scroll">
        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <tr className="text-left text-xs md:text-sm font-semibold uppercase tracking-wide">
                <th className="py-3 px-2 md:px-5">Full Name</th>
                <th className="py-3 px-2 md:px-5">Business Email Address</th>
                <th className="py-3 px-2 md:px-5">Full Location</th>
                <th className="py-3 px-2 md:px-5">Full Company Name</th>
                <th className="py-3 px-2 md:px-5">You are</th>
                <th className="py-3 px-2 md:px-5">Experience Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {waitlistData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="py-3 px-2 md:px-5 whitespace-nowrap text-xs md:text-sm">
                    {item.fullName}
                  </td>
                  <td className="py-3 px-2 md:px-5 whitespace-nowrap text-xs md:text-sm">
                    {item.email}
                  </td>
                  <td className="py-3 px-2 md:px-5 whitespace-nowrap text-xs md:text-sm">
                    {item.location}
                  </td>
                  <td className="py-3 px-2 md:px-5 whitespace-nowrap text-xs md:text-sm">
                    {item.companyName}
                  </td>
                  <td className="py-3 px-2 md:px-5 whitespace-nowrap text-xs md:text-sm">
                    {item.userType}
                  </td>
                  <td className="py-3 px-2 md:px-5 whitespace-nowrap text-xs md:text-sm">
                    {item.experienceLevel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Waitlist;
