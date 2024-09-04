import axios from 'axios';
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const MarketDashboard = () => {
  const [users, setUsers] = useState([]);
  const [regions, setRegions] = useState({});
  const [subscriptions, setSubscriptions] = useState([]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await axios.post('http://localhost:8080/api/fetch-users');
        console.log('User data fetched and saved successfully');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, []);
  useEffect(() => {
    // Fetch additional user details (region and subscription) using POST method
    fetch('https://api.confidanto.com/all-users-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const usersArray = data.results || [];
        const regionsMap = usersArray.reduce((acc, user) => {
          acc[user.email] = user.region;
          return acc;
        }, {});
        
        setRegions(regionsMap);
        setSubscriptions(usersArray.map(user => user.subscription));
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });
  
    // Fetch project data
    fetch('https://api.confidanto.com/projects-data/fetch-project-list-all-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then(response => response.json())
      .then(data => {
        const groupedUsers = data.reduce((acc, project) => {
          const { email, name, category, invited_users, trialStartDate } = project;
          
          const trialPeriod = 15; // Define the trial period
          const currentDate = new Date();
          const startDate = trialStartDate ? new Date(trialStartDate) : null;
          let remainingDays = 0;

          if (startDate) {
            const diffTime = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
            remainingDays = isNaN(diffTime) ? 0 : Math.max(trialPeriod - diffTime, 0);
          }

          if (!acc[email]) {
            acc[email] = {
              email,
              projects: []
            };
          }
  
          acc[email].projects.push({
            name,
            category,
            account: invited_users || '', // Connected account
            remainingDays,
          });
  
          return acc;
        }, {});
  
        const usersArray = Object.values(groupedUsers);
        setUsers(usersArray);
      })
      .catch(error => {
        console.error('Error fetching project data:', error);
      });
  }, []);

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="bg-gray-100 flex flex-col p-6 w-screen overflow-y-scroll">
        <header className="text-4xl font-bold text-gray-800 mb-6">Confidanto Marketing Dashboard</header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Total Users</h2>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Total Projects</h2>
            <p className="text-3xl font-bold text-green-600">{users.reduce((sum, user) => sum + user.projects.length, 0)}</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Active Trials</h2>
            <p className="text-3xl font-bold text-red-600">
              {users.reduce((sum, user) => sum + user.projects.reduce((pSum, project) => pSum + (project.remainingDays > 0 ? 1 : 0), 0), 0)}
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Total Subscriptions</h2>
            <p className="text-3xl font-bold text-purple-600">
              {subscriptions.filter(subscription => subscription === 'active').length}
            </p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg mt-6 p-6">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">User Name</th>
                <th className="px-4 py-2 text-left">Region</th>
                <th className="px-4 py-2 text-left">Project</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left w-28">Connected Account</th>
                <th className="px-4 py-2 text-left">Remaining Trial Days</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, userIndex) => (
                user.projects.map((project, projectIndex) => (
                  <tr key={`${userIndex}-${projectIndex}`} className={`border-t ${projectIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                    <td className="px-4 py-2">{projectIndex === 0 ? user.email : ''}</td>
                    <td className="px-4 py-2">{regions[user.email] || 'N/A'}</td>
                    <td className="px-4 py-2">{project.name}</td>
                    <td className="px-4 py-2">{project.category}</td>
                    <td className="px-4 py-2">{project.account}</td>
                    <td className="px-4 py-2">{isNaN(project.remainingDays) ? 'N/A' : project.remainingDays}</td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarketDashboard;

