import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FooterUser from "../../Components/User/Components_Js/FooterUser";
import "../../Design_Css/User/EditProfilePage.css";
import HeaderUserLogin from "../../Components/User/Components_Js/HeaderUserLogin";

function EditProfilePage() {
  const navigate = useNavigate();
  
  // State cho các thành phần cần thay đổi
  const [displayName, setDisplayName] = useState("Duy Độ");
  const [userPoints, setUserPoints] = useState(9999);
  const [email, setEmail] = useState(""); // State cho email
  const [phone, setPhone] = useState(""); // State cho số điện thoại

  useEffect(() => {
    // Lấy dữ liệu người dùng từ localStorage
    const userDataString = localStorage.getItem('currentUser');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setDisplayName(userData.tenHienThi || 'Tài khoản');
      setEmail(userData.email || '');
      setPhone(userData.phone || '');
      // setUserPoints(userData.points || 9999); // Bạn có thể dùng dòng này nếu có điểm trong localStorage
    }
  }, []);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  const handleMenuItemClick = (item) => {
    if (item === "points") {
      navigate("/EditProfile");
    } else if (item === "logout") {
      handleLogout();
    }
  };

  return (
    <>
      <HeaderUserLogin />

      <div className="dashboard-container">
        {/* Left Container - Profile Section */}
        <div className="left-container">
          <div className="profile-popup">
            <div className="profile-header">
              <span className="profile-name">{displayName}</span>
              <div className="membership-status">
                <img src="/Img_User/CoinUser.png" alt="Gold Member" className="gold-icon" />
                <span>Bạn là thành viên Gold của Debug Hotel</span>
              </div>
            </div>
            <div className="profile-menu-items">
              <div className="profile-menu-item" onClick={() => handleMenuItemClick("points")} style={{cursor: 'pointer'}}>
                  <img src="/Img_User/$.svg" alt="Points" className="menu-icon" />
                  <span>{userPoints} Điểm</span>
              </div>
              <a href="EditProfilePage">
                <div className="profile-menu-item active-menu-item">
                  <img src="/Img_User/user.svg" alt="Edit Profile" className="menu-icon" />
                  <span>Chỉnh sửa hồ sơ</span>
                </div>
              </a>
              <a href="TransactionHistory">
                <div className="profile-menu-item">
                  <img src="/Img_User/Lich.svg" alt="Transaction History" className="menu-icon" />
                  <span>Lịch sử giao dịch</span>
                </div>
              </a>
              <div className="profile-menu-item" onClick={() => handleMenuItemClick("logout")} style={{cursor: 'pointer'}}>
                  <img src="/Img_User/logout.svg" alt="Logout" className="menu-icon" />
                  <span>Đăng xuất</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Container */}
        <div className="right-container">
          <h1 className="rewards-title">Thông tin tài khoản</h1>
          
          {/* Phần Dữ liệu cá nhân giữ nguyên */}
          <div className="edit-profile-section">
            <h2 className="section-title">Dữ liệu cá nhân</h2>
            <div className="form-group">
              <label>Tên đầy đủ</label>
              <input type="text" className="form-input" placeholder=""/>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Giới tính</label>
                <select className="form-select">
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div className="form-group">
                <label>Ngày sinh</label>
                <div className="date-row">
                  <select className="form-select date-select"><option>2</option></select>
                  <select className="form-select date-select"><option>2000</option></select>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Thành phố cư trú</label>
              <input type="text" className="form-input" placeholder="Nhập thành phố cư trú" />
            </div>
            <div className="form-actions">
              <button className="cancel-button">Có thể để sau</button>
              <button className="save-button">Lưu</button>
            </div>
          </div>

          {/* === PHẦN EMAIL ĐÃ ĐƯỢC CẬP NHẬT === */}
          <div className="edit-profile-section">
            <div className="section-header">
              <h2 className="section-title">Email</h2>
            </div>
            <p className="section-description">Chỉ có thể sử dụng tối đa 3 email</p>
            <div className="email-list">
              {email ? (
                <div className="email-item">
                  <span>1. {email}</span>
                  <span className="email-label">Nơi nhận thông báo</span>
                </div>
              ) : (
                <p>Chưa có email nào được thêm.</p>
              )}
            </div>
            <button className="add-button">+ Thêm email</button>
          </div>

          {/* === PHẦN SỐ DI ĐỘNG ĐÃ ĐƯỢC CẬP NHẬT === */}
          <div className="edit-profile-section">
            <div className="section-header">
              <h2 className="section-title">Số di động</h2>
            </div>
            <p className="section-description">Chỉ có thể sử dụng tối đa 3 số di động</p>
            <div className="phone-list">
              {phone ? (
                <div className="phone-item">
                  <span>{phone}</span>
                </div>
              ) : (
                <p>Bạn chưa thêm số di động nào.</p>
              )}
            </div>
            <button className="add-button">+ Thêm số di động</button>
          </div>

          {/* === PHẦN TÀI KHOẢN LIÊN KẾT GIỮ NGUYÊN === */}
          <div className="edit-profile-section">
            <div className="section-header">
              <h2 className="section-title">Tài khoản đã Liên kết</h2>
            </div>
            <p className="section-description">Liên kết tài khoản mạng xã hội của bạn để đăng nhập Traveloka dễ dàng</p>
            <div className="linked-accounts">
              <div className="account-item">
                <div className="account-info">
                  <img src="/Img_User/fb.png" alt="Facebook" className="account-icon" />
                  <span>Facebook</span>
                </div>
                <button className="link-button">Liên kết</button>
              </div>
              <div className="account-item">
                <div className="account-info">
                  <img src="/Img_User/gg.png" alt="Google" className="account-icon" />
                  <span>Google</span>
                </div>
                <button className="link-button">Liên kết</button>
              </div>
              <div className="account-item">
                <div className="account-info">
                  <img src="/Img_User/ap.png" alt="Apple" className="account-icon" />
                  <span>Apple</span>
                </div>
                <button className="link-button">Liên kết</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterUser />
    </>
  );
}

export default EditProfilePage;