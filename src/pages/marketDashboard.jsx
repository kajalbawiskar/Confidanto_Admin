import React, { useState, useEffect } from 'react';

const MarketDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    fetch('https://api.confidanto.com/projects-data/fetch-project-list-all-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ /* Include any required body data here */ }),
    })
      .then(response => response.json())
      .then(data => {
        // Group projects by user email
        const groupedUsers = data.reduce((acc, project) => {
          const { email, name, category, invited_users } = project;
          const remainingDays = Math.floor(Math.random() * 30); // Generate mock remaining days (replace this with actual data if available)

          if (!acc[email]) {
            acc[email] = {
              email,
              projects: []
            };
          }
          
          acc[email].projects.push({
            name,
            category,
            account: invited_users || '', // If there are invited users, show them as connected account
            remainingDays,
          });

          return acc;
        }, {});

        // Convert object to array for rendering
        const usersArray = Object.values(groupedUsers);
        setUsers(usersArray);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="flex ">
      <div className="bg-gray-100 flex flex-col p-6 w-screen overflow-auto">
        <header className="text-4xl font-bold text-gray-800 mb-6">Confidanto Marketing Dashboard</header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
        <div className="bg-white shadow-md rounded-lg mt-6 p-6">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">User Name</th>
                <th className="px-4 py-2 text-left">Project</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Connected Account</th>
                <th className="px-4 py-2 text-left">Remaining Trial Days</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, userIndex) => (
                user.projects.map((project, projectIndex) => (
                  <tr key={`${userIndex}-${projectIndex}`} className={`border-t ${projectIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                    <td className="px-4 py-2">{projectIndex === 0 ? user.email : ''}</td>
                    <td className="px-4 py-2">{project.name}</td>
                    <td className="px-4 py-2">{project.category}</td>
                    <td className="px-4 py-2">{project.account}</td>
                    <td className="px-4 py-2">{project.remainingDays}</td>
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
