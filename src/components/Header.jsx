import { FaSignInAlt, FaSignOutAlt, FaUser, FaUtensils } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <header className="header">
        
        <div className='logo' style={{ display: 'flex', alignItems: 'center', fontSize: '24px', fontWeight: 'bold' }}>
  <FaUtensils style={{ marginRight: '8px', color: '#fff' }} />
  <span style={{
    fontFamily: "'Pacifico', cursive",
    fontSize: '26px',
    color: '#fff',
    letterSpacing: '1px'
  }}>
    Tasty<span style={{ color: '#fbc02d' }}>Table</span>
  </span>
</div>
      <ul>
        {user ? (
          <li>
            <button className="topbar-btn" onClick={onLogout}>
              <FaSignOutAlt />
              Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login" className="topbar-btn">
                <FaSignInAlt />
                Sign In
              </Link>
            </li>
            <li>
              <Link to="/register" className="topbar-btn">
                <FaUser />
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
