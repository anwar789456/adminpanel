import './Dashboard.scss';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h3>Revenue</h3>
          <p>0 Tnd</p>
        </div>
        <div className="stat-card">
          <h3>Growth</h3>
          <p>+0%</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;