import { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FaFileExcel } from 'react-icons/fa';

function Dashboard() {
  const [reservationsReport, setReservationsReport] = useState([]);
  const [performanceReport, setPerformanceReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState(null); // 'summary' or 'performance'

  const fetchReservationSummary = async () => {
    setLoading(true);
    setError('');
    setView('summary');
    try {
      const res = await axios.get('http://localhost:5000/api/v1/reports/reservations?start=2025-01-01&end=2025-12-01');
      setReservationsReport(Array.isArray(res.data.data) ? res.data.data : []);
      setPerformanceReport([]);
    } catch (err) {
      setError('Failed to fetch reservation summary.');
      setReservationsReport([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurantPerformance = async () => {
    setLoading(true);
    setError('');
    setView('performance');
    try {
      const res = await axios.get('http://localhost:5000/api/v1/reports/restaurant-performance?month=4&year=2025');
      setPerformanceReport(Array.isArray(res.data.data) ? res.data.data : []);
      setReservationsReport([]);
    } catch (err) {
      setError('Failed to fetch restaurant performance.');
      setPerformanceReport([]);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${filename}.xlsx`);
  };

  return (
    <div className="container">
      <section className="heading">
        <h1>Dashboard</h1>
        <p>Overview of restaurant reservations and performance</p>
      </section>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
        <button className="btn btn-reverse" onClick={fetchReservationSummary}>
          Reservation Summary
        </button>
        <button className="btn" onClick={fetchRestaurantPerformance}>
          Top Restaurants
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Reservation Summary */}
      {view === 'summary' && reservationsReport.length > 0 && (
        <div>
          <h2>Reservation Summary (2025)</h2>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <button className="btn btn-sm btn-green" onClick={() => exportToExcel(reservationsReport, 'reservation-summary')}>
              <FaFileExcel style={{ marginRight: '6px' }} />
              Export to Excel
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#ffe5b4' }}>
                <th style={th}>Restaurant</th>
                <th style={th}>Total</th>
                <th style={th}>Confirmed</th>
                <th style={th}>Canceled</th>
                <th style={th}>Completed</th>
              </tr>
            </thead>
            <tbody>
              {reservationsReport.map((r, index) => (
                <tr key={index}>
                  <td style={td}>{r.restaurantName}</td>
                  <td style={td}>{r.totalReservations}</td>
                  <td style={td}>{r.confirmed}</td>
                  <td style={td}>{r.canceled}</td>
                  <td style={td}>{r.completed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Top Restaurants */}
      {view === 'performance' && performanceReport.length > 0 && (
        <div>
          <h2>Top Performing Restaurants (April 2025)</h2>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <button className="btn btn-sm btn-green" onClick={() => exportToExcel(performanceReport, 'top-restaurants')}>
              <FaFileExcel style={{ marginRight: '6px' }} />
              Export to Excel
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#ffe5b4' }}>
                <th style={th}>Restaurant</th>
                <th style={th}>Total Reservations</th>
              </tr>
            </thead>
            <tbody>
              {performanceReport.map((r, index) => (
                <tr key={index}>
                  <td style={td}>{r.restaurantName}</td>
                  <td style={td}>{r.totalReservations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Table cell styles
const th = {
  padding: '10px',
  border: '1px solid #ccc',
  textAlign: 'left',
  fontWeight: 'bold'
};

const td = {
  padding: '10px',
  border: '1px solid #ccc',
  textAlign: 'left'
};

export default Dashboard;
